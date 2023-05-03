import { Selector } from 'testcafe';
import { ComponentIDs, PageIDs } from '../imports/ui/utilities/ids';

class ForumsPage {
  constructor() {
    this.pageId = `#${PageIDs.forumsPage}`;
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  async gotoAddForum(testController) {
    await testController.click(`#${ComponentIDs.addForumLink}`);
  }
}

export const forumsPage = new ForumsPage();
