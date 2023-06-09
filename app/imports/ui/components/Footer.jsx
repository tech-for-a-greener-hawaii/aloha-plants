import React from 'react';
import { Col, Container } from 'react-bootstrap';

/* The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => (
  <footer className="footer mt-auto py-3 bg-dark">
    <Container>
      <Col className="text-center" style={{ color: 'white' }}>
        Tech for a Greener Hawaiʻi
        {' '}
        <br />
        University of Hawaiʻi
        <br />
        Honolulu, HI 96822
        {' '}
        <br />
        <a style={{ color: 'white' }} href="https://tech-for-a-greener-hawaii.github.io/">https://tech-for-a-greener-hawaii.github.io/</a>
      </Col>
    </Container>
  </footer>
);

export default Footer;
