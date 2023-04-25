import { Meteor } from 'meteor/meteor';
import { Interests } from '../../api/interests/Interests';
import { Profiles } from '../../api/profiles/Profiles';
import { ProfilesInterests } from '../../api/profiles/ProfilesInterests';
import { ProfilesProjects } from '../../api/profiles/ProfilesProjects';
import { Projects } from '../../api/projects/Projects';
import { ProjectsInterests } from '../../api/projects/ProjectsInterests';
import { Plants } from '../../api/plants/Plants';
import { PlantsInterests} from '../../api/plants/PlantsInterests';
import { Forums } from '../../api/forums/Forums';
import { Comments } from '../../api/forums/Comments';

/** Define a publication to publish all interests. */
Meteor.publish(Interests.userPublicationName, () => Interests.collection.find());

/** Define a publication to publish all profiles. */
Meteor.publish(Profiles.userPublicationName, () => Profiles.collection.find());

/** Define a publication to publish this collection. */
Meteor.publish(ProfilesInterests.userPublicationName, () => ProfilesInterests.collection.find());

/** Define a publication to publish this collection. */
// TODO either add functionality to projects and profiles or remove
// Meteor.publish(ProfilesProjects.userPublicationName, () => {
//   if (this.userId) {
//     const username = Meteor.users.findOne(this.userId).username;
//     return Profiles.collection.find({ email: username });
//   }
//   return this.ready();
// });
Meteor.publish(ProfilesProjects.userPublicationName, () => ProfilesProjects.collection.find());

/** Define a publication to publish all projects. */
Meteor.publish(Projects.userPublicationName, () => Projects.collection.find());

/** Define a publication to publish all plants */
Meteor.publish(Plants.userPublicationName, () => Plants.collection.find());
//
// /** Define a publication to publish this collection. */
// Meteor.publish(PlantsInterests.userPublicationName, () => PlantsInterests.collection.find());

/** Define a publication to publish all forums. */
Meteor.publish(Forums.userPublicationName, () => Forums.collection.find());

/** Define a publication to publish all comments. */
Meteor.publish(Comments.userPublicationName, () => Comments.collection.find());

/** Define a publication to publish this collection. */
Meteor.publish(ProjectsInterests.userPublicationName, () => ProjectsInterests.collection.find());
Meteor.publish(PlantsInterests.userPublicationName, () => PlantsInterests.collection.find());

// alanning:roles publication
// Recommended code to publish roles for each user.
Meteor.publish(null, function () {
  if (this.userId) {
    return Meteor.roleAssignment.find({ 'user._id': this.userId });
  }
  return this.ready();
});
