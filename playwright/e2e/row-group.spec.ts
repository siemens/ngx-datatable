import { expect, test } from '../support/test-helpers';

test.describe('row grouping', () => {
  const example = 'row-grouping';

  test(example, async ({ si, page }) => {
    await si.visitExample(example);

    await expect(page.getByText('Ethel Price')).toBeVisible();
    await si.runVisualAndA11yTests('default', [
      // interactive elements< (<a/>, <input/> etc) within table cells are failing
      {
        id: 'aria-required-children',
        enabled: false
      }
    ]);

    const groupCheckbox = page.locator('.datatable-group-cell .datatable-checkbox input').first();
    groupCheckbox.check();

    await expect(page.getByText('4 selected')).toBeVisible();

    await si.runVisualAndA11yTests('group-selected', [
      {
        id: 'aria-required-children',
        enabled: false
      }
    ]);
  });

  test(example + ' expand/collapse', async ({ si, page }) => {
    await si.visitExample(example);

    await expect(page.getByText('Ethel Price')).toBeVisible();
    const groupHeader = page.getByTitle('Expand/Collapse Group').first();
    groupHeader.click();
    await expect(page.getByText('Ethel Price')).not.toBeVisible();
    await si.runVisualAndA11yTests('group-collapsed', [
      {
        id: 'aria-required-children',
        enabled: false
      }
    ]);
    groupHeader.click();
    await expect(page.getByText('Ethel Price')).toBeVisible();
    await si.runVisualAndA11yTests('group-expanded', [
      {
        id: 'aria-required-children',
        enabled: false
      }
    ]);
  });
});
