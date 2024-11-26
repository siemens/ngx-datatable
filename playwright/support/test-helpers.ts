// eslint-disable-next-line @typescript-eslint/naming-convention
import AxeBuilder from '@axe-core/playwright';
import {
  test as baseTest,
  type ElementHandle,
  expect,
  type Page,
  type TestInfo
} from '@playwright/test';
import axe from 'axe-core';

import { expectNoA11yViolations } from '../reporters/playwright-axe-reporter';

export { expect } from '@playwright/test';

const NGX_EXAMPLE_NAME_ID = 'siExampleName';

const detectTestTypes = (): { isA11y: boolean; isVrt: boolean } => {
  let isA11y =
    !!process.env.PLAYWRIGHT_isa11y &&
    process.env.PLAYWRIGHT_isa11y.toLocaleLowerCase() !== 'false';

  let isVrt =
    !!process.env.PLAYWRIGHT_isvrt && process.env.PLAYWRIGHT_isvrt.toLocaleLowerCase() !== 'false';

  // Per default do both A11y and VRT
  if (!isA11y && !isVrt) {
    isA11y = true;
    isVrt = true;
  }

  return { isA11y, isVrt };
};

const { isA11y, isVrt } = detectTestTypes();

export const VIEWPORTS = [
  { name: 'default', width: 0, height: 0 }, // Default, 0 will skip resizing and use the default value
  { name: 'tablet-portrait', width: 768, height: 1024 },
  { name: 'tablet-landscape', width: 1024, height: 768 }
];
export type Viewport = (typeof VIEWPORTS)[number];

export type StaticTestOptions = {
  delay?: number;
  maxDiffPixels?: number;
  disabledA11yRules?: string[];
  viewports?: (Viewport | string)[];
  waitCallback?: (page: Page) => Promise<void>;
  skipAutoScaleViewport?: boolean;
};

class SiTestHelpers {
  private disableAnimationsTag: ElementHandle<Node> | undefined;

  constructor(
    private page: Page,
    private testInfo: TestInfo
  ) {}

  public async visitExample(name: string, autoScaleViewport = true): Promise<void> {
    await test.step(
      'visitExample: ' + name,
      async () => {
        // Set it initially (or override previous).
        this.overrideExampleName(name);
        const urlParams = [];

        const urlParamsString = urlParams.length ? '?' + urlParams.join('&') : '';
        const newHash = `/#/${name}${urlParamsString}`;
        await this.page.goto(newHash);

        await this.page.evaluate(() => document.fonts.ready);

        if (autoScaleViewport) {
          const height = await this.page.evaluate(() => document.body.scrollHeight);
          const width = await this.page.evaluate(() => document.body.scrollWidth);
          const viewportSize = this.page.viewportSize();
          if (!viewportSize || viewportSize.height < height || viewportSize.width < width) {
            await this.page.setViewportSize({
              height: Math.max(height, viewportSize?.height ?? 0),
              width: Math.max(width, viewportSize?.width ?? 0)
            });
          }
        }
      },
      { box: true }
    );
  }

  public async runVisualAndA11yTests(
    step?: string,
    axeRulesSet: (string | { id: string; enabled: boolean })[] = [],
    maxDiffPixels?: number
  ): Promise<void> {
    const example = this.getExampleName() ?? this.testInfo.title;
    const testName = this.makeTestName(example, step);
    await test.step(
      'runVisualAndA11yTests: ' + testName,
      async () => {
        if (isA11y) {
          await this.enableDisableAnimations(this.page, false);
          const rules = axeRulesSet
            .filter(
              item =>
                typeof item === 'string' || (typeof item === 'object' && item?.enabled === true)
            )
            .map(item => (typeof item === 'object' ? item.id : item));

          if (
            !!process.env.PLAYWRIGHT_a11y_all &&
            process.env.PLAYWRIGHT_a11y_all.toLocaleLowerCase() !== 'false'
          ) {
            // Only use global disabled rules.
            axeRulesSet = [];
          }

          const disabledRules = [
            'landmark-one-main',
            'page-has-heading-one',
            'region',
            ...axeRulesSet
              .filter(item => typeof item === 'object' && item?.enabled === false)
              .map(item => (typeof item === 'object' ? item.id : item))
          ];
          let axeResults: axe.AxeResults;
          try {
            if (rules.length) {
              axeResults = (await new AxeBuilder({ page: this.page })
                .exclude('.e2e-ignore-a11y')
                .withRules(rules)
                .disableRules(disabledRules)
                .analyze()) as axe.AxeResults;
            } else {
              axeResults = (await new AxeBuilder({ page: this.page })
                .exclude('.e2e-ignore-a11y')
                .disableRules(disabledRules)
                .analyze()) as axe.AxeResults;
            }
          } finally {
            await this.enableDisableAnimations(this.page, true);
          }
          await expectNoA11yViolations(this.testInfo, axeResults.violations, testName);
        }
        if (isVrt) {
          await expect(this.page).toHaveScreenshot(testName + '.png', {
            maxDiffPixels,
            stylePath: './playwright/support/vrt-styles.css'
          });
        }
      },
      { box: true }
    );
  }

  public async waitForAllAnimationsToComplete(threshold = 0): Promise<void> {
    await this.page.waitForFunction(
      count => window.document.getAnimations().length <= count,
      threshold
    );
  }

  /**
   * Set the example name to be used by `runVisualAndA11yTests`, automatically set by `visitExample`.
   * @param name - Name to be set, if empty or undefined then the previous value is removed.
   */
  public overrideExampleName(name?: string | undefined): void {
    const previousIndex = this.testInfo.annotations.findIndex(
      result => result.type === NGX_EXAMPLE_NAME_ID
    );
    if (previousIndex >= 0) {
      this.testInfo.annotations.splice(previousIndex, 1);
    }
    if (name) {
      this.testInfo.annotations.push({ type: NGX_EXAMPLE_NAME_ID, description: name });
    }
  }

  /**
   * Get the example name set by `visitExample`.
   */
  public getExampleName(): string | undefined {
    return this.testInfo.annotations.find(result => result.type === NGX_EXAMPLE_NAME_ID)
      ?.description;
  }

  private async enableDisableAnimations(page: Page, show: boolean): Promise<void> {
    if (!show) {
      await this.disableAnimationsTag?.evaluate(element =>
        element.parentNode?.removeChild(element)
      );
      await this.disableAnimationsTag?.dispose();
      this.disableAnimationsTag = await page.addStyleTag({
        content: `*, *:before, *:after {
  transition-property: none !important;
  animation: none !important;
}`
      });
    } else {
      await this.disableAnimationsTag?.evaluate(element =>
        element.parentNode?.removeChild(element)
      );
      await this.disableAnimationsTag?.dispose();
      this.disableAnimationsTag = undefined;
    }
  }

  private makeTestName(example: string, step?: string): string {
    // this is so that we have filenames that make sense
    let testName = example.replace(/\//g, '--');
    if (step) {
      testName += `--${step}`;
    }
    return testName;
  }
}

export const test = baseTest.extend<{
  si: SiTestHelpers;
}>({
  si: [
    async ({ page }, use, testInfo) => {
      await use(new SiTestHelpers(page, testInfo));
    },
    { box: true }
  ]
});
