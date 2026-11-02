import { frameworkConfig } from './config/config';

// Browser settings are shared for reference; Cucumber remains the test runner.
const playwrightConfig = {
  baseURL: frameworkConfig.baseUrl,
  browserName: frameworkConfig.browserName,
  headless: frameworkConfig.headless,
  timeout: frameworkConfig.timeoutMs,
};

export default playwrightConfig;
