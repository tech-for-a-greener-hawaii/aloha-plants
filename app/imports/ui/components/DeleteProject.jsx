import React from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Trash } from 'react-bootstrap-icons';
import { Projects } from '../../api/projects/Projects';

/* Renders the AddStuff page for adding a document. */
const DeleteProject = ({ project }) => (
  <Button
    variant="danger"
    onClick={() => {
      Projects.collection.remove({ _id: project._id });
    }}
  ><Trash />
  </Button>
);

DeleteProject.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  project: PropTypes.object.isRequired,
};

export default DeleteProject;
