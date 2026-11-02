import assert from 'node:assert/strict';
import { Given, When, Then } from '@cucumber/cucumber';
import { frameworkConfig } from '../config/config';
import { LoginWorld } from '../hooks/hooks';

// Step definitions bind readable Gherkin statements to page-object actions.
const loginPageFor = (world: LoginWorld) => {
  if (!world.loginPage) {
    throw new Error(
      'Login page is not initialized. Check the Cucumber Before hook.',
    );
  }

  return world.loginPage;
};

Given('I navigate to the login page', async function (this: LoginWorld) {
  await loginPageFor(this).navigateToLoginPage();
});

When(
  'I enter valid username and password',
  async function (this: LoginWorld) {
    const loginPage = loginPageFor(this);
    await loginPage.enterUsername(frameworkConfig.username);
    await loginPage.enterPassword(frameworkConfig.password);
  },
);

When(
  'I enter invalid username and password',
  async function (this: LoginWorld) {
    const loginPage = loginPageFor(this);
    await loginPage.enterUsername('invalid_user');
    await loginPage.enterPassword('invalid_password');
  },
);

When('I click the login button', async function (this: LoginWorld) {
  await loginPageFor(this).clickLogin();
});

Then(
  'I should be successfully logged in',
  async function (this: LoginWorld) {
    await loginPageFor(this).verifySuccessfulLogin();
  },
);

Then(
  'I should see a login error message',
  async function (this: LoginWorld) {
    const message = await loginPageFor(this).getLoginErrorMessage();
    assert.match(message, /username and password do not match/i);
  },
);
