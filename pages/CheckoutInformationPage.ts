import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { type CheckoutData, ROUTES } from '../types';
import { logger } from '../utils';

/**
 * CheckoutInformationPage
 *
 * Encapsulates all interactions with the checkout step one page
 * (/checkout-step-one.html) where the customer enters their information.
 *
 * Responsibilities:
 *   - Fill in first name, last name, and postal code
 *   - Continue to checkout overview
 *   - Cancel and return to cart
 *   - Validate form errors
 */
export class CheckoutInformationPage extends BasePage {
  protected readonly path = ROUTES.checkoutInformation;

  // ── Locators ──────────────────────────────────────────────────────────────
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);

    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  /**
   * Fills in the checkout information form fields.
   *
   * @param data - Customer information (first name, last name, postal code)
   */
  async fillCheckoutForm(data: CheckoutData): Promise<void> {
    logger.step(
      `Filling checkout form for: ${data.firstName} ${data.lastName}, ${data.postalCode}`,
    );
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.postalCodeInput.fill(data.postalCode);
  }

  /**
   * Clicks the "Continue" button to proceed to the order overview.
   */
  async continueCheckout(): Promise<void> {
    logger.step('Continuing to checkout overview');
    await this.continueButton.click();
  }

  /**
   * Clicks the "Cancel" button to return to the cart.
   */
  async cancelCheckout(): Promise<void> {
    logger.step('Cancelling checkout');
    await this.cancelButton.click();
  }

  /**
   * Fills the checkout form and then clicks Continue in a single step.
   * Convenience method for tests that do not need to assert intermediate state.
   *
   * @param data - Customer information
   */
  async fillAndContinue(data: CheckoutData): Promise<void> {
    await this.fillCheckoutForm(data);
    await this.continueCheckout();
  }

  // ── Queries ───────────────────────────────────────────────────────────────

  /**
   * Returns the text of the currently displayed error message.
   */
  async getErrorMessage(): Promise<string> {
    return (await this.errorMessage.textContent()) ?? '';
  }

  /**
   * Returns true when a form validation error is visible.
   */
  async isErrorVisible(): Promise<boolean> {
    return this.errorMessage.isVisible();
  }

  // ── Assertions ────────────────────────────────────────────────────────────

  /**
   * Asserts that the checkout information page has loaded.
   */
  async assertPageLoaded(): Promise<void> {
    await expect(this.firstNameInput).toBeVisible();
    await this.assertOnPage(ROUTES.checkoutInformation);
  }

  /**
   * Asserts that the form error message contains the expected text.
   *
   * @param expectedText - Substring or full text to look for in the error
   */
  async assertErrorMessage(expectedText: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedText);
  }
}
