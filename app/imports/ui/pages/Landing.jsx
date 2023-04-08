import React from 'react';
import { Col, Container, Image, Row } from 'react-bootstrap';
import Carousel from 'react-bootstrap/Carousel';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { useTracker } from 'meteor/react-meteor-data';
import { PageIDs } from '../utilities/ids';
import { Plants } from '../../api/plants/Plants';
import { ProjectsInterests } from '../../api/projects/ProjectsInterests';
import { ProfilesProjects } from '../../api/profiles/ProfilesProjects';
import { Profiles } from '../../api/profiles/Profiles';
import { Projects } from '../../api/projects/Projects';
import LoadingSpinner from '../components/LoadingSpinner';

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
/* A simple static component to render some text for the landing page. */
const Landing = () => {
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
    <div id={PageIDs.landingPage}>
      <div className="landing-green-background">
        <Container>
          <h1 style={{ paddingTop: '10px', paddingBottom: '15px', paddingLeft: '60px', color: 'white', fontSize: '50pt' }}>
            <strong>Aloha Plants</strong>
            <Image src="/images/flowers-1.png" width={100} paddingLeft={30} />
          </h1>
        </Container>
      </div>
      <div className="landing-lightGreen-background">
        <Container className="justify-content-center text-center">
          <Row className="justify-content-center">
            <Col xs={3}>
              <h2 style={{ color: 'white' }}><strong>Browse Plants</strong></h2>
              <Carousel>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    /* eslint-disable-next-line max-len */
                    src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fimages.fineartamerica.com%2Fimages-medium-large%2Fhawaiian-mao-hau-hele-1937-joe-diaz.jpg&f=1&nofb=1&ipt=8f9830d68360d7ccf18f01224e2b8f588b5207927d9f11f0ca2e582c3d444c65&ipo=images"
                    alt="First slide"
                  />
                  <Carousel.Caption>
                    <h3>maʻo hau hele</h3>
                    <p>Cool plant.</p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src="https://upload.wikimedia.org/wikipedia/commons/5/50/California_Arena_Point_fern.jpg"
                    alt="First slide"
                  />
                  <Carousel.Caption>
                    <h3>Another Plant</h3>
                    <p>Very cool plant</p>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>
            </Col>
            <Col xs={1} />
            <Col xs={3}>
              <h2 style={{ color: 'white' }}><strong>Browse Projects</strong></h2>
              <Carousel>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    /* eslint-disable-next-line max-len */
                    src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Joy_Oil_gas_station_blueprints.jpg"
                    alt="First slide"
                  />
                  <Carousel.Caption>
                    <h3>Awesome Project</h3>
                    <p>This project is very much a project.</p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src="https://upload.wikimedia.org/wikipedia/commons/a/a4/AcotacionTecnico.svg"
                    alt="First slide"
                  />
                  <Carousel.Caption>
                    <h3>Another Project</h3>
                    <p>Cool project</p>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>
            </Col>
            <Col xs={1} />
            <Col xs={3}>
              <h2 style={{ color: 'white' }}><strong>Browse Forums</strong></h2>
              <Carousel>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    /* eslint-disable-next-line max-len */
                    src="https://www.hostgator.com/blog/wp-content/uploads/2018/08/hostgator-support-forum-768x817.png"
                    alt="First slide"
                  />
                  <Carousel.Caption>
                    <h3>Forum 1</h3>
                    <p>Cool forum.</p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src="https://www.proprofstraining.com/blog/wp-content/uploads/2017/09/Forum-Discussion.jpg"
                    alt="First slide"
                  />
                  <Carousel.Caption>
                    <h3>Another Forum</h3>
                    <p>Very cool forum</p>
                  </Carousel.Caption>
                </Carousel.Item>
                {plantData.map((plant) => <MakeItem plant={plant} />)}
              </Carousel>
            </Col>
          </Row>
          <Row>
            <Col style={{ paddingTop: '10px', paddingBottom: '15px' }} />
          </Row>
        </Container>
      </div>
    </div>
  ) : <LoadingSpinner />;
};

export default Landing;
