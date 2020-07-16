import React, { Fragment } from 'react';
import { Query } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';

import "@patternfly/react-core/dist/styles/base.css";

import { Link } from 'react-router-dom';
import makeAnimated from 'react-select/animated';
import CreatableSelect from 'react-select/creatable';
import Page from '../../components/Page';
import { SelectService, SelectRecepient, Option, MultiValue } from "../../components/NotificationSelect";
import { sortByLabel, sortByValue} from '../../components/Utils';
import { RED, GREY, ColourStyles} from '../../components/ColourStyles';
import {
  Form,
  FormGroup,
  TextInput,
  TextArea,
  FormSelect,
  FormSelectOption,
  Button,
  Checkbox
} from '@patternfly/react-core';

const client = new ApolloClient({
  uri: window.GRAPHQL_URI,
});

const GET_SERVICE_NAMES = gql`
  query ServiceNames{
    apps_v1 {
      name
    }
  }
`;

const GET_SERVICE_OWNERS = gql`
  query GetServiceOwners{
    apps_v1 {
      path
      name
      serviceOwners {
        name
        email
      }
      serviceNotifications {
        name
        email
      }
      dependencies {
        name
      }
    }
  }
`;

const GET_USERS = gql`
  query GetUsers {
    users_v1 {
      path
      name
      org_username
      slack_username
    }
  }
`;

const GET_DEPENDENCIES = gql`
  query Dependencies{
    apps_v1 {
      name
      dependencies {
        name
      }
    }
}
`;

const GET_DEPENDENCIES_LIST = gql`
  query Dependencies{
    dependencies_v1 {
      name
    }
  }
`;

var user_dic = {};
var dependency_dic = {};
var all_services = [];

client
  .query({
    query: GET_USERS
  })
  .then(result => {
    for (var user of result.data.users_v1) {
      var dic = {};
      dic['path'] = user.path;
      if (user.slack_username) {
        dic['slack'] = user.slack_username;
      } else {
        dic['slack'] = user.org_username;
      }
      user_dic[user.name] = dic;
    }
  });

client
  .query({
    query: GET_SERVICE_NAMES
  })
  .then(result => {
    for (var service of result.data.apps_v1) {
      all_services.push(service.name);
    }
  });

client
  .query({
    query: GET_DEPENDENCIES
  })
  .then(result => {
    for (var service of result.data.apps_v1) {
      for (var dependency of service.dependencies){
        if (dependency_dic.hasOwnProperty(dependency.name)){
          dependency_dic[dependency.name].push(service.name);
        } else {
          dependency_dic[dependency.name] = [service.name];
        }
      }
    }
  });


class NewNotification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notification_type: 'Incident',
      selectedDependencies: [{"value": "None", "label": "None"}],
      selectedServices: [],
      selectedUsers: [],
      selectedSlackUsers: [],
      jira: '',
      short_description: '',
      long_description: '',
      validated: 'error'
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.options = [
      { value: 'Incident', label: 'Incident', disabled: false },
      { value: 'Maintenance', label: 'Maintenance', disabled: false },
      { value: 'Info', label: 'Info', disabled: false }
    ];
    this.user_path = [];
    this.user_dic = {};
    this.selected_service_names = [];
    this.dependency = [];
  }

  handleSubmit(event) {
    var dependencies = [];
    var services = [];
    var users = [];
    var users_str = '';
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var date = d.getDate();
    for (var s of this.state.selectedDependencies) {
      dependencies.push(s.value);
    }
    for (var s of this.state.selectedServices) {
      services.push(s.value);
    }
    for (var u of this.state.selectedUsers) {
      if (user_dic.hasOwnProperty(u.value)){
        users.push(user_dic[u.value]['path']);
      } else {
        users.push(u.value);
      }
      users_str += u.value + " | ";
    }
    // eslint-disable-next-line no-restricted-globals
    var r = confirm( "Preview" +  "\n"
    + "• Notification Type: " + this.state.notification_type + "\n"
    + "• Recipients (Email): " + users_str + "\n"
    + "• #Jira: " + this.state.jira + "\n"
    + '• Short Description: ' + this.state.short_description + "\n"
    + '• Description: ' + this.state.long_description + "\n"
    + "========================= " + "\n"
    + "Are you sure to send the notification? " + "\n"
    + "========================= " + "\n");
    if (r) {
      const notification = {'notification_type': this.state.notification_type,
                            'labels': '{}',
                            'date': year + '-' + month + '-' + date,
                            'affected_dependencies': dependencies,
                            'affected_services': services,
                            'recipients': users,
                            'jira': this.state.jira,
                            'short_description': this.state.short_description,
                            'description': this.state.long_description};
      fetch( window.QONTRACT_API_URL + "/notifications", {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notification),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        alert(`New notification successfully created.`);
      })
      .catch((error) => {
        console.error('Error:', error);
        alert(`Unsuccessful submission: ` + {error} + ` Please review the fields and resubmit.`);
      });
    };
    event.preventDefault();
  }

  render() {
    var { notification_type, selectedDependencies, selectedServices, selectedUsers, selectedSlackUsers, jira, short_description, long_description, validated, optionSelected, userSelected} = this.state;
    const animatedComponents = makeAnimated();
    var impacted_users = [];
   
    return (
      <Page title="Create a new notification" body = {
      <Form isHorizontal>
        <FormGroup label="Notification Type" isRequired fieldId="horizontal-form-title">
          <FormSelect 
            value={this.state.notification_type} 
            onChange={e => {
              this.setState({
                notification_type: e
              });
            }} 
            aria-label="FormSelect Input"
          >
          {this.options.map((option, index) => (
            <FormSelectOption key={index} value={option.value} label={'\u00A0\u00A0' + option.label} />
          ))}
          </FormSelect>
        </FormGroup>
        <FormGroup label="Affected Dependency" isRequired fieldId="horizontal-form-title">
          <Query query={GET_DEPENDENCIES_LIST}>
            {({ loading, error, data }) => {
              if (loading) return 'Loading...';
              if (error) return `Error! ${error.message}`;
              const all_dependencies = [{"value":"None", "label":"None"}];
              for (var dependency of data.dependencies_v1) {
                var dic = {};
                dic["value"] = dependency.name;
                dic["label"] = dependency.name;
                all_dependencies.push(dic);
              }
              return <Fragment>{
                <CreatableSelect
                  defaultValue={{value:"None", label:"None"}}
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isMulti
                  onChange={e => {
                    this.setState({
                      selectedDependencies: e
                    });
                  }}
                  options={sortByValue(all_dependencies.slice())}
                />
             }</Fragment>
             }}
          </Query>
        </FormGroup>
        <FormGroup 
          label="Affected Service" 
          isRequired 
          fieldId="horizontal-form-title" 
          helperText="Services highlighted in RED are affected by the selected dependency."
        >
          <Query query={GET_SERVICE_OWNERS}>
            {({ loading, error, data }) => {
              if (loading) return 'Loading...';
              if (error) return `Error! ${error.message}`;
              const all_services = [];
              for(var service of data.apps_v1) {
                var dic = {};
                dic["value"] = service.name;
                dic["label"] = service.name;
                dic["color"] = GREY;
                // dic["color"] = "#363636";
                if (selectedDependencies) {
                  for (var d of selectedDependencies) {
                    if (dependency_dic.hasOwnProperty(d.value)) {
                      if (dependency_dic[d.value].includes(service.name)) {
                        dic["color"] = RED;
                        // dic["color"] = '#DE350B';
                      }
                    }
                  }
                }
                all_services.push(dic);
              }
              return <Fragment>{
                <SelectService
                  options={sortByValue(all_services.slice())}
                  isMulti
                  closeMenuOnSelect={false}
                  hideSelectedOptions={false}
                  components={{ Option, MultiValue, animatedComponents }}
                  onChange={e => {
                    this.setState({
                      selectedServices: e
                    });
                  }}
                  allowSelectAll={true}
                  value={this.state.selectedServices}
                  styles={ColourStyles}
                />
             }</Fragment>
             }}
          </Query>
        </FormGroup>
        <FormGroup label="Recipients" isRequired fieldId="horizontal-form-title">
          <Query query={GET_SERVICE_OWNERS}>
            {({ loading, error, data }) => {
              if (loading) return 'Loading...';
              if (error) return `Error! ${error.message}`;
              var recipients = new Set();
              if (selectedServices) {
                for (var key of selectedServices) {
                  this.selected_service_names.push(key.value);
                }
              }
              for(var key in data.apps_v1) {
                var service_name = data.apps_v1[key].name;
                if (this.selected_service_names.includes(service_name)) {
                  var service_owners = data.apps_v1[key].serviceOwners;
                  var service_notificators = data.apps_v1[key].serviceNotifications;
                  if (service_owners) {
                    for (var k of service_owners) {
                      recipients.add(k.name);
                    }
                  }
                  if (service_notificators) {
                    for (var k of service_notificators) {
                      recipients.add(k.name);
                    }
                  }
                }
              }
              for (var key of recipients) {
                var email_dic = {};
                email_dic["value"] = key;
                email_dic["label"] = key;
                email_dic["color"] = GREY;
                impacted_users.push(email_dic);
              }
              
              return <Fragment>{
                <CreatableSelect
                  options={sortByValue(impacted_users)}
                  isMulti
                  closeMenuOnSelect={false}
                  hideSelectedOptions={false}
                  components={{ Option, MultiValue, animatedComponents }}
                  onChange={e => {
                        this.setState({
                          selectedUsers: e 
                        });
                      }}
                  allowSelectAll={true}
                  value={this.state.selectedUsers}           
                  styles={ColourStyles}
                />
             }</Fragment>;
            }}
          </Query>
        </FormGroup>
        {/* <FormGroup label="Recipients" isRequired fieldId="horizontal-form-title">
          <Query query={GET_SERVICE_OWNERS}>
            {({ loading, error, data }) => {
              if (loading) return 'Loading...';
              if (error) return `Error! ${error.message}`;
              var recipients = new Set();
              if (selectedServices) {
                for (var key of selectedServices) {
                  this.selected_service_names.push(key.value);
                }
              }
              for(var key in data.apps_v1) {
                var service_name = data.apps_v1[key].name;
                if (this.selected_service_names.includes(service_name)) {
                  var service_owners = data.apps_v1[key].serviceOwners;
                  var service_notificators = data.apps_v1[key].serviceNotifications;
                  if (service_owners) {
                    for (var k of service_owners) {
                      recipients.add(k.name);
                    }
                  }
                  if (service_notificators) {
                    for (var k of service_notificators) {
                      recipients.add(k.name);
                    }
                  }
                }
              }
              for (var key of recipients) {
                var email_dic = {};
                email_dic["contact"] = 'Email';
                if (key in user_dic) {
                  email_dic["value"] = user_dic[key]['path'] + ' - ' + email_dic['contact'];
                } else {
                  email_dic["value"] = key + ' - ' + email_dic['contact'];
                }
                // email_dic["value"] = key + ' - ' + email_dic['contact'];
                email_dic["label"] = key + ' - ' + email_dic['contact'];
                email_dic["color"] = grey;
                impacted_users.push(email_dic);
                var slack_dic = {};
                slack_dic["contact"] = 'Slack';
                // slack_dic["value"] = key + ' - ' + slack_dic['contact'];
                if (key in user_dic) {
                  slack_dic["value"] = user_dic[key]['slack'] + ' - ' + slack_dic['contact'];
                } else {
                  slack_dic["value"] = key + ' - ' + slack_dic['contact'];
                }
                slack_dic["label"] = key + ' - ' + slack_dic['contact'];
                slack_dic["color"] = red;
                impacted_users.push(slack_dic);
              }
              
              return <Fragment>{
                <SelectRecepient
                  options={sortByLabel(impacted_users)}
                  isMulti
                  closeMenuOnSelect={false}
                  hideSelectedOptions={false}
                  components={{ Option, MultiValue, animatedComponents }}
                  onChange={e => {
                        this.setState({
                          selectedUsers: e 
                        });
                      }}
                  allowSelectAll={true}
                  value={this.state.selectedUsers}
                  // getOptionLabel={option => `${option.label} (${option.contact})`}
                  styles={ColourStyles}
                  // getOptionValue={option => option['contact'] + option['label']}
                />
             }</Fragment>;
            }}
          </Query>
        </FormGroup> */}
        <FormGroup 
          label="Would you like to create a new jira ticket and/ or link to an existing one?" 
          isRequired 
          fieldId="horizontal-form-name" 
          helperText="Format of #Jira should be [Team]-XXXX, e.g. APPSRE-2024.">
          <p>
          <Checkbox label="Create a new Jira ticket" id="alt-form-checkbox-1" name="alt-form-checkbox-1"/>
          </p>
          <p>
          <Checkbox label="Link to an existing ticket: " id="alt-form-checkbox-2" name="alt-form-checkbox-2"/>
          </p>
          <TextInput
            value={jira}
            isRequired
            type="text"
            id="horizontal-form-name"
            aria-describedby="horizontal-form-name-helper"
            name="horizontal-form-name"
            onChange={e => {
              this.setState({
                jira: e
              });
            }}
          />
        </FormGroup>
        <FormGroup label="Short Description" isRequired fieldId="horizontal-form-name">
          <TextInput
            value={short_description}
            isRequired
            type="text"
            id="horizontal-form-name"
            aria-describedby="horizontal-form-name-helper"
            name="horizontal-form-name"
            onChange={e => {
              this.setState({
                short_description: e
              });
            }}
          />
        </FormGroup>
        <FormGroup label="Description" fieldId="horizontal-form-exp">
          <TextArea
            value={long_description}
            name="horizontal-form-exp"
            id="horizontal-form-exp"
            onChange={e => {
              this.setState({
                long_description: e
              });
            }}
          />
        </FormGroup>
        <FormGroup>
          <Button id = "--pf-c-button--active--after--BorderWidth" variant="primary" onClick={this.handleSubmit}><h3>&nbsp;&nbsp; Send notification &nbsp;&nbsp; </h3></Button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Link to="/notifications"> 
          <Button variant="secondary">
            <h3>&nbsp;&nbsp; Cancel &nbsp;&nbsp;</h3>
          </Button>
          </Link>
        </FormGroup>
      </Form>
      } />
    );
  }
}

export default NewNotification;
