import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { Projects } from '../../api/projects/Projects';
import { ProjectsInterests } from '../../api/projects/ProjectsInterests';
import { Profiles } from '../../api/profiles/Profiles';
import { ProfilesProjects } from '../../api/profiles/ProfilesProjects';
import { ProfilesInterests } from '../../api/profiles/ProfilesInterests';
import { Interests } from '../../api/interests/Interests';
import { Plants } from '../../api/plants/Plants';
import { PlantsInterests } from '../../api/plants/PlantsInterests';
import { Forums } from '../../api/forums/Forums';

/* eslint-disable no-console */

/** Define a user in the Meteor accounts package. This enables login. Username is the email address. */
function createUser(email, role) {
  const userID = Accounts.createUser({ username: email, email, password: 'foo' });
  if (role === 'admin') {
    Roles.createRole(role, { unlessExists: true });
    Roles.addUsersToRoles(userID, 'admin');
  } else if (role === 'creator') {
    Roles.createRole(role);
    Roles.addUsersToRoles(userID, 'creator');
  }
}

/** Define an interest.  Has no effect if interest already exists. */
function addInterest(interest) {
  Interests.collection.insert(interest);
}

if (Interests.collection.find().count() === 0) {
  console.log('Added default interests');
  if (Meteor.settings.defaultInterests) {
    Meteor.settings.defaultInterests.forEach(interest => addInterest(interest));
  }
}

/** Defines a new user and associated profile. Error if user already exists. */
function addProfile({ firstName, lastName, interests, projects, picture, email, role }) {
  console.log(`Defining profile ${email}`);
  // Define the user in the Meteor accounts package.
  // Check if user already exists
  if (Accounts.findUserByEmail(email) == null) {
    createUser(email, role);
  }
  // Create the profile.
  Profiles.collection.insert({ email, firstName, lastName, picture, role });
  // Add interests and projects.
  if (interests != null) {
    interests.map(interest => ProfilesInterests.collection.insert({ profile: email, interest }));
  }
  if (projects != null) {
    projects.map(project => ProfilesProjects.collection.insert({ profile: email, project }));
  }
}

/** Define a new project. Error if project already exists.  */
function addProject({ name, owner, homepage, description, interests, picture }) {
  console.log(`Defining project ${name}`);
  Projects.collection.insert({ name, owner, homepage, description, picture });
  interests.map(interest => ProjectsInterests.collection.insert({ project: name, interest }));
  ProfilesProjects.collection.insert({ profile: owner, project: name });
}

/** Define a new forum. Error if project already exists.  */
const addForum = (forum) => {
  console.log(`Adding ${forum.title}`);
  Forums.collection.insert(forum);
};

if (Forums.collection.find().count() === 0) {
  if (Meteor.settings.defaultForums) {
    console.log('Creating default forums');
    Meteor.settings.defaultForums.forEach(forum => addForum(forum));
  }
}

/** Define a new forum. Error if project already exists.  */
const addPlant = (plant) => {
  console.log(`Adding ${plant.name}`);
  plant.interests.map(interest => PlantsInterests.collection.insert({ plantName: plant.name, interest }));
  console.log(PlantsInterests.collection.find().count());
  Plants.collection.insert(plant);
};

if (Plants.collection.find().count() === 0) {
  if (Meteor.settings.defaultPlants) {
    console.log('Creating default plants');
    // console.log(Meteor.settings.defaultPlants)
    Meteor.settings.defaultPlants.forEach(plant => addPlant(plant));
  }
}

/** Initialize DB if it appears to be empty (i.e. no users defined.) */
if (Meteor.users.find().count() === 0) {
  if (Meteor.settings.defaultProjects && Meteor.settings.defaultProfiles && Meteor.settings.defaultForums && Meteor.settings.defaultPlants) {
    console.log('Creating the Admin User');
    createUser('admin@foo.com', 'admin');
    addProfile({ firstName: '', lastName: '', interests: null, projects: null, picture: '', email: 'admin@foo.com', role: 'admin' });
    console.log('Creating the Default Creator: creator@foo.com');
    createUser('creator@foo.com', 'creator');
    addProfile({ firstName: '', lastName: '', interests: null, projects: null, picture: '', email: 'creator@foo.com', role: 'creator' });
    console.log('Creating the Default User: john@foo.com');
    createUser('john@foo.com', 'user');
    addProfile({ firstName: '', lastName: '', interests: null, projects: null, picture: '', email: 'john@foo.com', role: 'user' });

    console.log('Creating the default profiles');
    Meteor.settings.defaultProfiles.map(profile => addProfile(profile));
    console.log('Creating the default projects');
    Meteor.settings.defaultProjects.map(project => addProject(project));
    // Meteor.settings.defaultPlants.map(plants => addPlant(plants));
  } else {
    console.log('Cannot initialize the database!  Please invoke meteor with a settings file.');
  }
}

/**
 * If the loadAssetsFile field in settings.development.json is true, then load the data in private/data.json.
 * This approach allows you to initialize your system with large amounts of data.
 * Note that settings.development.json is limited to 64,000 characters.
 * We use the "Assets" capability in Meteor.
 * For more info on assets, see https://docs.meteor.com/api/assets.html
 * User count check is to make sure we don't load the file twice, which would generate errors due to duplicate info.
 */
if ((Meteor.settings.loadAssetsFile) && (Meteor.users.find().count() < 7)) {
  const assetsFileName = 'data.json';
  console.log(`Loading data from private/${assetsFileName}`);
  const jsonData = JSON.parse(Assets.getText(assetsFileName));
  jsonData.profiles.map(profile => addProfile(profile));
  jsonData.projects.map(project => addProject(project));
  jsonData.forums.map(forum => addForum(forum));
  jsonData.plants.map(plant => addPlant(plant));
}
