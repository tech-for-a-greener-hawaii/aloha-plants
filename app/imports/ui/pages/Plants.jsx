import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Badge, Container, Card, Row, Col } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
// import { Profiles } from '../../api/profiles/Profiles';
import { ProfilesPlants } from '../../api/profiles/ProfilesPlants';
import { Plants } from '../../api/plants/Plants';
import { PlantsInterests } from '../../api/plants/PlantsInterests';
import LoadingSpinner from '../components/LoadingSpinner';
import { pageStyle } from './pageStyles';
import { PageIDs } from '../utilities/ids';

/* Gets the Project data as well as Profiles and Interests associated with the passed Project name. */
function getPlantData(name) {
  const data = Plants.collection.findOne({ name });
  const interests = _.pluck(PlantsInterests.collection.find({ project: name }).fetch(), 'interest');
  const profiles = _.pluck(ProfilesPlants.collection.find({ project: name }).fetch(), 'profile');
  const profilePictures = profiles.map(profile => Plants.collection.findOne({ email: profile })?.picture);
  return _.extend({}, data, { interests, participants: profilePictures });
}

/* Component for layout out a Plant Card. */
const MakeCard = ({ plant }) => (
  <Col>
    <Card className="h-100">
      <Card.Body>
        <h1>Hello</h1>
        <Card.Img src={plant.picture} width={50} />
        <Card.Title style={{ marginTop: '0px' }}>{plant.name}</Card.Title>
         {/*<Card.Subtitle> */}
         {/*<span className="date">{plant.title}</span> */}
         {/*</Card.Subtitle> */}
        <Card.Text>
          {plant.description}
        </Card.Text>
      </Card.Body>
      <Card.Body>
        {/*{plant.interests.map((interest, index) => <Badge key={index} bg="info">{interest}</Badge>)}*/}
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
    const sub = Meteor.subscribe(Plants.userPublicationName);
    console.log(sub.ready())
    return {
      ready: sub.ready(),
    };
  }, []);
  const plants = _.pluck(Plants.collection.find().fetch(), 'name');
  console.log(plants)
  const plantData = plants.map(project => getPlantData(project));
  console.log(plantData)
  return ready ? (
    <Container id={PageIDs.plantsPage} style={pageStyle}>
      <Row xs={1} md={2} lg={4} className="g-2">
        {plantData.map((plant, index) => <MakeCard key={index} plant={plant} />)}
      </Row>
    </Container>
  ) : <LoadingSpinner />;
};

export default PlantsPage;
