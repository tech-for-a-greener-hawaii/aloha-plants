import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Badge, Card, Row, Col, Button, Container } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import swal from 'sweetalert';
import { Link } from 'react-router-dom';
import { addProfilesProjectMethod, removeProfilesProjectMethod } from '../../startup/both/Methods';
import DeleteProject from './DeleteProject';

const ProjectCard = ({ project, email, role }) => {
  // Checks if user has already signed up for the project
  const checkSignup = _.contains(project.participants, email);
  const signup = (data) => {
    Meteor.call(addProfilesProjectMethod, data, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', 'Signed up!', 'success');
        // eslint-disable-next-line no-restricted-globals
        location.reload();
      }
    });

  };
  const remove = (data) => {
    Meteor.call(removeProfilesProjectMethod, data, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', 'Project removed successfully', 'success');
        // eslint-disable-next-line no-restricted-globals
        location.reload();
      }
    });

  };
  const roleCheck = String(role) === 'admin';

  return (
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
              { checkSignup ? (
                <Button
                  className="mt-auto"
                  variant="danger"
                  onClick={() => remove({ profile: email, project: project.name })}
                >
                  remove
                </Button>
              ) : (<Button className="mt-auto" variant="primary" onClick={() => signup({ profile: email, project: project.name })}>Sign up</Button>)}
            </Col>
            <Col />
          </Row>
        </Card.Footer>
        {
          roleCheck ?
            (
              <Container fluid>
                <Row>
                  <Link className="text-center" to={`/edit/${project._id}`}>Edit</Link>
                </Row>
                <Row><DeleteProject project={project} /></Row>
              </Container>
            ) : (<div />)
        }

      </Card>
    </Col>
  );
};

ProjectCard.propTypes = {
  project: PropTypes.shape({
    description: PropTypes.string,
    owner: PropTypes.string,
    name: PropTypes.string,
    participants: PropTypes.arrayOf(PropTypes.string),
    picture: PropTypes.string,
    interests: PropTypes.arrayOf(PropTypes.string),
    _id: PropTypes.string,
  }).isRequired,
  email: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
};

export default ProjectCard;
