import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Badge, Container, Card, Row, Col, Button } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import swal from 'sweetalert';
import { Profiles } from '../../api/profiles/Profiles';
import { ProfilesProjects } from '../../api/profiles/ProfilesProjects';
import { Projects } from '../../api/projects/Projects';
import { ProjectsInterests } from '../../api/projects/ProjectsInterests';
import LoadingSpinner from '../components/LoadingSpinner';
import { pageStyle } from './pageStyles';
import { PageIDs } from '../utilities/ids';
import SearchBar from '../components/SearchBar';
import { addProfilesProjectMethod, removeProfilesProjectMethod } from '../../startup/both/Methods';

/* Gets the Project data as well as Profiles and Interests associated with the passed Project name. */
function getProjectData(name) {
  const data = Projects.collection.findOne({ name });
  const interests = _.pluck(ProjectsInterests.collection.find({ project: name }).fetch(), 'interest');
  const profiles = _.pluck(ProfilesProjects.collection.find({ project: name }).fetch(), 'profile');
  // const profilePictures = profiles.map(profile => Profiles.collection.findOne({ email: profile })?.picture);
  return _.extend({}, data, { interests, participants: profiles });
}

/* Component for layout out a Project Card. */
const MakeCard = ({ project, email }) => {
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
          {/*TODO WILL REMOVE, USING FOR TESTING ADD & REMOVE*/}
          {/*{project.participants.map((p, index) => <Image key={index} roundedCircle src={p} width={50} />)}*/}
          {project.participants.map((p, index) => <p key={index}> {p} </p>)}
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
      </Card>
    </Col>
  );
};

MakeCard.propTypes = {
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
};

/* Renders the Project Collection as a set of Cards. */
const ProjectsPage = () => {
  const [projectDataFiltered, setProjectDataFiltered] = useState([]); // need this here for search to work
  const { ready, email } = useTracker(() => {
    // Ensure that minimongo is populated with all collections prior to running render().
    const sub1 = Meteor.subscribe(ProfilesProjects.userPublicationName);
    const sub2 = Meteor.subscribe(Projects.userPublicationName);
    const sub3 = Meteor.subscribe(ProjectsInterests.userPublicationName);
    const sub4 = Meteor.subscribe(Profiles.userPublicationName);
    return {
      ready: sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready(),
      email: Meteor.user()?.username,
    };
  }, []);
  const projects = _.pluck(Projects.collection.find().fetch(), 'name');
  const projectData = projects.map(project => getProjectData(project));
  return ready ? (
    <Container id={PageIDs.projectsPage} style={pageStyle}>
      <Row>
        <SearchBar baseData={projectData} filteredDataSetter={setProjectDataFiltered} dataFilterFunction={
          (input, searchIn) => {return input.name.toLowerCase().includes(searchIn.toLowerCase()) /*|| input.description.toLowerCase().includes(searchIn.toLowerCase()) || input.title.toLowerCase().includes(searchIn.toLowerCase())*/}
        }/>
      </Row>
      <Row xs={1} md={2} lg={3} className="g-2 mt-2">
        {projectDataFiltered.map((project, index) => <MakeCard key={index} project={project} email={email} />)}
      </Row>
    </Container>
  ) : <LoadingSpinner />;
};

export default ProjectsPage;
