import React, { useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { useTracker } from 'meteor/react-meteor-data';
import { PageIDs } from '../utilities/ids';
import { ProjectsInterests } from '../../api/projects/ProjectsInterests';
import { ProfilesProjects } from '../../api/profiles/ProfilesProjects';
import { Profiles } from '../../api/profiles/Profiles';
import { Projects } from '../../api/projects/Projects';
import LoadingSpinner from '../components/LoadingSpinner';
import ProjectCard from '../components/ProjectCard';
import SearchBar from '../components/SearchBar';

/* Gets the Project data as well as Profiles and Interests associated with the passed Project name. */
function getProjectData(name) {
  const data = Projects.collection.findOne({ name });
  const interests = _.pluck(ProjectsInterests.collection.find({ project: name }).fetch(), 'interest');
  const profiles = _.pluck(ProfilesProjects.collection.find({ project: name }).fetch(), 'profile');
  return _.extend({}, data, { interests, participants: profiles });
}

/* A simple static component to render some text for the landing page. */
const Landing = () => {
  const [projectDataFiltered, setProjectDataFiltered] = useState([]);
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
  const profileProjects = _.pluck(_.where(ProfilesProjects.collection.find().fetch(), { profile: email }), 'project');
  const projectData = profileProjects.map(project => getProjectData(project));
  return ready ? (
    <div id={PageIDs.landingPage} className="landing-lightGreen-background">
      <Container className="justify-content-center">
        <Row>
          <h1>Your Projects</h1>
        </Row>
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
        <Row xs={1} md={2} lg={3} className="g-2 mt-2 mb-4">
          {projectDataFiltered.map((project, index) => <ProjectCard key={index} project={project} email={email} />)}
        </Row>
      </Container>
    </div>
  ) : <LoadingSpinner />;
};

export default Landing;
