import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { Forums } from '../../api/forums/Forums';
import LoadingSpinner from '../components/LoadingSpinner';
import { pageStyle } from './pageStyles';
import { PageIDs } from '../utilities/ids';

/* Gets the Forum data as well as Profiles and Interests associated with the passed Forum name. */
function getForumData(title) {
  return Forums.collection.findOne({ title });
}

/* Component for layout out a Forum Card. */
const MakeCard = ({ forum }) => (
  <Col>
    <Card className="h-100">
      <Card.Header>
        <Card.Title>{forum.title}</Card.Title>
        <Card.Subtitle>{forum.topic}</Card.Subtitle>
      </Card.Header>
      <Card.Body>
        <Card.Text>{forum.leadComment}</Card.Text>
      </Card.Body>
    </Card>
  </Col>
);

MakeCard.propTypes = {
  forum: PropTypes.shape({
    title: PropTypes.string,
    topic: PropTypes.string,
    leadComment: PropTypes.string,
  }).isRequired,
};

/* Renders the Forum Collection as a set of Cards. */
const ForumsPage = () => {
  const { ready } = useTracker(() => {
    // Ensure that minimongo is populated with all collections prior to running render().
    const sub = Meteor.subscribe(Forums.userPublicationName);
    return {
      ready: sub.ready(),
    };
  }, []);
  const forums = _.pluck(Forums.collection.find().fetch(), 'title');
  const forumData = forums.map(forum => getForumData(forum));
  return ready ? (
    <div>
      <h1 className="text-center py-4"><strong>Forums</strong></h1>
      <Container id={PageIDs.forumsPage} style={pageStyle}>
        <Row>
          {forumData.map((forum, index) => <MakeCard key={index} forum={forum} />)}
        </Row>
      </Container>
    </div>
  ) : <LoadingSpinner />;
};

export default ForumsPage;
