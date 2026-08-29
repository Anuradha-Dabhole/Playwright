import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderComponent } from '../components/HeaderComponent';
import { type CartItem, ROUTES } from '../types';
import { logger, parsePrice } from '../utils';

/**
 * CartPage
 *
 * Encapsulates all interactions with the shopping cart page (/cart.html).
 *
 * Responsibilities:
 *   - View cart items
 *   - Remove items from the cart
 *   - Continue shopping (navigate back to inventory)
 *   - Proceed to checkout
 */
export class CartPage extends BasePage {
  protected readonly path = ROUTES.cart;

  readonly header: HeaderComponent;

  // ── Locators ──────────────────────────────────────────────────────────────
  readonly cartItems: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;
  readonly cartItemNames: Locator;
  readonly cartItemPrices: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);

    this.cartItems = page.locator('.cart_item, [data-test="inventory-item"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.cartItemNames = page.locator('[data-test="inventory-item-name"]');
    this.cartItemPrices = page.locator('[data-test="inventory-item-price"]');
  }

  // ── Private locator helpers ───────────────────────────────────────────────

  /**
   * Returns the remove button for a specific cart item by product name.
   */
  private getRemoveButton(productName: string): Locator {
    return this.page
      .locator('.cart_item, [data-test="inventory-item"]')
      .filter({ hasText: productName })
      .locator('button', { hasText: 'Remove' });
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  /**
   * Removes a specific item from the cart by product name.
   *
   * @param productName - Exact name of the item to remove
   */
  async removeItem(productName: string): Promise<void> {
    logger.step(`Removing item from cart: "${productName}"`);
    await this.getRemoveButton(productName).click();
  }

  /**
   * Clicks "Continue Shopping" to return to the inventory page.
   */
  async continueShopping(): Promise<void> {
    logger.step('Continuing shopping from cart');
    await this.continueShoppingButton.click();
  }

  /**
   * Clicks the "Checkout" button to proceed to checkout information.
   */
  async proceedToCheckout(): Promise<void> {
    logger.step('Proceeding to checkout');
    await this.checkoutButton.click();
  }

  // ── Queries ───────────────────────────────────────────────────────────────

  /**
   * Returns all item names in the cart, in display order.
   */
  async getCartItemNames(): Promise<string[]> {
    return this.cartItemNames.allTextContents();
  }

  /**
   * Returns all item prices as numbers, in display order.
   */
  async getCartItemPrices(): Promise<number[]> {
    const texts = await this.cartItemPrices.allTextContents();
    return texts.map((t) => parsePrice(t));
  }

  /**
   * Returns the number of items currently in the cart.
   */
  async getCartItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  /**
   * Returns all cart items as structured objects (name + price + quantity).
   */
  async getCartItems(): Promise<CartItem[]> {
    const itemCount = await this.cartItems.count();
    const items: CartItem[] = [];

    for (let i = 0; i < itemCount; i++) {
      const item = this.cartItems.nth(i);
      const name = (await item.locator('[data-test="inventory-item-name"]').textContent()) ?? '';
      const priceText =
        (await item.locator('[data-test="inventory-item-price"]').textContent()) ?? '$0.00';
      const quantityText =
        (await item.locator('[data-test="item-quantity"]').textContent()) ?? '1';

      items.push({
        name: name.trim(),
        price: parsePrice(priceText),
        quantity: parseInt(quantityText, 10),
      });
    }

    return items;
  }

  // ── Assertions ────────────────────────────────────────────────────────────

  /**
   * Asserts that the cart page has loaded correctly.
   */
  async assertPageLoaded(): Promise<void> {
    await expect(this.checkoutButton).toBeVisible();
    await this.assertOnPage(ROUTES.cart);
  }

  /**
   * Asserts that a specific product name is present in the cart.
   *
   * @param productName - Exact product name to look for
   */
  async assertItemInCart(productName: string): Promise<void> {
    const itemLocator = this.page
      .locator('.cart_item, [data-test="inventory-item"]')
      .filter({ hasText: productName });
    await expect(itemLocator).toBeVisible();
  }

  /**
   * Asserts that the cart contains the expected number of items.
   *
   * @param expectedCount - Expected number of distinct cart line items
   */
  async assertCartItemCount(expectedCount: number): Promise<void> {
    await expect(this.cartItems).toHaveCount(expectedCount);
  }

  /**
   * Asserts that the cart is empty (no items displayed).
   */
  async assertCartIsEmpty(): Promise<void> {
    await expect(this.cartItems).toHaveCount(0);
  }
}
