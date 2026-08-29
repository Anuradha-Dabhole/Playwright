import { test, expect } from '../../fixtures/testFixtures';
import { ERROR_MESSAGES, ROUTES } from '../../types';

/**
 * Login Test Suite
 *
 * Covers all authentication scenarios for the SauceDemo login page.
 *
 * Tags:
 *   @smoke      — Minimum viable login verification (fast CI gate)
 *   @regression — Full login validation including all negative paths
 */
test.describe('Login', () => {
  // ── Smoke Tests ────────────────────────────────────────────────────────────

  test('should login successfully with valid credentials @smoke @regression', async ({
    page,
    loginPage,
    testUsers,
  }) => {
    await loginPage.login(testUsers.validUser);
    await expect(page).toHaveURL(new RegExp(ROUTES.inventory));
  });

  // ── Regression — Negative Tests ───────────────────────────────────────────

  test('should display error for invalid username @regression', async ({
    loginPage,
    testUsers,
  }) => {
    await loginPage.login(testUsers.invalidUser);
    await loginPage.assertErrorMessage(ERROR_MESSAGES.invalidCredentials);
  });

  test('should display error when username field is empty @regression', async ({ loginPage }) => {
    await loginPage.login({ username: '', password: 'secret_sauce' });
    await loginPage.assertErrorMessage(ERROR_MESSAGES.usernameRequired);
  });

  test('should display error when password field is empty @regression', async ({ loginPage }) => {
    await loginPage.login({ username: 'standard_user', password: '' });
    await loginPage.assertErrorMessage(ERROR_MESSAGES.passwordRequired);
  });

  test('should display error when both username and password are empty @regression', async ({
    loginPage,
    testUsers,
  }) => {
    await loginPage.login(testUsers.emptyUser);
    await loginPage.assertErrorMessage(ERROR_MESSAGES.usernameRequired);
  });

  test('should display error for a locked-out user account @regression', async ({
    loginPage,
    testUsers,
  }) => {
    await loginPage.login(testUsers.lockedUser);
    await loginPage.assertErrorMessage(ERROR_MESSAGES.lockedUser);
  });

  test('should dismiss error message when the close button is clicked @regression', async ({
    loginPage,
    testUsers,
  }) => {
    await loginPage.login(testUsers.emptyUser);
    expect(await loginPage.isErrorVisible()).toBe(true);
    await loginPage.closeError();
    await expect(loginPage.errorMessage).not.toBeVisible();
  });

  test('should remain on login page after a failed login attempt @regression', async ({
    loginPage,
    testUsers,
  }) => {
    await loginPage.login(testUsers.invalidUser);
    await loginPage.assertOnPage(ROUTES.home);
  });
});
