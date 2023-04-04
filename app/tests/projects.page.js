import { Selector } from 'testcafe';
import { PageIDs } from '../imports/ui/utilities/ids';

class ProjectsPage {
  constructor() {
    this.pageId = `#${PageIDs.projectsPage}`;
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  /** Checks that the current page has at least nine interests on it.  */
  async hasDefaultProjects(testController) {
    const cardCount = Selector('.card').count;
    await testController.expect(cardCount).gte(4);
  }
}

export const projectsPage = new ProjectsPage();
