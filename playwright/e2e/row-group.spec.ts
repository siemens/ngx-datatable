import { expect, test } from '../support/test-helpers';

test.describe('row grouping', () => {
  const example = 'row-grouping';

  test(example, async ({ si, page }) => {
    await si.visitExample(example);

    await expect(page.getByText('Ethel Price')).toBeVisible();
    await si.runVisualAndA11yTests('default');

    const groupCheckbox = page.locator('.datatable-group-cell .datatable-checkbox input').first();
    await groupCheckbox.check();

    await expect(page.getByText('4 selected')).toBeVisible();

    await si.runVisualAndA11yTests({ step: 'group-selected', ariaSnapshot: true });
  });

  test(example + ' expand/collapse', async ({ si, page }) => {
    await si.visitExample(example);

    await expect(page.getByText('Ethel Price')).toBeVisible();
    const groupHeader = page.getByTitle('Expand/Collapse Group').first();
    await groupHeader.click();
    await expect(page.getByText('Ethel Price')).not.toBeVisible();
    await si.runVisualAndA11yTests('group-collapsed');
    await groupHeader.click();
    await expect(page.getByText('Ethel Price')).toBeVisible();
    await si.runVisualAndA11yTests('group-expanded');
  });
});
