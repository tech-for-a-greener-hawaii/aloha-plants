import React from 'react';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Container, Card, Image, Badge, Row, Col } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { AutoForm, SelectField, SubmitField } from 'uniforms-bootstrap5';
import { Interests } from '../../api/interests/Interests';
import { Profiles } from '../../api/profiles/Profiles';
import { ProfilesInterests } from '../../api/profiles/ProfilesInterests';
import { ProfilesProjects } from '../../api/profiles/ProfilesProjects';
import { Projects } from '../../api/projects/Projects';
import LoadingSpinner from '../components/LoadingSpinner';
import { useStickyState } from '../utilities/StickyState';
import { pageStyle } from './pageStyles';
import { ComponentIDs, PageIDs } from '../utilities/ids';

/* Create a schema to specify the structure of the data to appear in the form. */
const makeSchema = (allInterests) => new SimpleSchema({
  interests: { type: Array, label: 'Interests', optional: true },
  'interests.$': { type: String, allowedValues: allInterests },
});

function getProfileData(email) {
  const data = Profiles.collection.findOne({ email });
  const interests = _.pluck(ProfilesInterests.collection.find({ profile: email }).fetch(), 'interest');
  const projects = _.pluck(ProfilesProjects.collection.find({ profile: email }).fetch(), 'project');
  const projectPictures = projects.map(project => Projects.collection.findOne({ name: project }).picture);
  return _.extend({}, data, { interests, projects: projectPictures });
}

/* Component for layout out a Profile Card. */
const MakeCard = ({ profile }) => (
  <Col>
    <Card className="h-100">
      <Card.Header><Image src={profile.picture} width={50} /></Card.Header>
      <Card.Body>
        <Card.Title>{profile.firstName} {profile.lastName}</Card.Title>
        <Card.Subtitle><span className="date">{profile.title}</span></Card.Subtitle>
        <Card.Text>{profile.bio}</Card.Text>
      </Card.Body>
      <Card.Body>
        {profile.interests.map((interest, index) => <Badge key={index} bg="info">{interest}</Badge>)}
      </Card.Body>
      <Card.Footer>
        <h5>Projects</h5>
        {profile.projects.map((project, index) => <Image key={index} src={project} width={50} />)}
      </Card.Footer>
    </Card>
  </Col>
);

/* Properties */
MakeCard.propTypes = {
  profile: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    picture: PropTypes.string,
    title: PropTypes.string,
    bio: PropTypes.string,
    interests: PropTypes.arrayOf(PropTypes.string),
    projects: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

/* Renders the Profile Collection as a set of Cards. */
const Filter = () => {
  const [interests, setInterests] = useStickyState('interests', []);

  const { ready, interestDocs, profileInterests } = useTracker(() => {
    // Ensure that minimongo is populated with all collections prior to running render().
    const sub1 = Meteor.subscribe(Profiles.userPublicationName);
    const sub2 = Meteor.subscribe(ProfilesInterests.userPublicationName);
    const sub3 = Meteor.subscribe(ProfilesProjects.userPublicationName);
    const sub4 = Meteor.subscribe(Projects.userPublicationName);
    const sub5 = Meteor.subscribe(Interests.userPublicationName);
    return {
      ready: sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready(),
      interestDocs: Interests.collection.find().fetch(),
      profileInterests: ProfilesInterests.collection.find().fetch(),
    };
  }, []);

  const submit = (data) => {
    setInterests(data.interests || []);
  };

  const allInterests = _.pluck(interestDocs, 'name');
  const formSchema = makeSchema(allInterests);
  const bridge = new SimpleSchema2Bridge(formSchema);
  const profileWithInterest = profileInterests.filter(pI => interests.includes(pI.interest));
  const emails = _.pluck(profileWithInterest, 'profile');
  const profileData = _.uniq(emails).map(email => getProfileData(email));
  const transform = (label) => ` ${label}`;

  return ready ? (
    <Container id={PageIDs.filterPage} style={pageStyle}>
      <AutoForm schema={bridge} onSubmit={data => submit(data)} model={{ interests }}>
        <Card>
          <Card.Body id={ComponentIDs.filterFormInterests}>
            <SelectField name="interests" multiple placeholder="Interests" checkboxes transform={transform} />
            <SubmitField id={ComponentIDs.filterFormSubmit} value="Submit" />
          </Card.Body>
        </Card>
      </AutoForm>
      <Row xs={1} md={2} lg={4} className="g-2" style={{ paddingTop: '10px' }}>
        {profileData.map((profile, index) => <MakeCard key={index} profile={profile} />)}
      </Row>
    </Container>
  ) : <LoadingSpinner />;
};

export default Filter;
