import React from 'react';
import { Link } from 'react-router-dom';
import { chunk } from 'lodash';
import { CardGrid, Row, Col, Card, CardHeading, CardBody, CardFooter, CardTitle } from 'patternfly-react';
import { sortByName } from '../../components/Utils';

function AWSGroups({ awsgroups }) {
  // cardsWidth * cardsPerRow must be <= 12 (bootstrap grid)
  const cardWidth = 4;
  const cardsPerRow = 3;
  const rows = chunk(sortByName(awsgroups), cardsPerRow).map(c => (
    <Row key={c[0].path}>
      {c.map(s => (
        <Col xs={cardWidth} key={s.path}>
          <Card matchHeight accented>
            <CardHeading>
              <CardTitle>{s.name}</CardTitle>
            </CardHeading>
            <CardBody>
              <p>{s.description}</p>
              <p> Account: {s.account.name} </p>
            </CardBody>
            <CardFooter>
              <p>
                <Link
                  to={{
                    pathname: '/awsgroups',
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

export default AWSGroups;
