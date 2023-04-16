import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { Forums } from '../../api/forums/Forums';
import LoadingSpinner from '../components/LoadingSpinner';
import { pageStyle } from './pageStyles';
import { PageIDs } from '../utilities/ids';
import AddComment from '../components/AddComment';
import { Comments } from '../../api/forums/Comments';
import ListComments from '../components/ListComments';

/* Gets the Forum data as well as Profiles and Interests associated with the passed Forum name. */
function getForumData(title) {
  return Forums.collection.findOne({ title });
}

/* Component for layout out a Forum Card. */
const MakeForumCard = ({ forum, comments }) => (
  <Col>
    <Card className="h-100">
      <Card.Header>
        <Card.Title>{forum.title}</Card.Title>
        <Card.Subtitle>{forum.topic}</Card.Subtitle>
      </Card.Header>
      <Card.Body>
        <Card.Text>{forum.leadComment}</Card.Text>
        <ListGroup variant="flush">
          {comments.map((comment) => <ListComments key={comment._id} comment={comment} />)}
        </ListGroup>
        <AddComment forumID={forum._id} />
      </Card.Body>
    </Card>
  </Col>
);

MakeForumCard.propTypes = {
  forum: PropTypes.shape({
    title: PropTypes.string,
    topic: PropTypes.string,
    leadComment: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
  comments: PropTypes.arrayOf(PropTypes.shape({
    comment: PropTypes.string,
    forumID: PropTypes.string,
    owner: PropTypes.string,
    date: PropTypes.instanceOf(Date),
    _id: PropTypes.string,
  })).isRequired,
};

/* Renders the Forum Collection as a set of Cards. */
const ForumsPage = () => {
  const { ready } = useTracker(() => {
    // Ensure that minimongo is populated with all collections prior to running render().
    const subForums = Meteor.subscribe(Forums.userPublicationName);
    const subComments = Meteor.subscribe(Comments.userPublicationName);
    return {
      ready: subForums.ready() && subComments.ready(),
    };
  }, []);
  const forums = _.pluck(Forums.collection.find().fetch(), 'title');
  const forumData = forums.map(forum => getForumData(forum));
  const commentData = Comments.collection.find({}).fetch();
  return ready ? (
    <div>
      <h1 className="text-center py-4"><strong>Forums</strong></h1>
      <Container id={PageIDs.forumsPage} style={pageStyle}>
        <Row>
          {forumData.map((forum, index) => <MakeForumCard key={index} forum={forum} comments={commentData.filter(comment => (comment.forumID === forum._id))} />)}
        </Row>
      </Container>
    </div>
  ) : <LoadingSpinner />;
};

export default ForumsPage;
