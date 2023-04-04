import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { NavLink } from 'react-router-dom';
import { Container, Image, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { BoxArrowRight, PersonFill, PersonPlusFill } from 'react-bootstrap-icons';
import { ComponentIDs } from '../utilities/ids';

const NavBar = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { currentUser, loggedIn } = useTracker(() => ({
    currentUser: Meteor.user() ? Meteor.user().username : '',
    loggedIn: !!Meteor.user(),
  }), []);
  const menuStyle = { marginBottom: '0px' };
  const navbarClassName = loggedIn ? 'bg-dark' : 'bg-light';
  return (
    <Navbar expand="lg" style={menuStyle} className={navbarClassName}>
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="align-items-center">
          <span style={{ fontWeight: 800, fontSize: '24px' }}><Image src="/images/logo.png" width={50} style={{ marginBottom: 3 }} /> Bowfolios</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls={ComponentIDs.basicNavbarNav} />
        <Navbar.Collapse id={ComponentIDs.basicNavbarNav}>
          <Nav className="me-auto justify-content-start">
            {currentUser ? (
              <Nav.Link as={NavLink} id={ComponentIDs.homeMenuItem} to="/home" key="home">Home</Nav.Link>
            ) : ''}
            <Nav.Link as={NavLink} id={ComponentIDs.profilesMenuItem} to="/profiles" key="profiles">Profiles</Nav.Link>
            <Nav.Link as={NavLink} id={ComponentIDs.projectsMenuItem} to="/projects" key="projects">Projects</Nav.Link>
            <Nav.Link as={NavLink} id={ComponentIDs.interestsMenuItem} to="/interests" key="interests">Interests</Nav.Link>
            {currentUser ? (
              [<Nav.Link as={NavLink} id={ComponentIDs.addProjectMenuItem} to="/addProject" key="addP">Add Project</Nav.Link>,
                <Nav.Link as={NavLink} id={ComponentIDs.filterMenuItem} to="/filter" key="filter">Filter</Nav.Link>]
            ) : ''}
          </Nav>
          <Nav className="justify-content-end">
            {currentUser === '' ? (
              <NavDropdown id={ComponentIDs.loginDropdown} title="Login">
                <NavDropdown.Item id={ComponentIDs.loginDropdownSignIn} as={NavLink} to="/signin">
                  <PersonFill />
                  Sign
                  in
                </NavDropdown.Item>
                <NavDropdown.Item id={ComponentIDs.loginDropdownSignUp} as={NavLink} to="/signup">
                  <PersonPlusFill />
                  Sign
                  up
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavDropdown id={ComponentIDs.currentUserDropdown} title={currentUser}>
                <NavDropdown.Item id={ComponentIDs.currentUserDropdownSignOut} as={NavLink} to="/signout">
                  <BoxArrowRight />
                  {' '}
                  Sign
                  out
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
