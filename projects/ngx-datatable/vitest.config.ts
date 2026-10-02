import { defineBrowserCommand } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    browser: {
      commands: {
        longPressDrag: defineBrowserCommand(
          // Vitest serializes the browser-side Locator arguments to selector strings.
          async ({ page, iframe }, sourceSelector: string, targetSelector: string) => {
            const source = iframe.locator(sourceSelector);
            const target = iframe.locator(targetSelector);
            // Read both positions before the dragged header is translated.
            const sourceBox = await source.boundingBox();
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
