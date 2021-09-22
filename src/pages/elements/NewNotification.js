import React, { Fragment } from 'react';
import { Query } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';
import makeAnimated from 'react-select/animated';
import CreatableSelect from 'react-select/creatable';
import '@patternfly/react-core/dist/styles/base.css';
import {
  Alert,
  Form,
  FormGroup,
  TextInput,
  TextArea,
  FormSelect,
  FormSelectOption,
  Button,
  Label
} from '@patternfly/react-core';

import Page from '../../components/Page';
import { SelectAffected, Option, MultiValue } from '../../components/NotificationSelect';
import { sortByValue } from '../../components/Utils';
import { GREY, BLUE, ColourStyles } from '../../components/ColourStyles';

const client = new ApolloClient({
  uri: window.GRAPHQL_URI
});

const GET_SERVICE_INFO = gql`
  query GetServiceOwners {
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

const GET_DEPENDENCIES_LIST = gql`
  query GetDependencies {
    dependencies_v1 {
      name
    }
  }
`;

const user_dic = {};
const dependency_dic = [];
const service_dic = [];

client
  .query({
    query: GET_USERS
  })
  .then(result => {
    for (const user of result.data.users_v1) {
      const dic = {};
      dic.path = user.path;
      dic.name = user.name;
      dic.org_username = user.org_username;
      user_dic[user.name] = dic;
    }
  });

client
  .query({
    query: GET_SERVICE_INFO
  })
  .then(result => {
    for (const service of result.data.apps_v1) {
      const service_owners = service.serviceOwners;
      const service_notificators = service.serviceNotifications;
      const recipients = new Set();
      if (service_owners) {
        for (var user of service_owners) {
          recipients.add(user.name);
        }
      }
      if (service_notificators) {
        for (var user of service_notificators) {
          recipients.add(user.name);
        }
      }
      service_dic[service.name] = recipients;
      for (const dependency of service.dependencies) {
        if (dependency_dic.hasOwnProperty(dependency.name)) {
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
      notification_type: 'Outage',
      selectedDependencies: [{ value: 'None', label: 'None' }],
      selectedServices: [],
      selectedEmailUsers: [],
      channel: '',
      selectedSlackUsers: [],
      subject: '',
      description:
        'Hello, \n \
      The AppSRE team is current investigating an outage of [SERVICE NAME]. The AppSRE team will send regular updates as we work on resolving this issue. \n \
      App-SRE tracking JIRA: [JIRA]  \n \
      Live RCA: [RCA DOCUMENT URL] \n \
      Bridge link: [BRIDGE LINK URL] \n \
The AppSRE team'
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.options = [
      { value: 'Outage', label: 'Outage' },
      { value: 'Degraded Performance', label: 'Degraded Performance' },
      { value: 'Other Incident', label: 'Other Incident' },
      { value: 'Maintenance', label: 'Maintenance' },
      { value: 'Info', label: 'Info' }
    ];
  }

  handleSubmit(event) {
    const dependency_names = [];
    const service_names = [];
    const email_users = [];
    let email_users_str = '';
    const slack_users = [];
    let slack_users_str = '';
    for (var s of this.state.selectedDependencies) {
      dependency_names.push(s.value);
    }
    for (var s of this.state.selectedServices) {
      service_names.push(s.value);
    }
    if (this.state.selectedEmailUsers) {
      for (var u of this.state.selectedEmailUsers) {
        if (user_dic.hasOwnProperty(u.value)) {
          email_users.push(user_dic[u.value].path);
          email_users_str += `${u.value} | `;
        }
      }
    }
    if (this.state.selectedSlackUsers) {
      for (var u of this.state.selectedSlackUsers) {
        if (user_dic.hasOwnProperty(u.value)) {
          slack_users.push(user_dic[u.value].path);
        } else {
          slack_users.push(u.value);
        }
        slack_users_str += `${u.value} | `;
      }
    }

    // eslint-disable-next-line no-restricted-globals
    const r = confirm(
      `${'Preview' + '\n' + '• Notification Type: '}${this.state.notification_type}\n` +
        `• Recipients (Email): ${email_users_str}\n` +
        `• Recipients (Slack): ${slack_users_str}\n` +
        `• Subject: ${this.state.subject}\n` +
        `• Description: ${this.state.description}\n` +
        `========================= ` +
        `\n` +
        `Are you sure to send the notification? ` +
        `\n` +
        `========================= ` +
        `\n`
    );
    if (r) {
      const notification = {
        notification_type: this.state.notification_type,
        labels: '{}',
        affected_dependencies: dependency_names,
        affected_services: service_names,
        recipients: email_users,
        channel: this.state.channel,
        slack_recipients: slack_users,
        short_description: this.state.subject,
        description: this.state.description
      };
      fetch(`${window.QONTRACT_API_URL}/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(notification)
      }).then(response => {
        console.log(response.status);
        if (response.status === 201) {
          alert(`New notification successfully created.`);
        } else {
          alert(`Unsuccessful submission. Please review the fields and resubmit.`);
        }
      });
    }
    event.preventDefault();
  }

  render() {
    const {
      notification_type,
      selectedDependencies,
      selectedServices,
      selectedEmailUsers,
      channel,
      selectedSlackUsers,
      subject,
      description
    } = this.state;
    const animatedComponents = makeAnimated();

    return (
      <Page
        title="Create a new notification"
        body={
          <Fragment>
            <Alert variant="danger" title="Warning">
              For use by AppSRE team members only.
            </Alert>
            <br />
            <br />
            <Form isHorizontal>
              <FormGroup label="Notification Type" isRequired fieldId="horizontal-form-title">
                <FormSelect
                  value={notification_type}
                  onChange={e => {
                    this.setState({
                      notification_type: e
                    });
                  }}
                  aria-label="FormSelect Input"
                >
                  {this.options.map((option, index) => (
                    <FormSelectOption key={index} value={option.value} label={`\u00A0\u00A0${option.label}`} />
                  ))}
                </FormSelect>
              </FormGroup>
              <FormGroup label="Affected Dependency" isRequired fieldId="horizontal-form-title">
                <Query query={GET_DEPENDENCIES_LIST}>
                  {({ loading, error, data }) => {
                    if (loading) return 'Loading...';
                    if (error) return `Error! ${error.message}`;
                    const all_dependencies = [{ value: 'None', label: 'None' }];
                    for (const dependency of data.dependencies_v1) {
                      const dic = {};
                      dic.value = dependency.name;
                      dic.label = dependency.name;
                      all_dependencies.push(dic);
                    }

                    return (
                      <Fragment>
                        {
                          <CreatableSelect
                            defaultValue={{ value: 'None', label: 'None' }}
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
                        }
                      </Fragment>
                    );
                  }}
                </Query>
              </FormGroup>
              <FormGroup
                label="Affected Service"
                isRequired
                fieldId="horizontal-form-title"
                helperText="Services highlighted in BLUE are affected by selected dependency."
              >
                <Query query={GET_SERVICE_INFO}>
                  {({ loading, error, data }) => {
                    if (loading) return 'Loading...';
                    if (error) return `Error! ${error.message}`;
                    const all_services = [];
                    for (const service of data.apps_v1) {
                      const dic = {};
                      dic.value = service.name;
                      dic.label = service.name;
                      dic.color = GREY;
                      if (selectedDependencies) {
                        for (const d of selectedDependencies) {
                          if (dependency_dic.hasOwnProperty(d.value)) {
                            if (dependency_dic[d.value].includes(service.name)) {
                              dic.color = BLUE;
                            }
                          }
                        }
                      }
                      all_services.push(dic);
                    }

                    return (
                      <Fragment>
                        {
                          <SelectAffected
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
                            allowSelectAll
                            value={selectedServices}
                            styles={ColourStyles}
                          />
                        }
                      </Fragment>
                    );
                  }}
                </Query>
              </FormGroup>
              <FormGroup
                label="Email Recipients"
                fieldId="horizontal-form-title"
                helperText="Receipients highlighted in BLUE are affected by selected services."
              >
                <Query query={GET_SERVICE_INFO}>
                  {({ loading, error, data }) => {
                    if (loading) return 'Loading...';
                    if (error) return `Error! ${error.message}`;
                    const recipients = new Set();
                    const selected_service_names = [];
                    if (selectedServices) {
                      for (const key of selectedServices) {
                        selected_service_names.push(key.value);
                      }
                    }

                    for (const service of data.apps_v1) {
                      const service_name = service.name;
                      if (selected_service_names.includes(service_name)) {
                        const service_owners = service.serviceOwners;
                        const service_notificators = service.serviceNotifications;
                        if (service_owners) {
                          for (var user of service_owners) {
                            recipients.add(user.name);
                          }
                        }
                        if (service_notificators) {
                          for (var user of service_notificators) {
                            recipients.add(user.name);
                          }
                        }
                      }
                    }
                    const all_users = [];
                    for (const user_name in user_dic) {
                      const dic = {};
                      dic.org_username = user_dic[user_name].org_username;
                      dic.name = user_name;
                      dic.value = user_name;
                      dic.label = user_name;
                      if (recipients) {
                        if (recipients.has(dic.name)) {
                          dic.color = BLUE;
                        } else {
                          dic.color = GREY;
                        }
                      }
                      all_users.push(dic);
                    }

                    return (
                      <Fragment>
                        {
                          <SelectAffected
                            options={sortByValue(all_users)}
                            isMulti
                            closeMenuOnSelect={false}
                            hideSelectedOptions={false}
                            components={{ Option, MultiValue, animatedComponents }}
                            onChange={e => {
                              this.setState({
                                selectedEmailUsers: e
                              });
                            }}
                            allowSelectAll
                            value={selectedEmailUsers}
                            styles={ColourStyles}
                          />
                        }
                      </Fragment>
                    );
                  }}
                </Query>
              </FormGroup>
              <FormGroup
                label="Slack Recipients"
                fieldId="horizontal-form-title"
                helperText="Receipients highlighted in BLUE are affected by selected services."
              >
                <Query query={GET_SERVICE_INFO}>
                  {({ loading, error, data }) => {
                    if (loading) return 'Loading...';
                    if (error) return `Error! ${error.message}`;
                    const recipients = new Set();
                    const selected_service_names = [];
                    if (selectedServices) {
                      for (const key of selectedServices) {
                        selected_service_names.push(key.value);
                      }
                    }

                    for (const service of data.apps_v1) {
                      const service_name = service.name;
                      if (selected_service_names.includes(service_name)) {
                        const service_owners = service.serviceOwners;
                        const service_notificators = service.serviceNotifications;
                        if (service_owners) {
                          for (var user of service_owners) {
                            recipients.add(user.name);
                          }
                        }
                        if (service_notificators) {
                          for (var user of service_notificators) {
                            recipients.add(user.name);
                          }
                        }
                      }
                    }
                    const all_users = [];
                    for (const user_name in user_dic) {
                      const dic = {};
                      dic.org_username = user_dic[user_name].org_username;
                      dic.name = user_name;
                      dic.value = user_name;
                      dic.label = user_name;
                      if (recipients) {
                        if (recipients.has(dic.name)) {
                          dic.color = BLUE;
                        } else {
                          dic.color = GREY;
                        }
                      }
                      all_users.push(dic);
                    }

                    return (
                      <Fragment>
                        <SelectAffected
                          options={sortByValue(all_users)}
                          isMulti
                          closeMenuOnSelect={false}
                          hideSelectedOptions={false}
                          components={{ Option, MultiValue, animatedComponents }}
                          onChange={e => {
                            this.setState({
                              selectedSlackUsers: e
                            });
                          }}
                          allowSelectAll
                          value={selectedSlackUsers}
                          styles={ColourStyles}
                        />
                      </Fragment>
                    );
                  }}
                </Query>
              </FormGroup>
              <FormGroup label="Slack Channel Name" fieldId="horizontal-form-name">
                <TextInput
                  type="text"
                  id="horizontal-form-name"
                  aria-describedby="horizontal-form-name-helper"
                  name="horizontal-form-name"
                  resizeOrientation="horizontal"
                  onChange={e => {
                    this.setState({
                      channel: e
                    });
                  }}
                />
              </FormGroup>
              <FormGroup label="Subject" isRequired fieldId="horizontal-form-name">
                <TextInput
                  value={subject}
                  isRequired
                  type="text"
                  id="horizontal-form-name"
                  aria-describedby="horizontal-form-name-helper"
                  name="horizontal-form-name"
                  onChange={e => {
                    this.setState({
                      subject: e
                    });
                  }}
                />
              </FormGroup>
              <FormGroup label="Description" isRequired fieldId="horizontal-form-exp">
                <TextArea
                  placeholder={description}
                  name="horizontal-form-exp"
                  id="horizontal-form-exp"
                  onChange={e => {
                    this.setState({
                      description: e
                    });
                  }}
                  rows="6"
                  cols="80"
                />
              </FormGroup>
              <FormGroup>
                <Button id="--pf-c-button--active--after--BorderWidth" variant="primary" onClick={this.handleSubmit}>
                  <h3>&nbsp;&nbsp; Send notification &nbsp;&nbsp; </h3>
                </Button>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Link to="/notifications">
                  <Button variant="secondary">
                    <h3>&nbsp;&nbsp; Cancel &nbsp;&nbsp;</h3>
                  </Button>
                </Link>
              </FormGroup>
            </Form>
          </Fragment>
        }
      />
    );
  }
}

export default NewNotification;
