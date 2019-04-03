import React from 'react';
import { Link } from 'react-router-dom';
import { chunk } from 'lodash';
import { CardGrid, Row, Col, Card, CardHeading, CardBody, CardFooter, CardTitle, Label } from 'patternfly-react';
import { sortByName } from '../../components/Utils';

function Services({ services }) {
  // cardsWidth * cardsPerRow must be <= 12 (bootstrap grid)
  const cardWidth = 4;
  const cardsPerRow = 3;

  const rows = chunk(sortByName(services), cardsPerRow).map(c => (
    <Row key={c[0].path}>
      {c.map(s => (
        <Col xs={cardWidth} key={s.path}>
          <Card matchHeight accented>
            <CardHeading>
              <CardTitle>
                {s.name}
                <span style={{ float: 'right' }}>
                  <Label bsStyle="primary">SLO</Label>
                  <Label bsStyle="info">{s.performanceParameters.SLO}</Label>
                </span>
              </CardTitle>
            </CardHeading>
            <CardBody>{s.description}</CardBody>
            <CardFooter>
              <p>
                <Link
                  to={{
                    pathname: '/services',
                    hash: s.path
                  }}
                >
                  Details
                </Link>
              </p>
            </CardFooter>
          </Card>
        </Col>
      ))}
    </Row>
  ));

  return <CardGrid matchHeight>{rows}</CardGrid>;
}

export default Services;
