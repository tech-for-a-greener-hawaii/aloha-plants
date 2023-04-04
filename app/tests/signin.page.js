import { Selector } from 'testcafe';
import { navBar } from './navbar.component';
import { ComponentIDs, PageIDs } from '../imports/ui/utilities/ids';

class SignInPage {
  constructor() {
    this.pageId = `#${PageIDs.signInPage}`;
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  /** Fills out and submits the form to signin, then checks to see that login was successful. */
  async signin(testController, username, password) {
    await this.isDisplayed(testController);
    await testController.typeText(`#${ComponentIDs.signInFormEmail}`, username);
    await testController.typeText(`#${ComponentIDs.signInFormPassword}`, password);
    await testController.click(`#${ComponentIDs.signInFormSubmit} input.btn.btn-primary`);
    await navBar.isLoggedIn(testController, username);
  }
}

export const signInPage = new SignInPage();
