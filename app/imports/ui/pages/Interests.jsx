import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Card, Col, Container, Image, Row } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { Interests } from '../../api/interests/Interests';
import { Profiles } from '../../api/profiles/Profiles';
import { ProfilesInterests } from '../../api/profiles/ProfilesInterests';
import { ProfilesProjects } from '../../api/profiles/ProfilesProjects';
import { Projects } from '../../api/projects/Projects';
import { ProjectsInterests } from '../../api/projects/ProjectsInterests';
import LoadingSpinner from '../components/LoadingSpinner';
import { pageStyle } from './pageStyles';
import { PageIDs } from '../utilities/ids';

/* Returns the Profiles and Projects associated with the passed Interest. */
function getInterestData(name) {
  const profiles = _.pluck(ProfilesInterests.collection.find({ interest: name }).fetch(), 'profile');
  const profilePictures = profiles.map(profile => Profiles.collection.findOne({ email: profile }).picture);
  const projects = _.pluck(ProjectsInterests.collection.find({ interest: name }).fetch(), 'project');
  const projectPictures = projects.map(project => Projects.collection.findOne({ name: project })?.picture);
  // console.log(_.extend({ }, data, { interests, projects: projectPictures }));
  return _.extend({}, { name, profiles: profilePictures, projects: projectPictures });
}

/* Component for layout out an Interest Card. */
const MakeCard = ({ interest }) => (
  <Col>
    <Card className="h-100">
      <Card.Body>
        <Card.Title style={{ marginTop: '0px' }}>{interest.name}</Card.Title>
        {interest.profiles.map((p, index) => <Image key={index} roundedCircle src={p} width={50} />)}
        {interest.projects.map((p, index) => <Image key={index} roundedCircle src={p} width={50} />)}
      </Card.Body>
    </Card>
  </Col>
);

MakeCard.propTypes = {
  interest: PropTypes.shape({
    name: PropTypes.string,
    profiles: PropTypes.arrayOf(PropTypes.string),
    projects: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

/* Renders the Interests as a set of Cards. */
const InterestsPage = () => {

  /* If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  const { ready } = useTracker(() => {
    // Ensure that minimongo is populated with all collections prior to running render().
    const sub1 = Meteor.subscribe(ProfilesProjects.userPublicationName);
    const sub2 = Meteor.subscribe(Projects.userPublicationName);
    const sub3 = Meteor.subscribe(ProjectsInterests.userPublicationName);
    const sub4 = Meteor.subscribe(Profiles.userPublicationName);
    const sub5 = Meteor.subscribe(Interests.userPublicationName);
    const sub6 = Meteor.subscribe(ProfilesInterests.userPublicationName);
    return {
      ready: sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready() && sub6.ready(),
    };
  }, []);
  const interests = _.pluck(Interests.collection.find().fetch(), 'name');
  const interestData = interests.map(interest => getInterestData(interest));
  return ready ? (
    <Container id={PageIDs.interestsPage} style={pageStyle}>
      <Row xs={1} md={2} lg={4} className="g-2">
        {interestData.map((interest, index) => <MakeCard key={index} interest={interest} />)}
      </Row>
    </Container>
  ) : <LoadingSpinner />;
};

export default InterestsPage;
