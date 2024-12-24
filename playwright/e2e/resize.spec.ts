import { expect, test } from '../support/test-helpers';

test.describe('resize and pinning', () => {
  const example = 'pinning';
  test(example + ' resize column', async ({ si, page }) => {
    await si.visitExample(example);

    const nameColumn = page.getByRole('columnheader', { name: 'Name' });
    const genderColumn = page.getByRole('columnheader', { name: 'Gender' });
    const cityColumn = page.getByRole('columnheader', { name: 'City' });
    const stateColumn = page.getByRole('columnheader', { name: 'State' });

    const originalWidth = await nameColumn.boundingBox();

    await expect(nameColumn).toHaveAttribute('resizeable');
    await expect(genderColumn).toHaveAttribute('resizeable');
    await expect(cityColumn).toHaveAttribute('resizeable');
    await expect(stateColumn).toHaveAttribute('resizeable');

    await si.runVisualAndA11yTests('check-resize-attribute');

    // Resize name column
    const resizeHandler = nameColumn.locator('span[class="resize-handle"]');
    const originBoundingBox = await resizeHandler.boundingBox();
    const increaseWidthBy = 300;

    await page.mouse.click(originBoundingBox.x, originBoundingBox.y);
    await page.mouse.down();
    await page.mouse.click(originBoundingBox.x + increaseWidthBy, originBoundingBox.y);
    await page.mouse.up();

    const updatedWidth = await nameColumn.boundingBox();

    expect(updatedWidth.width).toBe(originalWidth.width + increaseWidthBy);

    await si.runVisualAndA11yTests('resize-name-column');
  });

  test(example + ' pinning column', async ({ si, page }) => {
    await si.visitExample(example);

    const nameColumn = page.getByRole('columnheader', { name: 'Name' });
    const genderColumn = page.getByRole('columnheader', { name: 'Gender' });
    const stateColumn = page.getByRole('columnheader', { name: 'State' });

    const boundingBox = await page.locator('datatable-body').boundingBox();

    await page.mouse.click(boundingBox.x, boundingBox.height - 2);
    await page.mouse.down();

    await page.mouse.move(boundingBox.x + 1000, boundingBox.height - 2, { steps: 20 });

    await page.mouse.up();

    await expect(nameColumn.locator('..')).toHaveCSS('z-index', '9');
    await expect(nameColumn.locator('..')).toHaveCSS('position', 'sticky');

    await expect(stateColumn.locator('..')).toHaveCSS('z-index', '9');
    await expect(stateColumn.locator('..')).toHaveCSS('position', 'sticky');

    await expect(genderColumn.locator('..')).not.toHaveCSS('z-index', '9');
    await expect(genderColumn.locator('..')).not.toHaveCSS('position', 'sticky');

    await si.runVisualAndA11yTests('pinning-name-and-state-column');
  });
});
