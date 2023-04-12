import React, {useState} from 'react';
import { Col, Container, Row, Spinner } from 'react-bootstrap';
import { TextField } from 'uniforms-bootstrap5';


const SearchBar = ({baseData, filteredDataSetter, dataFilterFunction}) => {
  const [searchIn, setSearchIn] = useState("");
  function filterFunctionWrapper(input) {
    return dataFilterFunction(input, searchIn);
  }
  const handleInput = (e) => {
    setSearchIn(e.target.value);
    filteredDataSetter(baseData.filter(filterFunctionWrapper));
  }
  return (
    <Container>
      <Row className="justify-content-md-center">
        <div>
          <input type="search"
               placeholder="Search"
               onChange={handleInput}
                 variant="outlined"
                 label="Search"
          />
        </div>
      </Row>
    </Container>
  );
};

export default SearchBar;