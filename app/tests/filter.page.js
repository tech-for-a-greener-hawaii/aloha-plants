import { Selector } from 'testcafe';
import { ComponentIDs, PageIDs } from '../imports/ui/utilities/ids';

class FilterPage {
  constructor() {
    this.pageId = `#${PageIDs.filterPage}`;
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  /** Checks this page is displayed, then checks that filtering works. */
  async filter(testController) {
    await this.isDisplayed(testController);
    // Select visualization and submit
    const interestsSelector = Selector(`#${ComponentIDs.filterFormInterests} div.form-check input`);
    console.log(await interestsSelector.count);
    await testController.click(interestsSelector.nth(6));
    await testController.click(`#${ComponentIDs.filterFormSubmit} input.btn.btn-primary`);
    // Check that only one card is displayed.
    const cardCount = Selector('.card').count;
    await testController.expect(cardCount).eql(2);
  }
}

export const filterPage = new FilterPage();
