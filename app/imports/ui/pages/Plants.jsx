import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { ProfilesPlants } from '../../api/profiles/ProfilesPlants';
import { Plants } from '../../api/plants/Plants';
import { PlantsInterests } from '../../api/plants/PlantsInterests';
import LoadingSpinner from '../components/LoadingSpinner';
import { pageStyle } from './pageStyles';
import { ComponentIDs, PageIDs } from '../utilities/ids';
import SearchBar from '../components/SearchBar';

/* Gets the Project data as well as Profiles and Interests associated with the passed Project name. */
function getPlantData(name) {
  const data = Plants.collection.findOne({ name });
  const interests = _.pluck(PlantsInterests.collection.find({ plantName: name }).fetch(), 'interest');
  console.log(name);
  console.log('what is going on I am printing find().count() on the line below');
  console.log(PlantsInterests.collection.find().count());
  const profiles = _.pluck(ProfilesPlants.collection.find({ name: name }).fetch(), 'profile');
  const profilePictures = profiles.map(profile => Plants.collection.findOne({ email: profile })?.picture);
  console.log(_.extend({}, data, { interests, participants: profilePictures }));
  return _.extend({}, data, { interests, participants: profilePictures });
}

/* Component for layout out a Plant Card. */
const MakeCard = ({ plant }) => (
  <Col>
    <Card className="h-100 plant">
      <Card.Body>
        <Card.Img src={plant.picture} width={50} />
        <Card.Title style={{ marginTop: '0px' }}>{plant.name}</Card.Title>
        <Card.Subtitle>
          <span style={{ fontStyle: 'italic' }}>{plant.scientificName}</span>
        </Card.Subtitle>
        <Card.Text>
          <Card.Subtitle>
            <span>{plant.indigenousStatus}</span>
          </Card.Subtitle>
          <hr />
          <div style={{ display: 'block', fontStyle: 'italic' }}>
            <strong>Description:</strong> {plant.description}
          </div>
          <div style={{ display: 'block', fontStyle: 'italic' }}>
            <strong>Growing conditions:</strong> {plant.growingConditions}
          </div>
          <div style={{ display: 'block', fontStyle: 'italic' }}>
            <strong>Propagation:</strong> {plant.propagation}
          </div>
          <div style={{ display: 'block', fontStyle: 'italic' }}>
            <strong>Range:</strong> {plant.range}
          </div>
          <div style={{ display: 'block', fontStyle: 'italic' }}>
            <strong>Cultural uses:</strong> {plant.culturalUses}
          </div>
          <div style={{ display: 'block', fontStyle: 'italic' }}>
            <strong>Pests:</strong> {plant.pests}
          </div>

        </Card.Text>
      </Card.Body>
      <Card.Body>
         {interests.map((interest, index) => <Badge key={index} bg="info">{interest}</Badge>)}
      </Card.Body>
    </Card>
  </Col>
);

MakeCard.propTypes = {
  plant: PropTypes.shape({
    name: PropTypes.string,
    scientificName: PropTypes.string,
    indigenousStatus: PropTypes.string,
    description: PropTypes.string,
    growingConditions: PropTypes.string,
    propagation: PropTypes.string,
    range: PropTypes.string,
    culturalUses: PropTypes,
    pests: PropTypes.string,
    // interests: PropTypes.arrayOf(PropTypes.string),
    picture: PropTypes.string,
  }).isRequired,
};

/* Renders the Project Collection as a set of Cards. */
const PlantsPage = () => {
  const [plantDataFiltered, setPlantDataFiltered] = useState([]); // need this here for search to work
  const { ready } = useTracker(() => {
    // Ensure that minimongo is populated with all collections prior to running render().
    const sub = Meteor.subscribe(Plants.userPublicationName);
    const sub1 = Meteor.subscribe(PlantsInterests.userPublicationName);
    console.log(sub.ready());
    return {
      ready: sub.ready() && sub1.ready(),
    };
  }, []);
  const plants = _.pluck(Plants.collection.find().fetch(), 'name');
  const plantData = plants.map(plant => getPlantData(plant));
  console.log(plantData);
  // setPlantDataFiltered([...plantData]);
  // console.log(plantDataFiltered);
  return ready ? (
    <Container id={PageIDs.plantsPage} style={pageStyle}>
      <Row>
        <SearchBar
          filteredData={plantDataFiltered}
          baseData={plantData}
          filteredDataSetter={setPlantDataFiltered}
          dataFilterFunction={
            (input, searchIn) => input.name.toLowerCase().includes(searchIn.toLowerCase()) || input.description.toLowerCase().includes(searchIn.toLowerCase()) || input.scientificName.toLowerCase().includes(searchIn.toLowerCase())
          }
        />
      </Row>
      <Row xs={1} md={2} lg={3} className="g-2" id={ComponentIDs.plantsSearchBar}>
        {plantDataFiltered.map((plant, index) => <MakeCard key={index} plant={plant} />)}
      </Row>
    </Container>
  ) : <LoadingSpinner />;
};

export default PlantsPage;
