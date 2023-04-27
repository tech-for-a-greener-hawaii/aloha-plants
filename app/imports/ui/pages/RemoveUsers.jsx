import React, { useState } from 'react';
import { Button, Col, Image, Row, Modal, InputGroup, Form } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { useTracker } from 'meteor/react-meteor-data';
import { PageIDs } from '../utilities/ids';
import { Profiles } from '../../api/profiles/Profiles';
import LoadingSpinner from '../components/LoadingSpinner';

/* A simple static component to render some text for the landing page. */

const ProfileCard = ({ profile }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const remove = (data) => {
    Profiles.collection.remove({ _id: data._id });
  };

  const defaultProfileImage = '/images/defaultProfileImage.png';
  const checkProfileImage = profile.picture != null ? profile.picture : defaultProfileImage;
  return (
    <Col>
      <p>{profile.email}</p>
      <p>{profile.firstName} {profile.lastName}</p>
      <Image roundedCircle src={checkProfileImage} width={50} />
      <Button
        className="mt-auto"
        variant="danger"
        onClick={handleShow}
      >
        Leave
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Remove User</Modal.Title>
        </Modal.Header>
        <Modal.Body>Type DELETE to confirm</Modal.Body>
        <Modal.Footer>
          <Form.Control
            aria-label="Username"
          />
          {/*<Button variant="secondary" onClick={handleClose}>*/}
          {/*  Close*/}
          {/*</Button>*/}
          {/*<Button variant="primary" onClick={handleClose}>*/}
          {/*  Save Changes*/}
          {/*</Button>*/}
        </Modal.Footer>
      </Modal>
    </Col>
  );
};

ProfileCard.propTypes = {
  profile: PropTypes.shape({
    email: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    picture: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};
const RemoveUsers = () => {
  const { ready } = useTracker(() => {
    const sub = Meteor.subscribe(Profiles.userPublicationName);
    return {
      ready: sub.ready(),
    };
  }, []);
  const profiles = Profiles.collection.find().fetch();
  return ready ? (
    <div id={PageIDs.removeUsersPage}>
      <Row xs={1} md={2} lg={4} className="g-2 mt-2">
        {profiles.map((profile, index) => <ProfileCard key={index} profile={profile} />)}
      </Row>
    </div>
  ) : <LoadingSpinner />;
};

export default RemoveUsers;
