import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { PageIDs } from '../utilities/ids';

/* Render a Not Found page if the user enters a URL that doesn't match any route. */
const NotFound = () => (
  <Container id={PageIDs.notFoundPage}>
    <Row className="justify-content-center">
      <Col xs={4} className="text-center">
        <h2>
          <p>Page not found</p>
        </h2>
      </Col>
    </Row>
  </Container>
);

export default NotFound;
