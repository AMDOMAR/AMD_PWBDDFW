import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import {
  After,
  Before,
  setDefaultTimeout,
  setWorldConstructor,
  Status,
  World,
  type ITestCaseHookParameter,
} from '@cucumber/cucumber';
import {
  chromium,
  firefox,
  webkit,
  type Browser,
  type BrowserContext,
  type Page,
} from 'playwright';
import { frameworkConfig } from '../config/config';
import { LoginPage } from '../pages/LoginPage';

const screenshotsDirectory = join(process.cwd(), 'screenshots');

export class LoginWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  loginPage?: LoginPage;
}

setWorldConstructor(LoginWorld);
setDefaultTimeout(frameworkConfig.timeoutMs);

// A Browser is launched once per scenario; its BrowserContext isolates cookies
// and other session state, and the Page is the scenario's browser tab.
Before(async function (this: LoginWorld) {
  await mkdir(screenshotsDirectory, { recursive: true });

  switch (frameworkConfig.browserName) {
    case 'chromium':
      this.browser = await chromium.launch({
        headless: frameworkConfig.headless,
      });
      break;
    case 'firefox':
      this.browser = await firefox.launch({
        headless: frameworkConfig.headless,
      });
      break;
    case 'webkit':
      this.browser = await webkit.launch({
        headless: frameworkConfig.headless,
      });
      break;
  }

  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
  this.loginPage = new LoginPage(this.page);
});

After(async function (
  this: LoginWorld,
  scenario: ITestCaseHookParameter,
) {
  const errors: Error[] = [];

  // Cucumber attachments are included in the JSON report and rendered by HTML.
  if (scenario.result?.status === Status.FAILED && this.page) {
    const safeScenarioName =
      scenario.pickle.name.replace(/[^a-zA-Z0-9-_]+/g, '_') || 'failed-scenario';
    const screenshotPath = join(
      screenshotsDirectory,
      `${safeScenarioName}-${Date.now()}.png`,
    );

    try {
      const screenshot = await this.page.screenshot({
        path: screenshotPath,
        fullPage: true,
      });
      await this.attach(screenshot, 'image/png');
    } catch (error) {
      errors.push(error instanceof Error ? error : new Error(String(error)));
    }
  }

  for (const resource of [this.page, this.context, this.browser]) {
    if (!resource) {
      continue;
    }

    try {
      await resource.close();
    } catch (error) {
      errors.push(error instanceof Error ? error : new Error(String(error)));
    }
  }

  if (errors.length > 0) {
    throw new AggregateError(
      errors,
      'Failed to capture a screenshot or close browser resources.',
    );
  }
});
