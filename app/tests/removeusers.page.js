import { Selector } from 'testcafe';
import { PageIDs } from '../imports/ui/utilities/ids';

class RemoveUsersPage {
  constructor() {
    this.pageId = `#${PageIDs.removeUsersPage}`;
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }
}

export const removeUsersPage = new RemoveUsersPage();
