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

      await si.runVisualAndA11yTests('no-summary-row');

      enableSummaryRow.click();
      await expect(summaryRow).toHaveCount(1);

      await si.runVisualAndA11yTests('show-summary-row');

      const scrollerElement = await page.locator('datatable-scroller').boundingBox();
      let summaryElementBox = await summaryRow.boundingBox();

      expect(scrollerElement.y).toBe(summaryElementBox.y);

      await si.runVisualAndA11yTests('summary-row-at-top');

      await page.getByLabel('Position').selectOption('bottom');

      summaryElementBox = await summaryRow.boundingBox();
      const lastElement = await page.locator('datatable-row-wrapper').last().boundingBox();

      expect(summaryElementBox.y).toBe(lastElement.y + lastElement.height);

      await si.runVisualAndA11yTests('summary-row-at-bottom');

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

      await si.runVisualAndA11yTests('custom-template-default');
    });
  });

  test.describe('server side template summary', () => {
    const example = 'server-side-paging-summary';

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

      await si.runVisualAndA11yTests('custom-template');
    });
  });

  test.describe('inline html template summary', () => {
    const example = 'inline-html-summary';

    test(example, async ({ si, page }) => {
      await si.visitExample(example);

      const summaryRow = page.locator('datatable-summary-row');
      await expect(summaryRow).toHaveCount(1);

      await testSummaryRowData(page);

      const nameColumn = summaryRow.locator('datatable-body-cell').first().locator('span');
      await expect(nameColumn).toHaveText('5 total');

      await si.runVisualAndA11yTests('custom-template-total-count');
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
