import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import dotenv from 'dotenv';

const testEnvironment = process.env.TEST_ENV ?? 'qa';

if (!['qa', 'uat'].includes(testEnvironment)) {
  throw new Error(
    `Unsupported TEST_ENV "${testEnvironment}". Choose "qa" or "uat".`,
  );
}

const envFilePath = resolve(__dirname, `.env.${testEnvironment}`);

if (!existsSync(envFilePath)) {
  throw new Error(`Environment file not found: ${envFilePath}`);
}

const dotenvResult = dotenv.config({ path: envFilePath });

if (dotenvResult.error) {
  throw new Error(`Could not load environment file: ${envFilePath}`, {
    cause: dotenvResult.error,
  });
}

const required = (name: string): string => {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(
      `Missing ${name}. Set it in ${envFilePath} or in the process environment.`,
    );
  }

  return value;
};

const browserName = process.env.BROWSER ?? 'chromium';

if (!['chromium', 'firefox', 'webkit'].includes(browserName)) {
  throw new Error(
    `Unsupported BROWSER "${browserName}". Choose chromium, firefox, or webkit.`,
  );
}

const headlessValue = (process.env.HEADLESS ?? 'true').toLowerCase();

if (!['true', 'false'].includes(headlessValue)) {
  throw new Error('HEADLESS must be either "true" or "false".');
}

const timeoutMs = Number(process.env.TIMEOUT_MS ?? '30000');

if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
  throw new Error('TIMEOUT_MS must be a positive number.');
}

const baseUrl = required('BASE_URL');

try {
  new URL(baseUrl);
} catch (error) {
  throw new Error(`BASE_URL is not a valid URL: "${baseUrl}"`, { cause: error });
}

export const frameworkConfig = {
  environment: testEnvironment,
  baseUrl,
  username: required('TEST_USERNAME'),
  password: required('TEST_PASSWORD'),
  browserName: browserName as 'chromium' | 'firefox' | 'webkit',
  headless: headlessValue === 'true',
  timeoutMs,
};
