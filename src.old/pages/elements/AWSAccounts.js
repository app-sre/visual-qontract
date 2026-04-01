import React from 'react';
import { Link } from 'react-router-dom';
import { chunk } from 'lodash';
import { CardGrid, Row, Col, Card, CardHeading, CardBody, CardFooter, CardTitle } from 'patternfly-react';
import { sortByName } from '../../components/Utils';

function AWSAccounts({ awsaccounts }) {
  // cardsWidth * cardsPerRow must be <= 12 (bootstrap grid)
  const cardWidth = 4;
  const cardsPerRow = 3;
  const rows = chunk(sortByName(awsaccounts), cardsPerRow).map(c => (
    <Row key={c[0].path}>
      {c.map(s => (
        <Col xs={cardWidth} key={s.path}>
          <Card accented>
            <CardHeading>
              <CardTitle>{s.name}</CardTitle>
            </CardHeading>
            <CardBody>
              <p>{s.description}</p>
            </CardBody>
            <CardFooter>
              <p>
                <Link
                  to={{
                    pathname: '/awsaccounts',
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

export default AWSAccounts;
