import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup } from 'react-bootstrap';

const ListComments = ({ comment }) => (
  <ListGroup.Item>
    <p className="fw-lighter">{comment.date.toLocaleDateString('en-US')}</p>
    <p>{comment.comment}</p>
  </ListGroup.Item>
);

// Require a document to be passed to this component.
ListComments.propTypes = {
  comment: PropTypes.shape({
    comment: PropTypes.string,
    forumID: PropTypes.string,
    owner: PropTypes.string,
    date: PropTypes.instanceOf(Date),
    _id: PropTypes.string,
  }).isRequired,
};

export default ListComments;
