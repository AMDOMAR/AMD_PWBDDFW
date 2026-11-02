import { existsSync, mkdirSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import reporter = require('multiple-cucumber-html-reporter');

const projectRoot = process.cwd();
const reportsDirectory = join(projectRoot, 'reports');
const jsonReportPath = join(reportsDirectory, 'cucumber-report.json');
const htmlReportPath = join(reportsDirectory, 'html');

// Cucumber runs the scenarios; the reporter converts its JSON output to HTML.
mkdirSync(reportsDirectory, { recursive: true });
rmSync(jsonReportPath, { force: true });

const cucumberEntryPoint = resolve(
  dirname(require.resolve('@cucumber/cucumber')),
  '..',
  'bin',
  'cucumber.js',
);

const cucumberArguments = [
  cucumberEntryPoint,
  '--format',
  'progress',
  '--format',
  'json:reports/cucumber-report.json',
  ...process.argv.slice(2).filter((argument) => argument !== '--html'),
];

const cucumberResult = spawnSync(process.execPath, cucumberArguments, {
  cwd: projectRoot,
  stdio: 'inherit',
  env: process.env,
});

if (cucumberResult.error) {
  throw cucumberResult.error;
}

if (!existsSync(jsonReportPath)) {
  throw new Error(
    `Cucumber did not produce the expected JSON report: ${jsonReportPath}`,
  );
}

reporter.generate({
  jsonDir: reportsDirectory,
  reportPath: htmlReportPath,
  pageTitle: 'Playwright BDD Test Report',
  reportName: 'Cucumber Execution Report',
  openReportInBrowser: false,
});

console.log(`HTML report generated at ${htmlReportPath}`);
process.exitCode = cucumberResult.status ?? 1;
