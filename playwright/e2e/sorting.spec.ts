import { expect, test } from '../support/test-helpers';

test.describe('sorting', () => {
  test.describe('client side sorting', () => {
    const example = 'client-sorting';
    test(example, async ({ si, page }) => {
      await si.visitExample(example);

      const companyHeader = page.locator('datatable-header-cell[title="Company"]');
      const companyHeaderIcon = companyHeader.locator('span').nth(2);
      const firstRow = page.locator('datatable-body-row').first();

      await si.runVisualAndA11yTests('default-sorting');

      await companyHeaderIcon.click();

      await expect(companyHeader).toHaveClass(/sort-active/);
      await expect(companyHeader).toHaveClass(/sort-asc/);

      expect(firstRow.getByRole('cell', { name: 'Accidency' })).toBeTruthy();

      await si.runVisualAndA11yTests('sorting-asc');

      await companyHeaderIcon.click();

      await expect(companyHeader).toHaveClass(/sort-active/);
      await expect(companyHeader).toHaveClass(/sort-desc/);

      expect(firstRow.getByRole('cell', { name: 'Zolar' })).toBeTruthy();

      await si.runVisualAndA11yTests('sorting-desc');

      await companyHeaderIcon.click();

      await expect(companyHeader).not.toHaveClass(/sort-active/);
      await expect(companyHeader).not.toHaveClass(/sort-asc/);
      await expect(companyHeader).not.toHaveClass(/sort-desc/);
      expect(
        firstRow.getByRole('cell', { name: 'Johnson, Johnson and Partners, LLC CMP DDC' })
      ).toBeTruthy();

      await si.runVisualAndA11yTests('sorting-unset');
    });
  });

  test.describe('default sorting', () => {
    const example = 'default-sorting';
    test(example, async ({ si, page }) => {
      await si.visitExample(example);

      const nameHeader = page.locator('datatable-header-cell[title="Name"]');
      const nameHeaderIcon = nameHeader.locator('span').nth(2);
      const firstRow = page.locator('datatable-body-row').first();

      await expect(nameHeader).toHaveClass(/sort-active/);
      await expect(nameHeader).toHaveClass(/sort-desc/);

      expect(firstRow.getByRole('cell', { name: 'Yvonne Parsons' })).toBeTruthy();

      await si.runVisualAndA11yTests('default-name-sorting-desc');

      await nameHeaderIcon.click();

      await expect(nameHeader).toHaveClass(/sort-active/);
      await expect(nameHeader).toHaveClass(/sort-asc/);

      expect(firstRow.getByRole('cell', { name: 'Alexander Foley' })).toBeTruthy();

      await si.runVisualAndA11yTests('sort-name-by-asc');

      await nameHeaderIcon.click();

      await expect(nameHeader).not.toHaveClass(/sort-active/);
      await expect(nameHeader).not.toHaveClass(/sort-asc/);
      await expect(nameHeader).not.toHaveClass(/sort-desc/);

      expect(firstRow.getByRole('cell', { name: 'Ethel Price' })).toBeTruthy();

      await si.runVisualAndA11yTests('unset-name-sort');
    });
  });

  test.describe('server side sorting', () => {
    const example = 'server-sorting';
    test(example, async ({ si, page }) => {
      await si.visitExample(example);

      const companyHeader = page.locator('datatable-header-cell[title="Company"]');
      const companyHeaderIcon = companyHeader.locator('span').nth(2);
      const firstRow = page.locator('datatable-body-row').first();
      const loadingIndicator = page.locator('datatable-progress').locator('div[class="bar"]');

      await companyHeaderIcon.click();

      await expect(companyHeader).toHaveClass(/sort-active/);
      await expect(companyHeader).toHaveClass(/sort-asc/);
      await expect(loadingIndicator).toBeVisible();

      await expect(loadingIndicator).toHaveCount(0);

      expect(firstRow.getByRole('cell', { name: 'Aquamate' })).toBeTruthy();

      await si.runVisualAndA11yTests('sorting-asc');

      await companyHeaderIcon.click();

      await expect(companyHeader).toHaveClass(/sort-active/);
      await expect(companyHeader).toHaveClass(/sort-desc/);

      await expect(loadingIndicator).toBeVisible();

      await expect(loadingIndicator).toHaveCount(0);

      expect(firstRow.getByRole('cell', { name: 'Xyqag' })).toBeTruthy();

      await si.runVisualAndA11yTests('sorting-desc');

      await companyHeaderIcon.click();

      await expect(loadingIndicator).toHaveCount(0);

      await expect(companyHeader).toHaveClass(/sort-active/);
      await expect(companyHeader).toHaveClass(/sort-asc/);

      await si.runVisualAndA11yTests('sorting-asc-again', [
        {
          id: 'aria-progressbar-name',
          enabled: false
        },
        {
          id: 'aria-required-children',
          enabled: false
        }
      ]);
    });
  });

  test.describe('custom sorting comparator', () => {
    const example = 'comparator-sorting';
    test(example, async ({ si, page }) => {
      await si.visitExample(example);

      const companyHeader = page.locator('datatable-header-cell[title="Company"]');
      const companyHeaderIcon = companyHeader.locator('span').nth(2);
      const firstRow = page.locator('datatable-body-row').first();

      await companyHeaderIcon.click();

      await expect(companyHeader).toHaveClass(/sort-active/);
      await expect(companyHeader).toHaveClass(/sort-asc/);

      expect(firstRow.getByRole('cell', { name: 'Aquamate' })).toBeTruthy();

      await si.runVisualAndA11yTests('comparator-sorting-asc');

      await companyHeaderIcon.click();

      await expect(companyHeader).toHaveClass(/sort-active/);
      await expect(companyHeader).toHaveClass(/sort-desc/);

      expect(firstRow.getByRole('cell', { name: 'Xyqag' })).toBeTruthy();

      await si.runVisualAndA11yTests('comparator-sorting-desc');

      await companyHeaderIcon.click();

      await expect(companyHeader).toHaveClass(/sort-active/);
      await expect(companyHeader).toHaveClass(/sort-asc/);

      await si.runVisualAndA11yTests('comparator-sorting-asc-again');
    });
  });
});
