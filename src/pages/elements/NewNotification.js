import React, { Fragment } from 'react';
import { Query } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';

import "@patternfly/react-core/dist/styles/base.css";
import '../../fonts.css';

import { Link } from 'react-router-dom';
import makeAnimated from 'react-select/animated';
import CreatableSelect from 'react-select/creatable';
import Page from '../../components/Page';
import { Select, Option, MultiValue } from "../../components/Select";
import { sortByValue, ColourStyles} from '../../components/Utils';
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
  uri: 'http://localhost:4000/graphql',
});

const axios = require('axios');
const url = "http://localhost:5000/notifications";

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
const red = '#DE350B';
const grey = '#363636';

client
  .query({
    query: GET_USERS
  })
  .then(result => {
    for (var user of result.data.users_v1) {
      user_dic[user.name] = user.path;
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
        users.push(user_dic[u.value]);
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
      axios({method: "post", url: url, data: notification}).then(function (response) {
        console.log(response);
        alert(`Status code: ${response.status}. New notification successfully created.`);
      })
      .catch(function (error) {
        console.log(error);
        alert(`Unsuccessful submission. Please review the fields and resubmit.`);
      });
    };
    event.preventDefault();
  }

  render() {
    var { notification_type, selectedDependencies, selectedServices, selectedUsers, selectedSlackUsers, jira, short_description, long_description, validated, optionSelected, userSelected} = this.state;
    const animatedComponents = makeAnimated();
   
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
                dic["color"] = grey;
                if (selectedDependencies) {
                  for (var d of selectedDependencies) {
                    if (dependency_dic.hasOwnProperty(d.value)) {
                      if (dependency_dic[d.value].includes(service.name)) {
                        dic["color"] = red;
                      }
                    }
                  }
                }
                all_services.push(dic);
              }
              return <Fragment>{
                <Select
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
              var impacted_users = [];
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
                var dic = {};
                dic["value"] = key;
                dic["label"] = key;
                dic["color"] = grey;
                dic["contact"] = 'Email';
                impacted_users.push(dic);
                var slack_dic = {};
                slack_dic["value"] = key;
                slack_dic["label"] = key;
                slack_dic["color"] = red;
                slack_dic["contact"] = 'Slack';
                impacted_users.push(slack_dic);
              }
              
              return <Fragment>{
                <CreatableSelect
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isMulti
                  onChange={e => {
                    this.setState({
                      selectedUsers: e
                    });
                  }}
                  options={sortByValue(impacted_users)}
                  getOptionLabel={option => `${option.label} (${option.contact})`}
                  styles={ColourStyles}
                  getOptionValue={option => option['contact'] + option['label']}
                />
                // <Select
                // options={impacted_users.sort(function(a, b){
                //       if(a.value.toLowerCase() < b.value.toLowerCase()) { return -1; }
                //       if(a.value.toLowerCase()> b.value.toLowerCase()) { return 1; }
                //       return 0;
                //     })}
                //   isMulti
                //   closeMenuOnSelect={false}
                //   hideSelectedOptions={false}
                //   components={{ Option, MultiValue, animatedComponents }}
                //   onChange={e => {
                //         this.setState({
                //           selectedUsers: e
                //         });
                //       }}
                //   allowSelectAll={true}
                //   value={this.state.selectedUsers}
                //   // getOptionLabel={option => `${option.label} (${option.contact})`}
                //   styles={ColourStyles}
                //   // getOptionValue={option => option['contact'] + option['label']}
                // />
             }</Fragment>;
            }}
          </Query>
        </FormGroup>
        {/* <FormGroup label="Recipients (Slack)" isRequired fieldId="horizontal-form-title" helperText="We do not have Slack account info for users highlighted in RED.">
          <CreatableSelect
            closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti
            onChange={e => {
              this.setState({
                selectedSlackUsers: e
              });
            }}
            options={impacted_users.sort(function(a, b){
              if(a.value.toLowerCase() < b.value.toLowerCase()) { return -1; }
              if(a.value.toLowerCase()> b.value.toLowerCase()) { return 1; }
              return 0;
            })}
            styles={ColourStyles}
          />  
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
