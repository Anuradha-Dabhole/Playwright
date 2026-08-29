import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ROUTES } from '../types';
import { logger } from '../utils';

/**
 * CheckoutCompletePage
 *
 * Encapsulates all interactions with the order confirmation page
 * (/checkout-complete.html).
 *
 * Responsibilities:
 *   - Verify successful order completion
 *   - Read confirmation header and sub-text
 *   - Navigate back to the products page
 */
export class CheckoutCompletePage extends BasePage {
  protected readonly path = ROUTES.checkoutComplete;

  // ── Locators ──────────────────────────────────────────────────────────────
  readonly confirmationHeader: Locator;
  readonly confirmationText: Locator;
  readonly ponyExpressImage: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);

    this.confirmationHeader = page.locator('[data-test="complete-header"]');
    this.confirmationText = page.locator('[data-test="complete-text"]');
    this.ponyExpressImage = page.locator('[data-test="pony-express"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  /**
   * Clicks "Back Home" to return to the products page.
   */
  async backToProducts(): Promise<void> {
    logger.step('Navigating back to products from order complete');
    await this.backHomeButton.click();
  }

  // ── Queries ───────────────────────────────────────────────────────────────

  /**
   * Returns the main confirmation header text (e.g. "Thank you for your order!").
   */
  async getConfirmationHeader(): Promise<string> {
    return (await this.confirmationHeader.textContent()) ?? '';
  }

  /**
   * Returns the confirmation sub-text displayed below the header.
   */
  async getConfirmationText(): Promise<string> {
    return (await this.confirmationText.textContent()) ?? '';
  }

  /**
   * Returns true when the order completion confirmation is fully visible.
   */
  async isOrderComplete(): Promise<boolean> {
    return (
      (await this.confirmationHeader.isVisible()) &&
      (await this.ponyExpressImage.isVisible())
    );
  }

  // ── Assertions ────────────────────────────────────────────────────────────

  /**
   * Asserts that the checkout complete page has loaded correctly.
   */
  async assertPageLoaded(): Promise<void> {
    await expect(this.confirmationHeader).toBeVisible();
    await this.assertOnPage(ROUTES.checkoutComplete);
  }

  /**
   * Asserts that the order was placed successfully.
   * Verifies the header text and the pony express graphic.
   */
  async assertOrderCompleted(): Promise<void> {
    logger.step('Verifying order completion');
    await expect(this.confirmationHeader).toBeVisible();
    await expect(this.confirmationHeader).toContainText('Thank you for your order');
    await expect(this.ponyExpressImage).toBeVisible();
  }
}
