import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Landing from '../pages/Landing';
import NotFound from '../pages/NotFound';
import SignUp from '../pages/SignUp';
import SignOut from '../pages/SignOut';
import NavBar from '../components/NavBar';
import SignIn from '../pages/SignIn';
import NotAuthorized from '../pages/NotAuthorized';
import Projects from '../pages/Projects';
import Plants from '../pages/Plants';
import Interests from '../pages/Interests';
import Home from '../pages/Home';
import Filter from '../pages/Filter';
import AddProject from '../pages/AddProject';
import Forums from '../pages/Forums';
import Settings from '../pages/Settings';

/* Top-level layout component for this application. Called in imports/startup/client/startup.jsx. */
const App = () => (
  <Router>
    <div className="d-flex flex-column min-vh-100">
      <NavBar />
      <Routes>
        <Route exact path="/" element={<Landing />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signout" element={<SignOut />} />
        <Route path="/interests" element={<Interests />} />
        <Route path="/forums" element={<Forums />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/plants" element={<Plants />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/filter" element={<ProtectedRoute><Filter /></ProtectedRoute>} />
        <Route path="/addproject" element={<AdminRoute><AddProject /></AdminRoute>} />
        <Route path="/notauthorized" element={<NotAuthorized />} />
        <Route path="/settings" element={<ProtectedRoute><Settings /> </ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  </Router>
);

/*
 * ProtectedRoute (see React Router v6 sample)
 * Checks for Meteor login before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const ProtectedRoute = ({ children }) => {
  const isLogged = Meteor.userId() !== null;
  return isLogged ? children : <Navigate to="/signin" />;
};

// Require a component and location to be passed to each ProtectedRoute.
ProtectedRoute.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};

ProtectedRoute.defaultProps = {
  children: <Home />,
};

/*
* AdminRoute (see React Router v6 sample)
* Checks for Admin login before routing to the requested page, otherwise goes to NotAuthorized page.
* @param {any} { component: Component, ...rest }
*/
const AdminRoute = ({ children }) => {
  const isLogged = Meteor.userId() !== null;
  if (!isLogged) {
    return <Navigate to="/signin" />;
  }
  const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
  return (isLogged && isAdmin) ? children : <Navigate to="/notauthorized" />;
};

// Require a component and location to be passed to each ProtectedRoute.
AdminRoute.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};

AdminRoute.defaultProps = {
  children: <Landing />,
};

export default App;
