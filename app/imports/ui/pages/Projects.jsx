import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Badge, Container, Card, Image, Row, Col, Button } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { AutoForm, SubmitField, HiddenField, TextField } from 'uniforms-bootstrap5';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { Profiles } from '../../api/profiles/Profiles';
import { ProfilesProjects } from '../../api/profiles/ProfilesProjects';
import { Projects } from '../../api/projects/Projects';
import { ProjectsInterests } from '../../api/projects/ProjectsInterests';
import LoadingSpinner from '../components/LoadingSpinner';
import { pageStyle } from './pageStyles';
import { ComponentIDs, PageIDs } from '../utilities/ids';
import SearchBar from '../components/SearchBar';

/* Gets the Project data as well as Profiles and Interests associated with the passed Project name. */
function getProjectData(name) {
  const data = Projects.collection.findOne({ name });
  const interests = _.pluck(ProjectsInterests.collection.find({ project: name }).fetch(), 'interest');
  const profiles = _.pluck(ProfilesProjects.collection.find({ project: name }).fetch(), 'profile');
  const profilePictures = profiles.map(profile => Profiles.collection.findOne({ email: profile })?.picture);
  return _.extend({}, data, { interests, participants: profilePictures });
}

/* Component for layout out a Project Card. */
const MakeCard = ({ project, email }) => {
  const schema = new SimpleSchema({
    profile: String,
    project: String,
  });

  const bridge = new SimpleSchema2Bridge(schema);

  const submit = (data) => {
    console.log('DOES THIS HIT');
    console.log(data);
    console.log(`Test button: ${data.project} ${data.profile}`);
    // Meteor.call(addProfileMethod, { email: email, firstName: '', lastName: '', picture: '' }, (err) => {
    //   if (err) {
    //     setError(err.reason);
    //   } else {
    //     setError('');
    //   }
    // });
    // Accounts.createUser({ email, username: email, password }, (err) => {
    //   if (err) {
    //     setError(err.reason);
    //   } else {
    //     setError('');
    //     setRedirectToRef(true);
    //   }
    // });
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
        </Card.Body>
        <Card.Body>
          <AutoForm schema={bridge} onSubmit={data => submit(data)}>
            <HiddenField name="profile" value={email} />
            <HiddenField name="project" value={project.name} />
            <SubmitField id="test" />
          </AutoForm>

        </Card.Body>
        <Card.Body>

          {/*{project.participants.map((p, index) => <Image key={index} roundedCircle src={p} width={50} />)}*/}
        </Card.Body>
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
  }).isRequired,
  email: PropTypes.shape({
    email: PropTypes.string,
  }).isRequired,
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
  console.log(`data: ${projectData[1]}`);
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
