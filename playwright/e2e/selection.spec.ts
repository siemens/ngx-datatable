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

      const cellsInRow = await selectedRow.locator('datatable-body-cell').all();

      await expect(selectedRow).toHaveClass(/active/);
      expect(cellsInRow).toHaveLength(3);

      await expect(cellsInRow.at(0)).toHaveClass(/active/);

      for (const cell of cellsInRow) {
        await expect(cell).toHaveAttribute('ng-reflect-is-selected', 'true');
      }

      const selectedColumnLi = await page.locator('.selected-column').locator('ul > li').all();

      expect(selectedColumnLi).toHaveLength(1);

      await expect(selectedColumnLi[0]).toContainText('Claudine Neal');

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

      const rows = await page.locator('datatable-body-row.active').all();

      expect(rows).toHaveLength(4);

      const names = [];
      rows.map(async row => {
        names.push(await row.locator('datatable-body-cell').first().innerText());
      });

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

      const selectedRows = await page.locator('datatable-body-row.active').all();

      expect(selectedRows).toHaveLength(2);

      const names = [];
      selectedRows.map(async row => {
        names.push(await row.locator('datatable-body-cell').first().innerText());
      });

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

      let selectedRows = await page.locator('datatable-body-row.active').all();
      expect(selectedRows).toHaveLength(0);

      let selectedNamesLi = await page.locator('.selected-column').locator('ul > li').all();
      expect(selectedNamesLi).toHaveLength(1);
      expect(await selectedNamesLi.at(0).innerText()).toBe('No Selections');

      await page.getByRole('row', { name: 'Beryl Rice' }).click();

      selectedRows = await page.locator('datatable-body-row.active').all();
      selectedNamesLi = await page.locator('.selected-column').locator('ul > li').all();

      expect(selectedRows).toHaveLength(1);
      expect(selectedNamesLi).toHaveLength(1);

      await disabledRow.click();

      selectedRows = await page.locator('datatable-body-row.active').all();
      selectedNamesLi = await page.locator('.selected-column').locator('ul > li').all();

      expect(selectedRows).toHaveLength(0);
      expect(selectedNamesLi).toHaveLength(1);
      expect(await selectedNamesLi.at(0).innerText()).toBe('No Selections');

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

      for (let row of rowsWithCheckbox) {
        await row.check();
      }

      let selectedNamesLi = await page.locator('.selected-column').locator('ul > li').all();
      expect(selectedNamesLi).toHaveLength(4);

      await si.runVisualAndA11yTests('checkbox-selection-all-checked', [
        {
          id: 'label',
          enabled: false
        },
        {
          id: 'empty-table-header',
          enabled: false
        }
      ]);

      await rowsWithCheckbox[0].uncheck();
      await rowsWithCheckbox[1].uncheck();

      selectedNamesLi = await page.locator('.selected-column').locator('ul > li').all();
      expect(selectedNamesLi).toHaveLength(2);

      await si.runVisualAndA11yTests('checkbox-selection-uncheck', [
        {
          id: 'label',
          enabled: false
        },
        {
          id: 'empty-table-header',
          enabled: false
        }
      ]);
    });
  });

  test.describe('multi click row selection', () => {
    const example = 'multi-click-selection';

    test(example, async ({ si, page }) => {
      await si.visitExample(example);

      await page.getByRole('row', { name: 'Claudine Neal' }).click();
      await page.getByRole('row', { name: 'Beryl Rice' }).click();
      await page.getByRole('row', { name: 'Wilder Gonzales' }).click();

      let selectedRows = await page.locator('datatable-body-row.active').all();
      expect(selectedRows).toHaveLength(3);

      let selectedNamesLi = await page.locator('.selected-column').locator('ul > li').all();
      expect(selectedNamesLi).toHaveLength(3);

      await page.getByRole('row', { name: 'Beryl Rice' }).click();

      selectedRows = await page.locator('datatable-body-row.active').all();
      selectedNamesLi = await page.locator('.selected-column').locator('ul > li').all();

      expect(selectedRows).toHaveLength(2);
      expect(selectedNamesLi).toHaveLength(2);

      await page.getByRole('row', { name: 'Claudine Neal' }).click();

      selectedRows = await page.locator('datatable-body-row.active').all();
      selectedNamesLi = await page.locator('.selected-column').locator('ul > li').all();

      expect(selectedRows).toHaveLength(1);
      expect(selectedNamesLi).toHaveLength(1);

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

      let selectedRows = await page.locator('datatable-body-row.active').all();
      expect(selectedRows).toHaveLength(3);

      const disabledElement = page.getByRole('row', { name: 'Beryl Rice' });

      await expect(disabledElement).not.toHaveClass(/active/);

      let selectedNamesLi = await page.locator('.selected-column').locator('ul > li').all();
      expect(selectedNamesLi).toHaveLength(3);

      await si.runVisualAndA11yTests('navigation-using-tab-and-space', [
        {
          id: 'label',
          enabled: false
        },
        {
          id: 'empty-table-header',
          enabled: false
        }
      ]);

      await page.keyboard.press('Shift+Tab');
      await page.keyboard.press('Space');

      selectedRows = await page.locator('datatable-body-row.active').all();
      expect(selectedRows).toHaveLength(2);

      selectedNamesLi = await page.locator('.selected-column').locator('ul > li').all();
      expect(selectedNamesLi).toHaveLength(2);

      await si.runVisualAndA11yTests('backward-navigation-shift+tab+space', [
        {
          id: 'label',
          enabled: false
        },
        {
          id: 'empty-table-header',
          enabled: false
        }
      ]);
    });
  });
});
