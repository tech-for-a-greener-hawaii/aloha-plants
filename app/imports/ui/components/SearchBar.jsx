import React, { useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';

const SearchBar = ({ filteredData, baseData, filteredDataSetter, dataFilterFunction }) => {
  SearchBar.propTypes = {
    filteredData: PropTypes.PropTypes.objectOf(PropTypes.object()).isRequired,
    baseData: PropTypes.PropTypes.objectOf(PropTypes.object()).isRequired,
    filteredDataSetter: PropTypes.func.isRequired,
    dataFilterFunction: PropTypes.func.isRequired,
  };
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
