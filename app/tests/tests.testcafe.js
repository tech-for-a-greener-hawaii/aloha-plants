/* global fixture:false, test:false */
import { landingPage } from './landing.page';
import { signInPage } from './signin.page';
import { signOutPage } from './signout.page';
import { signupPage } from './signup.page';
import { profilesPage } from './profiles.page';
import { projectsPage } from './projects.page';
import { interestsPage } from './interests.page';
import { homePage } from './home.page';
import { addProjectPage } from './addproject.page';
import { filterPage } from './filter.page';
import { navBar } from './navbar.component';
import { forumsPage} from './forums.page';
import { addPlantPage} from './addplant.page';
import { plantsPage} from './plants.page';
import { editProjectPage } from './editproject.page';

/** Credentials for one of the sample users defined in settings.development.json. */
const credentials = { username: 'admin@foo.com', password: 'foo', firstName: 'Philip', lastName: 'Johnson' };

fixture('Aloha PLants localhost test with default db')
  .page('http://localhost:3000');

test('Test that landing page shows up', async (testController) => {
  await landingPage.isDisplayed(testController);
});

test('Test that signin and signout work', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signInPage.signin(testController, credentials.username, credentials.password);
  await navBar.logout(testController);
  await signOutPage.isDisplayed(testController);
});

test('Test that signup page, then logout works', async (testController) => {
  // Create a new user email address that's guaranteed to be unique.
  const newUser = `user-${new Date().getTime()}@foo.com`;
  await navBar.gotoSignUpPage(testController);
  await signupPage.isDisplayed(testController);
  await signupPage.signupUser(testController, newUser, credentials.password);
  // New user has successfully logged in, so now let's logout.
  await navBar.logout(testController);
  await signOutPage.isDisplayed(testController);
});
test('Test that projects page displays', async (testController) => {
  await navBar.gotoProjectsPage(testController);
  await projectsPage.isDisplayed(testController);
});


test('Test that addProject page works', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signInPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoAddProjectPage(testController);
  await addProjectPage.isDisplayed(testController);
  await navBar.ensureLogout(testController);
});
test('Test that projects page displays', async (testController) => {
  await navBar.gotoProjectsPage(testController);
  await projectsPage.isDisplayed(testController);
});

test('Test that plants page displays', async (testController) => {
  await navBar.gotoPlantsPage(testController);
  await plantsPage.isDisplayed(testController);
});
test('Test that forums page displays', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSignInPage(testController);
  await signInPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoForumsPage(testController);
  await forumsPage.isDisplayed(testController);
});

test('Test that addplant page displays', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSignInPage(testController);
  await signInPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoAddPlantPage(testController);
  await addPlantPage.isDisplayed(testController);
});
