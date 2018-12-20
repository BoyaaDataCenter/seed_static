import { BudStaticUpdatePage } from './app.po';

describe('bud-static-update App', () => {
  let page: BudStaticUpdatePage;

  beforeEach(() => {
    page = new BudStaticUpdatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
