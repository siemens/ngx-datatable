import { expect, test } from '../support/test-helpers';

test.describe('drag drop using angular cdk', () => {
  const example = 'drag-drop';
  test(example, async ({ si, page }) => {
    await si.visitExample(example);

    const loadingIndicator = page.locator('datatable-progress').locator('div[class="bar"]');
    await expect(loadingIndicator).toHaveCount(0);

    const originRow = page.getByRole('row', { name: 'Ethel Price' });
    const destinationRow = page.getByRole('row', { name: 'Georgina Schultz' });

    const originBoundingBox = await originRow.boundingBox();
    const destinationBoundingBox = await destinationRow.boundingBox();

    await expect(
      page.locator('datatable-row-wrapper').nth(0).locator('span[title="Ethel Price"]')
    ).toHaveCount(1);

    await expect(
      page.locator('datatable-row-wrapper').nth(4).locator('span[title="Georgina Schultz"]')
    ).toHaveCount(1);

    await originRow.click();

    await page.mouse.move(
      originBoundingBox.x + originBoundingBox.width / 2,
      originBoundingBox.y + originBoundingBox.height / 2
    );

    await page.mouse.down();

    await page.mouse.move(
      destinationBoundingBox.x + destinationBoundingBox.width / 2,
      destinationBoundingBox.y + destinationBoundingBox.height / 2,
      {
        steps: 20
      }
    );

    await page.mouse.up();

    await expect(
      page.locator('datatable-row-wrapper').nth(0).locator('span[title="Claudine Neal"]')
    ).toHaveCount(1);

    await expect(
      page.locator('datatable-row-wrapper').nth(3).locator('span[title="Georgina Schultz"]')
    ).toHaveCount(1);

    await expect(
      page.locator('datatable-row-wrapper').nth(4).locator('span[title="Ethel Price"]')
    ).toHaveCount(1);

    await si.runVisualAndA11yTests('switch-rows');
  });
});
