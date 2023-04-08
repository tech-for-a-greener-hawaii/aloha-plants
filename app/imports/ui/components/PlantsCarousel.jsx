import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { _ } from 'meteor/underscore';
import PropTypes from 'prop-types';
import { useTracker } from 'meteor/react-meteor-data';
import * as Meteor from 'graphql/execution';
import { Plants } from '../../api/plants/Plants';
import { ProjectsInterests } from '../../api/projects/ProjectsInterests';
import { ProfilesProjects } from '../../api/profiles/ProfilesProjects';
import { Profiles } from '../../api/profiles/Profiles';
import { Projects } from '../../api/projects/Projects';
import LoadingSpinner from './LoadingSpinner';

/* Gets the Project data as well as Profiles and Interests associated with the passed Project name. */
function getPlantData(name) {
  const data = Plants.collection.findOne({ name });
  const interests = _.pluck(ProjectsInterests.collection.find({ project: name }).fetch(), 'interest');
  const profiles = _.pluck(ProfilesProjects.collection.find({ project: name }).fetch(), 'profile');
  const profilePictures = profiles.map(profile => Profiles.collection.findOne({ email: profile })?.picture);
  return _.extend({}, data, { interests, participants: profilePictures });
}

/* Component for layout out a Plant Card. */
const MakeItem = ({ plant }) => (
  <Carousel.Item>
    <img
      className="d-block w-100"
      src={plant.picture}
      alt="Plant"
    />
    <Carousel.Caption>
      <h3>{plant.name}</h3>
      <p>{plant.description}</p>
    </Carousel.Caption>
  </Carousel.Item>
);

MakeItem.propTypes = {
  plant: PropTypes.shape({
    description: PropTypes.string,
    name: PropTypes.string,
    scientificName: PropTypes.string,
    growingConditions: PropTypes.string,
    picture: PropTypes.string,
    interests: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

const PlantsCarousel = () => {
// Return a Carousel that maps over all plants. Carousel item includes plant image and name.
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
    <Carousel>
      {plantData.map((plant, index) => <MakeItem key={index} plant={plant} />)}
    </Carousel>
  ) : <LoadingSpinner />;
};
export default PlantsCarousel;
