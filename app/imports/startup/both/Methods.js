import { Meteor } from 'meteor/meteor';
import { Projects } from '../../api/projects/Projects';
import { Profiles } from '../../api/profiles/Profiles';
import { ProfilesInterests } from '../../api/profiles/ProfilesInterests';
import { ProfilesProjects } from '../../api/profiles/ProfilesProjects';
import { ProjectsInterests } from '../../api/projects/ProjectsInterests';

/**
 * In Bowfolios, insecure mode is enabled, so it is possible to update the server's Mongo database by making
 * changes to the client MiniMongo DB.
 *
 * However, updating the database via client-side calls can be inconvenient for two reasons:
 *   1. If we want to update multiple collections, we need to use nested callbacks in order to trap errors, leading to
 *      the dreaded "callback hell".
 *   2. For update and removal, we can only provide a docID as the selector on the client-side, making bulk deletes
 *      hard to do via nested callbacks.
 *
 * A simple solution to this is to use Meteor Methods (https://guide.meteor.com/methods.html). By defining and
 * calling a Meteor Method, we can specify code to be run on the server-side but invoked by clients. We don't need
 * to use callbacks, because any errors are thrown and sent back to the client. Also, the restrictions on the selectors
 * are removed for server-side code.
 *
 * Meteor Methods are commonly introduced as the necessary approach to updating the DB once the insecure package is
 * removed, and that is definitely true, but Bowfolios illustrates that they can simplify your code significantly
 * even when prototyping. It turns out that we can remove insecure mode if we want, as we use Meteor methods to update
 * the database.
 *
 * Note that it would be even better if each method was wrapped in a transaction so that the database would be rolled
 * back if any of the intermediate updates failed. Left as an exercise to the reader.
 */

const addProfileMethod = 'Profiles.add';

Meteor.methods({
  'Profiles.add'({ email, firstName, lastName, picture, interests }) {
    Profiles.collection.insert({ email, firstName, lastName, picture, interests });
  },
});

const addProfilesProjectMethod = 'ProfilesProject.add';

Meteor.methods({
  'ProfilesProject.add'({ profile, project }) {
    ProfilesProjects.collection.insert({ profile, project });
  },
});

const removeProfilesProjectMethod = 'ProfilesProject.remove';

Meteor.methods({
  'ProfilesProject.remove'({ profile, project }) {
    ProfilesProjects.collection.remove({ profile, project });
  },
});

const removeProfile = 'Profiles.remove';

Meteor.methods({
  'Profiles.remove'({ profile }) {
    ProfilesProjects.collection.remove({ profile });
  },
});

const updateProfileMethod = 'Profiles.update';

/**
 * The server-side Profiles.update Meteor Method is called by the client-side Home page after pushing the update button.
 * Its purpose is to update the Profiles, ProfilesInterests, and ProjectsPlants collections to reflect the
 * updated situation specified by the user.
 */
Meteor.methods({
  'Profiles.update'({ email, firstName, lastName, picture, interests }) {
    Profiles.collection.update({ email }, { $set: { email, firstName, lastName, picture } });
    ProfilesInterests.collection.remove({ profile: email });
    interests.map((interest) => ProfilesInterests.collection.insert({ profile: email, interest }));
  },
});

const addProjectMethod = 'Projects.add';

/** Creates a new project in the Projects collection, and also updates ProjectsPlants and ProjectsInterests. */
Meteor.methods({
  'Projects.add'({ name, owner, description, picture, interests, homepage }) {
    Projects.collection.insert({ name, owner, description, picture, homepage });
    ProfilesProjects.collection.remove({ project: name });
    ProjectsInterests.collection.remove({ project: name });
    if (interests) {
      interests.map((interest) => ProjectsInterests.collection.insert({ project: name, interest }));
    } else {
      throw new Meteor.Error('At least one interest is required.');
    }
    if (owner) {
      ProfilesProjects.collection.insert({ project: name, profile: owner });
    }
  },
});

export { updateProfileMethod, addProjectMethod, addProfileMethod, addProfilesProjectMethod, removeProfilesProjectMethod, removeProfile };
