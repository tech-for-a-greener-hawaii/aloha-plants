import React, { useState } from 'react';
import { Button, Col, Row, Modal, Form, Card } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { useTracker } from 'meteor/react-meteor-data';
import { PageIDs } from '../utilities/ids';
import { Profiles } from '../../api/profiles/Profiles';
import LoadingSpinner from '../components/LoadingSpinner';

/* A simple static component to render some text for the landing page. */

const ProfileCard = ({ profile }) => {
  const [show, setShow] = useState(false);
  const [disableButton, setDisableButton] = useState(true);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const checkInput = (event) => {
    if (event.target.value === 'DELETE') {
      setDisableButton(false);
    } else {
      setDisableButton(true);
    }
  };
  const remove = (data) => {
    Profiles.collection.remove({ _id: data._id });
    setShow(false);
  };

  const defaultProfileImage = '/images/defaultProfileImage.png';
  const checkProfileImage = profile.picture != null ? profile.picture : defaultProfileImage;
  return (
    <Col>
      <Card className="h-100 center-text" id="project-card">
        <Card.Body>
          <Card.Img src={checkProfileImage} width={50} />
          <Card.Title style={{ marginTop: '10px', textAlign: 'center' }}>
            <p>{profile.firstName} {profile.lastName}</p>
          </Card.Title>
          <Card.Text style={{ textAlign: 'center' }}>
            <p>{profile.email}</p>
          </Card.Text>
        </Card.Body>
        <Button
          className="mt-auto"
          variant="danger"
          onClick={handleShow}
        >
          Delete
        </Button>
        <Modal show={show} onHide={() => handleClose()} centered>
          <Modal.Header closeButton>
            <Modal.Title>Remove User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Type <strong>DELETE</strong> to confirm</p>
            <Form.Control
              id="deleteText"
              aria-label="Username"
              onChange={checkInput}
            />
            <div className="d-flex justify-content-end mt-3">
              <Button disabled={disableButton} id="deleteButton" variant="danger" onClick={() => remove(profile)}>
                CONFIRM
              </Button>
            </div>

          </Modal.Body>
        </Modal>
      </Card>
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
      <Row xs={1} md={2} lg={6} className="g-2 mt-2">
        {profiles.map((profile, index) => <ProfileCard key={index} profile={profile} />)}
      </Row>
    </div>
  ) : <LoadingSpinner />;
};

export default RemoveUsers;
