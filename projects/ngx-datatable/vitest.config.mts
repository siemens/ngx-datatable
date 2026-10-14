import type { SerializedLocator } from '@vitest/browser';
import { defineBrowserCommand } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    browser: {
      commands: {
        longPressDrag: defineBrowserCommand(
          // Vitest serializes browser-side Locators to objects containing their selectors.
          async (
            { page, iframe },
            sourceLocator: SerializedLocator,
            targetLocator: SerializedLocator
          ) => {
            const source = iframe.locator(sourceLocator.selector);
            const target = iframe.locator(targetLocator.selector);
            // Start on the reorder handle, not empty space in the header cell.
            // Read both positions before the dragged header is translated.
            const sourceBox = await source.locator('.datatable-header-label').boundingBox();
            const targetBox = await target.boundingBox();
            if (!sourceBox || !targetBox) {
              throw new Error('Both drag endpoints must have a bounding box');
            }

            await page.mouse.move(
              sourceBox.x + sourceBox.width / 2,
              sourceBox.y + sourceBox.height / 2
            );
            await page.mouse.down();
            try {
              if (await source.evaluate(element => element.classList.contains('draggable'))) {
                await source.locator('xpath=self::*[contains(@class, "dragging")]').waitFor({
                  state: 'attached',
                  timeout: 2000
                });
              } else {
                // Disabled headers must receive the same long-press gesture.
                await new Promise(resolve => setTimeout(resolve, 600));
              }
              await page.mouse.move(
                targetBox.x + targetBox.width / 2,
                targetBox.y + targetBox.height / 2,
                { steps: 5 }
              );
            } finally {
              await page.mouse.up();
            }
          }
        )
      }
    }
  }
});
