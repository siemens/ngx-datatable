import { Page } from '@playwright/test';
import { expect, test } from '../support/test-helpers';

test.describe('summary row', () => {
  test.describe('simple summary row', () => {
    const example = 'simple-summary';

    test(example, async ({ si, page }) => {
      await si.visitExample(example);

      const summaryRow = page.locator('datatable-summary-row');
      await expect(summaryRow).toHaveCount(1);

      const enableSummaryRow = page.locator('#enable-summary');

      await enableSummaryRow.click();
      await expect(summaryRow).toHaveCount(0);

      await si.runVisualAndA11yTests('no-summary-row', [
        {
          id: 'aria-required-children',
          enabled: false
        }
      ]);

      enableSummaryRow.click();
      await expect(summaryRow).toHaveCount(1);

      await si.runVisualAndA11yTests('show-summary-row', [
        {
          id: 'aria-required-children',
          enabled: false
        },
        {
          id: 'aria-required-parent',
          enabled: false
        }
      ]);

      const scrollerElement = await page.locator('datatable-scroller').boundingBox();
      let summaryElementBox = await summaryRow.boundingBox();

      expect(scrollerElement.y).toBe(summaryElementBox.y);

      await si.runVisualAndA11yTests('summary-row-at-top', [
        {
          id: 'aria-required-children',
          enabled: false
        },
        {
          id: 'aria-required-parent',
          enabled: false
        }
      ]);

      await page.getByLabel('Position').selectOption('bottom');

      summaryElementBox = await summaryRow.boundingBox();
      const lastElement = await page.locator('datatable-row-wrapper').last().boundingBox();

      expect(summaryElementBox.y).toBe(lastElement.y + lastElement.height);

      await si.runVisualAndA11yTests('summary-row-at-bottom', [
        {
          id: 'aria-required-children',
          enabled: false
        }
      ]);

      await testSummaryRowData(page);
    });
  });

  test.describe('custom template summary', () => {
    const example = 'custom-template-summary';

    test(example, async ({ si, page }) => {
      await si.visitExample(example);

      const summaryRow = page.locator('datatable-summary-row');
      await expect(summaryRow).toHaveCount(1);

      await testSummaryRowData(page);

      await si.runVisualAndA11yTests('custom-template-default', [
        {
          id: 'aria-required-children',
          enabled: false
        },
        {
          id: 'aria-required-parent',
          enabled: false
        }
      ]);
    });
  });

  test.describe('server side template summary', () => {
    const example = 'paging-summary';

    test(example, async ({ si, page }) => {
      await si.visitExample(example);

      test.slow();

      await page.waitForSelector('datatable-row-wrapper');
      await expect(page.locator('.empty-row')).toBeHidden();

      const summaryRow = page.locator('datatable-summary-row');

      const femaleCells = await page
        .locator('datatable-body-cell')
        .locator('span[title="female"]')
        .all();

      const maleCells = await page
        .locator('datatable-body-cell')
        .locator('span[title="male"]')
        .all();

      const genderColumn = summaryRow.locator('datatable-body-cell').nth(1).locator('span');
      const nameColumn = summaryRow.locator('datatable-body-cell').first().locator('span');

      await expect(genderColumn).toContainText(`${femaleCells.length} females`);
      await expect(genderColumn).toContainText(`${maleCells.length} males`);
      await expect(nameColumn).toContainText(`${maleCells.length + femaleCells.length} total`);

      await si.runVisualAndA11yTests('custom-template', [
        {
          id: 'aria-required-children',
          enabled: false
        },
        {
          id: 'aria-required-parent',
          enabled: false
        }
      ]);
    });
  });

  test.describe('inline html template summary', () => {
    const example = 'inline-html-summary';

    test(example, async ({ si, page }) => {
      await si.visitExample(example);

      const summaryRow = page.locator('datatable-summary-row');
      await expect(summaryRow).toHaveCount(1);

      await testSummaryRowData(page);

      const rows = await page.locator('datatable-row-wrapper').locator('datatable-body-row').all();

      const nameColumn = summaryRow.locator('datatable-body-cell').first().locator('span');

      expect(rows).toHaveLength(5);

      const names: string[] = [];

      for (const row of rows) {
        const fullName = await row.locator('datatable-body-cell').first().innerText();
        names.push(fullName.split(' ')[1]);
      }

      expect(names).toHaveLength(rows.length);

      for (let name of names) {
        await expect(nameColumn.getByText(name, { exact: true })).toHaveCount(1);
      }

      await si.runVisualAndA11yTests('custom-template-lastname-only', [
        {
          id: 'aria-required-children',
          enabled: false
        },
        {
          id: 'aria-required-parent',
          enabled: false
        },
        {
          id: 'scrollable-region-focusable',
          enabled: false
        }
      ]);
    });
  });
});

const testSummaryRowData = async (page: Page) => {
  const summaryRow = page.locator('datatable-summary-row');

  const femaleCells = await page
    .locator('datatable-body-cell')
    .locator('span[title="female"]')
    .all();

  const maleCells = await page.locator('datatable-body-cell').locator('span[title="male"]').all();

  const genderColumn = summaryRow.locator('datatable-body-cell').nth(1).locator('span');

  await expect(genderColumn).toContainText(`females: ${femaleCells.length}`);
  await expect(genderColumn).toContainText(`males: ${maleCells.length}`);
};
