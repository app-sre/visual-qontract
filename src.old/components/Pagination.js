import React from 'react';
import { Button, ButtonGroup } from 'patternfly-react';

const Pagination = ({ itemCount, perPage, page, onSetPage, onPerPageSelect }) => {
  const totalPages = Math.ceil(itemCount / perPage);

  const handlePageChange = newPage => {
    if (newPage > 0 && newPage <= totalPages) {
      onSetPage(newPage);
    }
  };

  return (
    <div className="pf-c-pagination">
      <ButtonGroup>
        <Button onClick={() => handlePageChange(1)}>First</Button>
        <Button onClick={() => handlePageChange(page - 1)}>Previous</Button>
        <Button onClick={() => handlePageChange(page + 1)}>Next</Button>
        <Button onClick={() => handlePageChange(totalPages)}>Last</Button>
      </ButtonGroup>
      <span>
        Page {page} of {totalPages}
      </span>
    </div>
  );
};

export default Pagination;
