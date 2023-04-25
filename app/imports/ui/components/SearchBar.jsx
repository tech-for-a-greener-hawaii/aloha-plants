import React, {useState} from 'react';
import { Col, Container, Row, Spinner } from 'react-bootstrap';
import { TextField } from 'uniforms-bootstrap5';
//baseData = is the data retrieved from the server and is not changed
//filteredDataSetter is a function to modify the data that is being changed
//dataFilterFunction is the function used to filter the data while searching
const SearchBar = ({baseData, filteredDataSetter, dataFilterFunction}) => {
  const [searchIn, setSearchIn] = useState("");
  function filterFunctionWrapper(input) {
    //return dataFilterFunction(input, searchIn);
  }
  const handleInput = (e) => {
    setSearchIn(e.target.value);
    filteredDataSetter(baseData.filter(filterFunctionWrapper));
  }
  filteredDataSetter(baseData.filter(filterFunctionWrapper));
  return (
    <Container>
      <Row className="justify-content-md-center">
        <div>
          <input type="search"
               placeholder="Search"
               onChange={handleInput}
          />
        </div>
      </Row>
    </Container>
  );
};

export default SearchBar;