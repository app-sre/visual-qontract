import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { chunk } from 'lodash';
import { CardGrid, Row, Col, Card, CardHeading, CardBody, CardFooter, CardTitle, Label } from 'patternfly-react';
import { sortByName } from '../../components/Utils';
import SearchBar from '../../components/SearchBar';


function Services({ services }) {
  // cardsWidth * cardsPerRow must be <= 12 (bootstrap grid)
  const cardWidth = 4;
  const cardsPerRow = 3;
  const [selected, changeSelected] = useState('Name');
  const [filterText, changeFilterText] = useState('');
  const matchedServices = [];
  let i;
  for (i = 0; i < services.length; i++) {
    if (selected === 'Name') {
      if (services[i].name.toLowerCase().indexOf(filterText.toLowerCase()) !== -1) {
        matchedServices[matchedServices.length] = services[i];
      }
    }
  }
  function handleFilterTextChange(txt) {
    changeFilterText(txt);
  }

  function handleSelect(newSelection) {
    changeSelected(newSelection);
  }

  const rows = chunk(sortByName(matchedServices), cardsPerRow).map(c => (
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

  return (
    <div>
      <SearchBar
        filterText={filterText}
        handleFilterTextChange={handleFilterTextChange}
        handleSelect={handleSelect}
        selected={selected}
      />
      <CardGrid matchHeight>{rows}</CardGrid>;
    </div>
  );
}

export default Services;
