import React, { useState } from 'react';
import { Col, Row, Table } from 'patternfly-react';
import Pagination from './Pagination';
import SearchBar from './SearchBar';

function PaginatedTableSearch({ filterText, changeFilterText, changeSelected, options, selected, columns, rows }) {
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const paginatedRows = rows.slice((page - 1) * perPage, page * perPage);

  return (
    <React.Fragment>
      <Row>
        <Col md={8}>
          <SearchBar
            filterText={filterText}
            handleFilterTextChange={changeFilterText}
            handleSelect={changeSelected}
            options={options}
            selected={selected}
          />
        </Col>
        <Col md={4}>
          <Pagination
            itemCount={rows.length}
            perPage={perPage}
            page={page}
            onSetPage={setPage}
            onPerPageSelect={setPerPage}
          />
        </Col>
      </Row>

      <Table.PfProvider striped bordered columns={columns}>
        <Table.Header />
        <Table.Body rows={paginatedRows} rowKey="path" />
      </Table.PfProvider>
    </React.Fragment>
  );
}

export default PaginatedTableSearch;
