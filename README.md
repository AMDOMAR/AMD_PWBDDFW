# Playwright BDD Framework

A beginner-friendly BDD automation framework using Cucumber as the test runner
and Playwright as the browser automation library.

## Project architecture

- `features/`: Gherkin feature files, scenarios, and tags.
- `step-definitions/`: TypeScript implementations of Gherkin steps.
- `pages/`: Page Object Model classes with locators and UI interactions.
- `hooks/`: Per-scenario browser setup, failure screenshots, and cleanup.
- `config/`: Environment configuration and dotenv files.
- `test-runner/`: Cucumber CLI invocation and HTML report generation.
- `utils/`: Reserved for future shared helper functions.
- `reports/`: Generated Cucumber JSON and HTML reports.
- `screenshots/`: Screenshot files from failed scenarios.

## Installation

Use Node.js 20 or newer.

```bash
npm install
```

Install the Playwright browser binaries:

```bash
npx playwright install
```

Install Chromium only:

```bash
npx playwright install chromium
```

## Configure the environment

Choose an environment with `TEST_ENV=qa` or `TEST_ENV=uat`. The default is
`qa`. The example environment files contain the supplied SauceDemo credentials;
they are excluded from Git by `.gitignore`. Credentials use `TEST_USERNAME` and
`TEST_PASSWORD` to avoid collisions with operating-system variables such as
Windows `USERNAME`.

Environment files are `config/.env.qa` and `config/.env.uat`. Supported values:

- `BASE_URL`: Application URL.
- `TEST_USERNAME` and `TEST_PASSWORD`: Credentials for the selected environment.
- `BROWSER`: `chromium`, `firefox`, or `webkit` (default: `chromium`).
- `HEADLESS`: `true` or `false` (default: `true`).
- `TIMEOUT_MS`: Cucumber step timeout (default: `30000`).

Select QA in PowerShell:

```powershell
$env:TEST_ENV = "qa"
npm run test:bdd
```

To select UAT:

```powershell
$env:TEST_ENV = "uat"
npm run test:bdd
```

## Execute tests

Run all feature files:

```bash
npm run test:bdd
```

Run a specific feature:

```bash
npm run test:bdd -- features/login.feature
```

Run scenarios by tag:

```bash
npm run test:bdd -- --tags "@smoke"
npm run test:bdd -- --tags "@regression"
```

The root `cucumber.js` configuration loads the TypeScript support code, so
Cucumber can also be invoked directly:

```bash
npx cucumber-js --tags "@smoke"
```

Run in headed mode:

```bash
npm run test:bdd:headed
```

Generate the HTML report:

```bash
npm run test:bdd:html
```

The runner generates `reports/cucumber-report.json` and the HTML report at
`reports/html/index.html` after each run.

## Failure screenshots

The Cucumber `After` hook checks each scenario result. If it failed, the hook
saves a full-page screenshot under `screenshots/` and attaches the image to the
Cucumber scenario report. It then closes the page, browser context, and browser
to avoid leaking resources.

## End-to-end execution flow

1. Cucumber reads a `.feature` file and its Gherkin steps.
2. Cucumber matches each `Given`, `When`, and `Then` step to a step definition.
3. The step definition calls a method on `LoginPage`.
4. The page object uses Playwright `Page` locators to interact with SauceDemo.
5. Playwright controls the selected browser and opens the application.
6. Cucumber records step status, duration, and failure details in JSON.
7. The runner generates the readable HTML report from the Cucumber output.

```text
Feature File
     ↓
Cucumber
     ↓
Step Definition
     ↓
Page Object
     ↓
Playwright
     ↓
Browser
     ↓
Application
     ↓
Cucumber Report
```
