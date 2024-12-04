/* eslint-disable no-console */
import { mkdir, writeFile } from 'fs/promises';

import { expect, type FullConfig, type TestInfo } from '@playwright/test';
import { type Reporter, Suite, TestCase } from '@playwright/test/reporter';
import * as axe from 'axe-core';
import { createHtmlReport } from 'axe-html-reporter';

const A11Y_VIOLATIONS_ID = 'a11yViolations';

const A11Y_TEST_NAME_ID = 'a11yTestName';

export const expectNoA11yViolations = async (
  testInfo: TestInfo,
  violations: axe.Result[],
  testName: string
): Promise<void> => {
  testInfo.annotations.push({ type: A11Y_TEST_NAME_ID, description: testName });
  await testInfo.attach(A11Y_VIOLATIONS_ID, { body: JSON.stringify(violations, null, 2) });
  const errorMessages = generateErrorMessages(testInfo, violations, testName);
  expect(errorMessages).toEqual('');
};

const generateHTMLFileName = (reportFileName: string): string => `${reportFileName}.html`;

const generateHTMLFilePath = (directory: string, reportTestName: string): string =>
  `${directory}/${generateHTMLFileName(reportTestName)}`;

const getReporterConfig = (testInfo: TestInfo): any | undefined => {
  const reporters = testInfo.config.reporter;

  if (reporters && typeof reporters !== 'string') {
    return reporters.find(reporter => reporter[0].includes('playwright-axe-reporter'));
  }

  return undefined;
};

const generateErrorMessages = (
  testInfo: TestInfo,
  violations: axe.Result[],
  testName: string
): string => {
  if (violations.length) {
    let html: string | undefined;

    const reporterConfig = getReporterConfig(testInfo);

    const htmlOutputDir = reporterConfig?.[1] ? reporterConfig[1].htmlOutputDir : undefined;

    if (htmlOutputDir) {
      html = generateHTMLFilePath(htmlOutputDir, testName);
    }

    let message = `${violations.length} a11y violation(s) detected\n`;
    violations.forEach(v => {
      message += `      - ${v.nodes.length} ${v.id} (${v.impact}): ${v.description}\n`;
    });
    if (html) {
      message += `      => report: ${html}`;
    }
    return message;
  }
  return '';
};

class PlaywrightAxeReporter implements Reporter {
  private isA11y = true;
  private outputFile?: string;
  private htmlOutputDir?: string;

  private tests?: TestCase[];

  constructor(
    options: { outputFile?: string; htmlOutputDir?: string; isA11y?: boolean | string } = {}
  ) {
    this.outputFile = options.outputFile;
    this.htmlOutputDir = options.htmlOutputDir;
    if (options.isA11y === false) {
      this.isA11y = false;
    } else if (options.isA11y && options.isA11y !== true) {
      const env = process.env[options.isA11y];
      this.isA11y = !!env && env.toLocaleLowerCase() !== 'false';
    }
  }

  private getTestName(test: TestCase): string {
    return (
      test.annotations.find(result => result.type === A11Y_TEST_NAME_ID)?.description ?? test.title
    );
  }

  // Get all attachments of the latest test result (if there are multiple there were retries).
  private getViolations(test: TestCase): axe.Result[] {
    for (let index = test.results.length - 1; index >= 0; index--) {
      const result = test.results[index];

      let violations: axe.Result[] | undefined;

      result.attachments.forEach(attachment => {
        if (attachment.name !== A11Y_VIOLATIONS_ID) {
          return;
        }

        const attachmentString = attachment.body?.toString('utf8');

        if (!attachmentString) {
          return;
        }

        const foundViolations = JSON.parse(attachmentString) as axe.Result[];

        if (!violations) {
          violations = [...foundViolations];
        } else {
          violations.push(...foundViolations);
        }
      });

      if (violations) {
        return violations;
      }
    }

    return [];
  }

  private generateHTMLReport(
    testTitle: string,
    reportTestName: string,
    violations: axe.Result[]
  ): void {
    if (this.htmlOutputDir) {
      // createHtmlReport contains a hardcoded console.info() that generates noise
      const origConsoleInfo = console.info;
      (console.info as any) = () => {};

      createHtmlReport({
        results: { violations },
        options: {
          projectKey: testTitle,
          outputDir: this.htmlOutputDir,
          reportFileName: generateHTMLFileName(reportTestName)
        }
      });

      console.info = origConsoleInfo;
    }
  }

  onBegin(_: FullConfig, suite: Suite): void {
    if (this.isA11y && this.outputFile) {
      this.tests = suite.allTests();
    }
  }

  async onEnd(): Promise<void> {
    if (this.isA11y && this.outputFile && this.tests) {
      const a11yReport: Record<string, axe.Result[]> = {};

      this.tests.forEach(test => {
        const violations = this.getViolations(test);

        if (violations.length) {
          const testName = this.getTestName(test);

          this.generateHTMLReport(test.title, testName, violations);

          a11yReport[testName] = violations;
        }
      });

      const jsonReport = {
        total: this.tests.length,
        passes: this.tests.reduce(
          (count, test) =>
            test.outcome() === 'expected' || test.outcome() === 'flaky' ? count + 1 : count,
          0
        ),
        errors: this.tests.reduce(
          (count, test) => (test.outcome() === 'unexpected' ? count + 1 : count),
          0
        ),
        results: a11yReport
      };

      await mkdir(this.outputFile.substring(0, this.outputFile.lastIndexOf('/')), {
        recursive: true
      });
      await writeFile(this.outputFile, JSON.stringify(jsonReport, null, 2), 'utf8');
    }
  }

  printsToStdio(): boolean {
    return false;
  }
}
export default PlaywrightAxeReporter;
