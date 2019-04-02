import React from 'react';
import { Link } from 'react-router-dom';
import { Label, Button } from 'patternfly-react';

class Service extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const service = this.props.service;

    return (
      <React.Fragment>
        <h3>
          {service.name}
          <span className="edit-button">
            <Button href={`https://gitlab.cee.redhat.com/service/app-interface/tree/master/data/${service.path}`}>
              Edit
            </Button>
          </span>
        </h3>

        <p>
          <dl className="service-definition">
            <dt>SLO</dt>
            <dd>{service.performanceParameters.SLO}</dd>
          </dl>
        </p>
      </React.Fragment>
    );
  }
}

export default Service;
