import { expect, test } from '../support/test-helpers';

test.describe('empty template', () => {
  test('empty-template', async ({ si, page }) => {
    await si.visitExample('empty-template');

    await expect(page.getByText('My custom empty component')).toBeVisible();
    await expect(page.getByText('uses two lines.')).toBeVisible();

    await si.runVisualAndA11yTests({ ariaSnapshot: true });
  });
});
