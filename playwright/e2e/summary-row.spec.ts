import { expect, test } from '../support/test-helpers';

test.describe('summary-row', () => {
  const example = 'summary-row-actions';

  test('summary row actions are hidden when no rows are selected', async ({ si, page }) => {
    await si.visitExample(example);

    const summaryRow = page.locator('datatable-summary-row.sticky');
    await expect(summaryRow).toHaveCount(0);
  });

  test('summary row appears on checkbox selection', async ({ si, page }) => {
    await si.visitExample(example);

    const checkbox = page.locator('datatable-body-row input[type=checkbox]').first();
    await checkbox.check();

    const summaryRow = page.locator('datatable-summary-row.sticky');
    await expect(summaryRow).toBeVisible();
    await expect(page.locator('.summary-row-actions-count')).toContainText('1 row(s) selected');

    await si.runVisualAndA11yTests({
      step: 'summary-row-actions',
      axeRulesSet: [
        { id: 'label', enabled: false },
        { id: 'empty-table-header', enabled: false }
      ]
    });
  });
});
