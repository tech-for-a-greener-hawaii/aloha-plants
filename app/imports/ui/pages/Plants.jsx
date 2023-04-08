import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Badge, Container, Card, Row, Col } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { Profiles } from '../../api/profiles/Profiles';
import { ProfilesProjects } from '../../api/profiles/ProfilesProjects';
import { Projects } from '../../api/projects/Projects';
import { ProjectsInterests } from '../../api/projects/ProjectsInterests';
import LoadingSpinner from '../components/LoadingSpinner';
import { pageStyle } from './pageStyles';
import { PageIDs } from '../utilities/ids';
import { Plants } from '../../api/plants/Plants';

/* Gets the Project data as well as Profiles and Interests associated with the passed Project name. */
function getPlantData(name) {
  const data = Plants.collection.findOne({ name });
  const interests = _.pluck(ProjectsInterests.collection.find({ project: name }).fetch(), 'interest');
  const profiles = _.pluck(ProfilesProjects.collection.find({ project: name }).fetch(), 'profile');
  const profilePictures = profiles.map(profile => Profiles.collection.findOne({ email: profile })?.picture);
  return _.extend({}, data, { interests, participants: profilePictures });
}

/* Component for layout out a Plant Card. */
const MakeCard = ({ plant }) => (
  <Col>
    <Card className="h-100">
      <Card.Body>
        <Card.Img src={plant.picture} width={50} />
        <Card.Title style={{ marginTop: '0px' }}>{plant.name}</Card.Title>
        {/* <Card.Subtitle> */}
        {/* <span className="date">{plant.title}</span> */}
        {/* </Card.Subtitle> */}
        <Card.Text>
          {plant.description}
        </Card.Text>
      </Card.Body>
      <Card.Body>
        {plant.interests.map((interest, index) => <Badge key={index} bg="info">{interest}</Badge>)}
      </Card.Body>
      {/* <Card.Body> */}
      {/*  {plant.participants.map((p, index) => <Image key={index} roundedCircle src={p} width={50} />)} */}
      {/* </Card.Body> */}
    </Card>
  </Col>
);

MakeCard.propTypes = {
  plant: PropTypes.shape({
    description: PropTypes.string,
    name: PropTypes.string,
    scientificName: PropTypes.string,
    growingConditions: PropTypes.string,
    picture: PropTypes.string,
    interests: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

/* Renders the Project Collection as a set of Cards. */
const PlantsPage = () => {
  const { ready } = useTracker(() => {
    // Ensure that minimongo is populated with all collections prior to running render().
    const sub1 = Meteor.subscribe(ProfilesProjects.userPublicationName);
    const sub2 = Meteor.subscribe(Projects.userPublicationName);
    const sub3 = Meteor.subscribe(ProjectsInterests.userPublicationName);
    const sub4 = Meteor.subscribe(Profiles.userPublicationName);
    return {
      ready: sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready(),
    };
  }, []);
  const plants = _.pluck(Plants.collection.find().fetch(), 'name');
  const plantData = plants.map(project => getPlantData(project));
  return ready ? (
    <Container id={PageIDs.projectsPage} style={pageStyle}>
      <Row xs={1} md={2} lg={4} className="g-2">
        {plantData.map((plant, index) => <MakeCard key={index} plant={plant} />)}
      </Row>
    </Container>
  ) : <LoadingSpinner />;
};

export default PlantsPage;
