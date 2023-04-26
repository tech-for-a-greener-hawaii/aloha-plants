import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { PageIDs } from '../utilities/ids';

/* Render a Not Authorized page if the user enters a URL that doesn't match any route. */
const NotAuthorized = () => (
  <Container id={PageIDs.notAuthorizedPage}>
    <Row className="justify-content-center">
      <Col xs={4} className="text-center">
        <h2>
          <p>Not Authorized</p>
        </h2>
        <h6>
          <p>Admin Access Only</p>
        </h6>
      </Col>
    </Row>
  </Container>
);

export default NotAuthorized;
