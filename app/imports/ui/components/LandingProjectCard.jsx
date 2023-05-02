import React from 'react';
import { Badge, Card, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';

const LandingProjectCard = ({ project }) => (
  <Col>
    <Card className="h-100" id="project-card">
      <Card.Body>
        <Card.Img src={project.picture} width={50} height={300} />
        <Card.Title style={{ marginTop: '10px' }}>{project.name}</Card.Title>
        <Card.Text>
          {project.interests.map((interest, index) => <Badge key={index} bg="warning" className="project-interest-spacing">{interest}</Badge>)}
        </Card.Text>
        <Card.Text className="mt-2">
          <hr />
          <p><strong>Description:</strong> {project.description}</p>
          <p><strong>Contact:</strong> {project.owner}</p>
        </Card.Text>
      </Card.Body>
      <Card.Footer>
        <Row className="mt-auto">
          <Col />
          <Col className="d-flex align-items-center justify-content-center">
            <strong>Sign in to join!</strong>
          </Col>
          <Col />
        </Row>
      </Card.Footer>
    </Card>
  </Col>
);

LandingProjectCard.propTypes = {
  project: PropTypes.shape({
    description: PropTypes.string,
    owner: PropTypes.string,
    name: PropTypes.string,
    participants: PropTypes.arrayOf(PropTypes.string),
    picture: PropTypes.string,
    interests: PropTypes.arrayOf(PropTypes.string),
    _id: PropTypes.string,
  }).isRequired,
};

export default LandingProjectCard;
