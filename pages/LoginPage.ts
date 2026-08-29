import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { type UserCredentials, ROUTES } from '../types';
import { logger } from '../utils';

/**
 * LoginPage
 *
 * Encapsulates all interactions and assertions for the login page
 * at https://www.saucedemo.com/
 *
 * Responsibilities:
 *   - Navigate to the application
 *   - Enter username and password
 *   - Submit the login form
 *   - Retrieve and assert error messages
 */
export class LoginPage extends BasePage {
  protected readonly path = ROUTES.home;

  // ── Locators ──────────────────────────────────────────────────────────────
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly errorCloseButton: Locator;

  constructor(page: Page) {
    super(page);

    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.errorCloseButton = page.locator('[data-test="error"] button');
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  /**
   * Fills in the username field.
   */
  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  /**
   * Fills in the password field.
   */
  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  /**
   * Clicks the Login button.
   */
  async clickLoginButton(): Promise<void> {
    await this.loginButton.click();
  }

  /**
   * Performs a complete login action with the given credentials.
   * Does NOT assert a successful outcome — callers decide what to assert.
   *
   * @param credentials - Username and password to use
   */
  async login(credentials: UserCredentials): Promise<void> {
    logger.step(`Logging in as "${credentials.username}"`);
    await this.enterUsername(credentials.username);
    await this.enterPassword(credentials.password);
    await this.clickLoginButton();
  }

  /**
   * Closes the visible error message banner.
   */
  async closeError(): Promise<void> {
    await this.errorCloseButton.click();
  }

  // ── Queries ───────────────────────────────────────────────────────────────

  /**
   * Returns the text of the error message currently shown.
   * Returns an empty string if no error is displayed.
   */
  async getErrorMessage(): Promise<string> {
    return (await this.errorMessage.textContent()) ?? '';
  }

  /**
   * Returns true when an error message banner is visible.
   */
  async isErrorVisible(): Promise<boolean> {
    return this.errorMessage.isVisible();
  }

  // ── Assertions ────────────────────────────────────────────────────────────

  /**
   * Asserts that the login error message contains the expected text.
   *
   * @param expectedText - Substring or full text expected in the error
   */
  async assertErrorMessage(expectedText: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedText);
  }

  /**
   * Asserts that the login page title is visible (validates the page loaded).
   */
  async assertPageLoaded(): Promise<void> {
    await expect(this.loginButton).toBeVisible();
    await expect(this.usernameInput).toBeVisible();
  }
}
