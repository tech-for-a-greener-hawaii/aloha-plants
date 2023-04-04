import { Selector } from 'testcafe';
import { navBar } from './navbar.component';
import { ComponentIDs, PageIDs } from '../imports/ui/utilities/ids';

class SignupPage {
  constructor() {
    this.pageId = `#${PageIDs.signUpPage}`;
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  /** Signs up a new user, then checks to see that they are logged in by checking the navbar. */
  async signupUser(testController, username, password) {
    await this.isDisplayed(testController);
    await testController.typeText(`#${ComponentIDs.signUpFormEmail}`, username);
    await testController.typeText(`#${ComponentIDs.signUpFormPassword}`, password);
    await testController.click(`#${ComponentIDs.signUpFormSubmit} input.btn.btn-primary`);
    await navBar.isLoggedIn(testController, username);
  }
}

export const signupPage = new SignupPage();
