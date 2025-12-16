import { expect, test } from '../support/test-helpers';

test.describe('selection', () => {
  test.describe('cell selection', () => {
    const example = 'cell-selection';

    test(example, async ({ si, page }) => {
      await si.visitExample(example);
      const nameCell = page.getByRole('cell', { name: 'Ethel Price' });
      await expect(nameCell).toBeVisible();

      const nameCellParentEl = nameCell.locator('..').locator('..');

      await nameCell.click();

      await expect(nameCell).toHaveClass(/active/);
      await expect(nameCellParentEl).toHaveClass(/active/);

      await si.runVisualAndA11yTests('name-cell-selection');

      const companyCell = page.getByRole('cell', { name: 'Dogspa' });
      await expect(companyCell).toBeVisible();

      const companyCellParentEl = companyCell.locator('..').locator('..');

      await companyCell.click();

      await expect(companyCell).toHaveClass(/active/);
      await expect(companyCellParentEl).toHaveClass(/active/);

      await si.runVisualAndA11yTests('company-cell-selection');
    });
  });

  test.describe('single row selection', () => {
    const example = 'single-selection';

    test(example, async ({ si, page }) => {
      await si.visitExample(example);
      const selectedRow = page.getByRole('row', { name: 'Claudine Neal' });

      await selectedRow.click();

      await expect(selectedRow).toHaveClass(/active/);
      await expect(selectedRow.locator('datatable-body-cell')).toHaveCount(3);

      const selectedColumnLi = page.locator('.selected-column').locator('ul > li');

      await expect(selectedColumnLi).toHaveCount(1);

      await expect(selectedColumnLi.first()).toContainText('Claudine Neal');

      await si.runVisualAndA11yTests('row-selection-initial');
    });
  });

  test.describe('multi row selection', () => {
    const example = 'multi-selection';

    test(example + ' using Shift', async ({ si, page }) => {
      await si.visitExample(example);
      await page.getByRole('row', { name: 'Ethel Price' }).click();

      await page.getByRole('row', { name: 'Wilder Gonzales' }).click({
        modifiers: ['Shift']
      });

      const rows = page.locator('datatable-body-row.active');

      await expect(rows).toHaveCount(4);

      const names: string[] = [];
      for (const row of await rows.all()) {
        names.push(await row.locator('datatable-body-cell').first().innerText());
      }

      const selectedColumnLi = await page.locator('.selected-column').locator('ul > li').all();

      expect(selectedColumnLi.length).toBe(names.length);

      for (const li of selectedColumnLi) {
        const name = await li.innerText();
        const namePresentInSelectedRow = names.includes(name);
        expect(namePresentInSelectedRow).toBeTruthy();
      }

      await si.runVisualAndA11yTests('using-shift');
    });

    test(example + ' using Ctrl', async ({ si, page }) => {
      await si.visitExample(example);
      await page.getByRole('row', { name: 'Ethel Price' }).click();

      await page.getByRole('row', { name: 'Wilder Gonzales' }).click({
        modifiers: ['ControlOrMeta']
      });

      const selectedRows = page.locator('datatable-body-row.active');

      await expect(selectedRows).toHaveCount(2);

      const names: string[] = [];
      for (const row of await selectedRows.all()) {
        names.push(await row.locator('datatable-body-cell').first().innerText());
      }

      const selectedColumnLi = await page.locator('.selected-column').locator('ul > li').all();

      expect(selectedColumnLi.length).toBe(names.length);

      for (const li of selectedColumnLi) {
        const name = await li.innerText();
        const namePresentInSelectedRow = names.includes(name);
        expect(namePresentInSelectedRow).toBeTruthy();
      }

      await si.runVisualAndA11yTests('using-ctrl');
    });
  });

  test.describe('disable row selection', () => {
    const example = 'multidisable-selection';

    test(example, async ({ si, page }) => {
      await si.visitExample(example);

      const disabledRow = page.getByRole('row', { name: 'Ethel Price' });
      await disabledRow.click();

      const selectedRows = page.locator('datatable-body-row.active');
      await expect(selectedRows).toHaveCount(0);

      const selectedNamesLi = page.locator('.selected-column').locator('ul > li');
      await expect(selectedNamesLi).toHaveCount(1);
      await expect(selectedNamesLi.first()).toHaveText('No Selections');

      await page.getByRole('row', { name: 'Beryl Rice' }).click();

      await expect(selectedRows).toHaveCount(1);
      await expect(selectedNamesLi).toHaveCount(1);

      await disabledRow.click();

      await expect(selectedRows).toHaveCount(0);
      await expect(selectedNamesLi).toHaveCount(1);
      await expect(selectedNamesLi.first()).toHaveText('No Selections');

      await si.runVisualAndA11yTests('disable-row-selection');
    });
  });

  test.describe('checkbox selection', () => {
    const example = 'chkbox-selection';

    test(example, async ({ si, page }) => {
      await si.visitExample(example);

      const noCheckBoxRow = page.getByRole('row', { name: 'Ethel Price' });
      await expect(noCheckBoxRow).toBeVisible();

      const noCheckbox = noCheckBoxRow.locator('input[type=checkbox]');
      await expect(noCheckbox).not.toBeVisible();

      const rowsWithCheckbox = await page.locator('datatable-body-row input[type=checkbox]').all();

      expect(rowsWithCheckbox).toHaveLength(4);

      for (const row of rowsWithCheckbox) {
        await row.check();
      }

      const selectedNamesLi = page.locator('.selected-column').locator('ul > li');
      await expect(selectedNamesLi).toHaveCount(4);

      await si.runVisualAndA11yTests({
        step: 'checkbox-selection-all-checked',
        axeRulesSet: [
          {
            id: 'label',
            enabled: false
          },
          {
            id: 'empty-table-header',
            enabled: false
          }
        ]
      });

      await rowsWithCheckbox[0].uncheck();
      await rowsWithCheckbox[1].uncheck();

      await expect(selectedNamesLi).toHaveCount(2);

      await si.runVisualAndA11yTests({
        step: 'checkbox-selection-uncheck',
        axeRulesSet: [
          {
            id: 'label',
            enabled: false
          },
          {
            id: 'empty-table-header',
            enabled: false
          }
        ]
      });
    });
  });

  test.describe('multi click row selection', () => {
    const example = 'multi-click-selection';

    test(example, async ({ si, page }) => {
      await si.visitExample(example);

      await page.getByRole('row', { name: 'Claudine Neal' }).click();
      await page.getByRole('row', { name: 'Beryl Rice' }).click();
      await page.getByRole('row', { name: 'Wilder Gonzales' }).click();

      const selectedRows = page.locator('datatable-body-row.active');
      await expect(selectedRows).toHaveCount(3);

      const selectedNamesLi = page.locator('.selected-column').locator('ul > li');
      await expect(selectedNamesLi).toHaveCount(3);

      await page.getByRole('row', { name: 'Beryl Rice' }).click();

      await expect(selectedRows).toHaveCount(2);
      await expect(selectedNamesLi).toHaveCount(2);

      await page.getByRole('row', { name: 'Claudine Neal' }).click();

      await expect(selectedRows).toHaveCount(1);
      await expect(selectedNamesLi).toHaveCount(1);

      await si.runVisualAndA11yTests('click-selection');
    });
  });

  test.describe('multi click with checkbox selection', () => {
    const example = 'multi-click-chkbox-selection';

    test(example + ' using keyboard', async ({ si, page }) => {
      await si.visitExample(example);

      const firstRow = page.getByRole('row', { name: 'Ethel Price' });
      await firstRow.focus();

      await firstRow.locator('input[type=checkbox]').check();

      // Move to 2nd row.
      await page.keyboard.press('Tab');
      await page.keyboard.press('Space');

      // Move to 4th row as 3rd row is disabled.
      await page.keyboard.press('Tab');
      await page.keyboard.press('Space');

      const selectedRows = page.locator('datatable-body-row.active');
      await expect(selectedRows).toHaveCount(3);

      const disabledElement = page.getByRole('row', { name: 'Beryl Rice' });

      await expect(disabledElement).not.toHaveClass(/active/);

      const selectedNamesLi = page.locator('.selected-column').locator('ul > li');
      await expect(selectedNamesLi).toHaveCount(3);

      await si.runVisualAndA11yTests({
        step: 'navigation-using-tab-and-space',
        axeRulesSet: [
          {
            id: 'label',
            enabled: false
          },
          {
            id: 'empty-table-header',
            enabled: false
          }
        ]
      });

      await page.keyboard.press('Shift+Tab');
      await page.keyboard.press('Space');

      await expect(selectedRows).toHaveCount(2);

      await expect(selectedNamesLi).toHaveCount(2);

      await si.runVisualAndA11yTests({
        step: 'backward-navigation-shift+tab+space',
        axeRulesSet: [
          {
            id: 'label',
            enabled: false
          },
          {
            id: 'empty-table-header',
            enabled: false
          }
        ]
      });
    });
  });
});
