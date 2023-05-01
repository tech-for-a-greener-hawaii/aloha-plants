import React, { useState } from 'react';
import { Container, Row } from 'react-bootstrap';

/* test */
/* eslint react/prop-types: 0 */
const SearchBar = ({ filteredData, baseData, filteredDataSetter, dataFilterFunction }) => {
  const [searchIn, setSearchIn] = useState('');
  if (filteredData === undefined || (filteredData.length !== baseData.length && searchIn.length === 0)) { filteredDataSetter(baseData); }
  function filterFunctionWrapper(input) {
    return dataFilterFunction(input, searchIn);
  }
  const handleInput = (e) => {
    setSearchIn(e.target.value);
    filteredDataSetter(baseData.filter(filterFunctionWrapper));
  };
  return (
    <Container>
      <Row className="justify-content-md-center">
        <div>
          <input
            type="search"
            placeholder="Search"
            onChange={handleInput}
          />
        </div>
      </Row>
    </Container>
  );
};

export default SearchBar;
