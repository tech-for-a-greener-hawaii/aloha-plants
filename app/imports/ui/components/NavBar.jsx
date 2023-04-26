import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { NavLink } from 'react-router-dom';
import { Container, Image, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { BoxArrowRight, PersonFill, PersonPlusFill, Gear } from 'react-bootstrap-icons';
import { ComponentIDs } from '../utilities/ids';
import { Profiles } from '../../api/profiles/Profiles';

const NavBar = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker

  const { ready, email } = useTracker(() => {
    // Ensure that minimongo is populated with all collections prior to running render().
    const sub = Meteor.subscribe(Profiles.userPublicationName);
    return {
      ready: sub.ready(),
      email: Meteor.user()?.username,
    };
  }, []);

  const defaultProfileImage = '/images/defaultProfileImage.png';
  const userProfile = Profiles.collection.findOne({ email: email });
  const userImage = userProfile != null && userProfile.picture != null ? userProfile.picture : defaultProfileImage;

  const { currentUser, loggedIn, adminUser } = useTracker(() => ({
    currentUser: Meteor.user() ? Meteor.user().username : '',
    adminUser: Meteor.user() ? Meteor.user().username : '',
    loggedIn: !!Meteor.user(),
  }), []);
  const menuStyle = { marginBottom: '0px' };
  const navbarClassName = loggedIn ? 'bg-dark' : 'bg-light';
  return ready ? (
    <Navbar expand="lg" style={menuStyle} className={navbarClassName}>
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="align-items-center">
          <span style={{ fontWeight: 800, fontSize: '24px' }}><Image src="/images/Flowers-2.png" width={50} style={{ marginBottom: 3 }} /> Aloha Plants</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls={ComponentIDs.basicNavbarNav} />
        <Navbar.Collapse id={ComponentIDs.basicNavbarNav}>
          <Nav className="me-auto justify-content-start">
            {currentUser ? (
              <Nav.Link as={NavLink} id={ComponentIDs.homeMenuItem} to="/home" key="home">Home</Nav.Link>
            ) : ''}
            {currentUser === '' || !(currentUser === 'admin@foo.com') ? (
              <Nav.Link as={NavLink} id={ComponentIDs.projectsMenuItem} to="/projects" key="projects">Projects</Nav.Link>
            ) : ''}
            {currentUser === 'admin@foo.com' ? (
              <Nav.Link as={NavLink} id={ComponentIDs.projectsMenuItem} to="/adminprojects" key="adminprojects">Projects</Nav.Link>
            ) : ''}
            <Nav.Link as={NavLink} id={ComponentIDs.plantsMenuItem} to="/plants" key="plants">Plants</Nav.Link>
            {currentUser ? (
              <Nav.Link as={NavLink} id={ComponentIDs.forumsMenuItem} to="/Forums" key="forums">Forums</Nav.Link>
            ) : ''}
            {adminUser === 'admin@foo.com' ? (
              <Nav.Link as={NavLink} id={ComponentIDs.addProjectMenuItem} to="/addProject" key="addP">Add Project</Nav.Link>
            ) : ''}
            {currentUser ? (
              <Nav.Link as={NavLink} id={ComponentIDs.addPlantMenuItem} to="/addPlant" key="addPlant">Add Plant</Nav.Link>
            ) : ''}
          </Nav>
          <Nav className="justify-content-end align-content-start">
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
              <Nav>
                <Navbar.Brand>
                  <Image className="user-icon" src={userImage} alt="img" />
                </Navbar.Brand>
                <NavDropdown id={ComponentIDs.currentUserDropdown} title={currentUser}>
                  <NavDropdown.Item id={ComponentIDs.currentUserDropdownSettings} as={NavLink} to="/settings">
                    <Gear />
                    {' '}
                    Settings
                  </NavDropdown.Item>
                  <NavDropdown.Item id={ComponentIDs.currentUserDropdownSignOut} as={NavLink} to="/signout">
                    <BoxArrowRight />
                    {' '}
                    Sign
                    out
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  ) : <div />;
};

export default NavBar;
