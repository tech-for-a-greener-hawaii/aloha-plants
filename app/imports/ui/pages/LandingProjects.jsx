import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Row } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/underscore';
import { Profiles } from '../../api/profiles/Profiles';
import { ProfilesProjects } from '../../api/profiles/ProfilesProjects';
import { Projects } from '../../api/projects/Projects';
import { ProjectsInterests } from '../../api/projects/ProjectsInterests';
import LoadingSpinner from '../components/LoadingSpinner';
import { pageStyle } from './pageStyles';
import { PageIDs } from '../utilities/ids';
import SearchBar from '../components/SearchBar';
import LandingProjectCard from '../components/LandingProjectCard';

/* Gets the Project data as well as Profiles and Interests associated with the passed Project name. */
function getProjectData(name) {
  const data = Projects.collection.findOne({ name });
  const interests = _.pluck(ProjectsInterests.collection.find({ project: name }).fetch(), 'interest');
  const profiles = _.pluck(ProfilesProjects.collection.find({ project: name }).fetch(), 'profile');
  return _.extend({}, data, { interests, participants: profiles });
}

/* Renders the Project Collection as a set of Cards. */
const LandingProjects = () => {
  const [projectDataFiltered, setProjectDataFiltered] = useState([]); // need this here for search to work
  const { ready } = useTracker(() => {
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
  // const checkRole = Roles.userIsInRole()
  // console.log(`user role ${this.userId}`);
  return ready ? (
    <Container id={PageIDs.projectsPage} style={pageStyle}>
      <Row>
        <SearchBar
          filteredData={projectDataFiltered}
          baseData={projectData}
          filteredDataSetter={setProjectDataFiltered}
          dataFilterFunction={
            (input, searchIn) => input.name.toLowerCase().includes(searchIn.toLowerCase()) /* || input.description.toLowerCase().includes(searchIn.toLowerCase()) || input.title.toLowerCase().includes(searchIn.toLowerCase()) */
          }
        />
      </Row>
      <Row xs={1} md={2} lg={3} className="g-2 mt-2">
        {projectDataFiltered.map((project, index) => <LandingProjectCard key={index} project={project} />)}
      </Row>
    </Container>
  ) : <LoadingSpinner />;
};

export default LandingProjects;
