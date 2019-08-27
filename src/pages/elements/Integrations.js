import React, { useState } from 'react';
import { Row, Col, Card, CardHeading, CardBody, CardFooter, CardTitle } from 'patternfly-react';
import { Link } from 'react-router-dom';
import { chunk } from 'lodash';
import GridSearch from '../../components/GridSearch';
import { sortByName } from '../../components/Utils';

function Integrations({ integrations }) {
  // cardsWidth * cardsPerRow must be <= 12 (bootstrap grid)
  const cardWidth = 4;
  const cardsPerRow = 3;
  const [selected, changeSelected] = useState('Name');
  const [filterText, changeFilterText] = useState('');
  const lcFilter = filterText.toLowerCase();
  function matches(c) {
    return selected === 'Name' && c.name.toLowerCase().includes(lcFilter);
  }
  const matchedData = integrations.filter(matches);
  const rows = chunk(sortByName(matchedData), cardsPerRow).map(c => (
    <Row key={c[0].path}>
      {c.map(s => (
        <Col xs={cardWidth} key={s.path}>
          <Card accented>
            <CardHeading>
              <CardTitle>{s.name}</CardTitle>
            </CardHeading>
            <CardBody>
              <p>{s.shortDescription}</p>
            </CardBody>
            <CardFooter>
              <p>
                <Link
                  to={{
                    pathname: '/integrations',
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

  return (
    <GridSearch
      data={rows}
      filterText={filterText}
      changeFilterText={changeFilterText}
      changeSelected={changeSelected}
      selected={selected}
    />
  );
}

export default Integrations;
