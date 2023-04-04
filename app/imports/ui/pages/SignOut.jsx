import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Col } from 'react-bootstrap';
import { PageIDs } from '../utilities/ids';

/* After the user clicks the "SignOut" link in the NavBar, log them out and display this page. */
const SignOut = () => {
  Meteor.logout();
  return (
    <Col id={PageIDs.signOutPage} className="text-center"><h2>You are signed out.</h2></Col>
  );
};

export default SignOut;
