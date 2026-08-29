import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ROUTES } from '../types';
import { logger, parsePrice } from '../utils';

/**
 * CheckoutOverviewPage
 *
 * Encapsulates all interactions with the order review page
 * (/checkout-step-two.html).
 *
 * Responsibilities:
 *   - Read product names, prices, subtotal, tax, and total
 *   - Finish the order
 *   - Cancel and return to inventory
 *   - Programmatically validate totals
 */
export class CheckoutOverviewPage extends BasePage {
  protected readonly path = ROUTES.checkoutOverview;

  // ── Locators ──────────────────────────────────────────────────────────────
  readonly cartItems: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page);

    this.cartItems = page.locator('.cart_item, [data-test="inventory-item"]');
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  /**
   * Clicks "Finish" to complete the order.
   */
  async finishOrder(): Promise<void> {
    logger.step('Finishing order');
    await this.finishButton.click();
  }

  /**
   * Clicks "Cancel" to return to the inventory page.
   */
  async cancelOrder(): Promise<void> {
    logger.step('Cancelling order from overview');
    await this.cancelButton.click();
  }

  // ── Queries ───────────────────────────────────────────────────────────────

  /**
   * Returns all item names shown in the overview, in display order.
   */
  async getItemNames(): Promise<string[]> {
    return this.page.locator('[data-test="inventory-item-name"]').allTextContents();
  }

  /**
   * Returns the item subtotal (before tax) as a number.
   * Parses the text "Item total: $X.XX".
   */
  async getItemTotal(): Promise<number> {
    const text = (await this.subtotalLabel.textContent()) ?? '';
    return parsePrice(text);
  }

  /**
   * Returns the tax amount as a number.
   * Parses the text "Tax: $X.XX".
   */
  async getTax(): Promise<number> {
    const text = (await this.taxLabel.textContent()) ?? '';
    return parsePrice(text);
  }

  /**
   * Returns the order total (including tax) as a number.
   * Parses the text "Total: $X.XX".
   */
  async getOrderTotal(): Promise<number> {
    const text = (await this.totalLabel.textContent()) ?? '';
    return parsePrice(text);
  }

  // ── Assertions ────────────────────────────────────────────────────────────

  /**
   * Asserts that the checkout overview page has loaded.
   */
  async assertPageLoaded(): Promise<void> {
    await expect(this.finishButton).toBeVisible();
    await this.assertOnPage(ROUTES.checkoutOverview);
  }

  /**
   * Asserts that the displayed order total equals item subtotal + tax.
   * This validates the application's own arithmetic.
   */
  async assertTotalsAreCorrect(): Promise<void> {
    const itemTotal = await this.getItemTotal();
    const tax = await this.getTax();
    const displayedTotal = await this.getOrderTotal();

    // Round to 2 decimal places to avoid floating-point comparison issues
    const expectedTotal = parseFloat((itemTotal + tax).toFixed(2));
    expect(displayedTotal).toBeCloseTo(expectedTotal, 2);
  }

  /**
   * Asserts that a specific product is visible in the overview.
   *
   * @param productName - Exact product name to assert
   */
  async assertProductInOverview(productName: string): Promise<void> {
    const item = this.page
      .locator('.cart_item, [data-test="inventory-item"]')
      .filter({ hasText: productName });
    await expect(item).toBeVisible();
  }

  /**
   * Asserts that the displayed subtotal matches an expected value.
   *
   * @param expectedTotal - Expected subtotal as a number
   */
  async assertItemTotal(expectedTotal: number): Promise<void> {
    await expect(this.subtotalLabel).toContainText(expectedTotal.toFixed(2));
  }
}
