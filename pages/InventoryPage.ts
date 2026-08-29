import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderComponent } from '../components/HeaderComponent';
import { type Product, SortOption, SORT_OPTION_LABELS, ROUTES } from '../types';
import { logger, parsePrice } from '../utils';

/**
 * InventoryPage
 *
 * Encapsulates all interactions with the products listing page (/inventory.html).
 *
 * Responsibilities:
 *   - Get product names and prices
 *   - Add / remove products from the cart
 *   - Sort the product list
 *   - Navigate to the cart
 *   - Validate product information and cart badge
 */
export class InventoryPage extends BasePage {
  protected readonly path = ROUTES.inventory;

  readonly header: HeaderComponent;

  // ── Locators ──────────────────────────────────────────────────────────────
  readonly inventoryContainer: Locator;
  readonly inventoryItems: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);

    this.inventoryContainer = page.locator('[data-test="inventory-container"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
  }

  // ── Private locator helpers ───────────────────────────────────────────────

  /**
   * Returns the "Add to cart" button locator for a product by its exact name.
   */
  private getAddToCartButton(productName: string): Locator {
    return this.page
      .locator('[data-test="inventory-item"]')
      .filter({ hasText: productName })
      .locator('button', { hasText: 'Add to cart' });
  }

  /**
   * Returns the "Remove" button locator for a product by its exact name.
   */
  private getRemoveButton(productName: string): Locator {
    return this.page
      .locator('[data-test="inventory-item"]')
      .filter({ hasText: productName })
      .locator('button', { hasText: 'Remove' });
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  /**
   * Adds a product to the cart by its exact product name.
   *
   * @param productName - Exact name of the product to add
   */
  async addProductToCart(productName: string): Promise<void> {
    logger.step(`Adding product to cart: "${productName}"`);
    await this.getAddToCartButton(productName).click();
  }

  /**
   * Removes a product from the cart by its exact product name.
   *
   * @param productName - Exact name of the product to remove
   */
  async removeProductFromCart(productName: string): Promise<void> {
    logger.step(`Removing product from cart: "${productName}"`);
    await this.getRemoveButton(productName).click();
  }

  /**
   * Selects a sort option from the product sort dropdown.
   *
   * @param option - A SortOption enum value
   */
  async selectSortOption(option: SortOption): Promise<void> {
    logger.step(`Sorting products by: "${SORT_OPTION_LABELS[option]}"`);
    await this.sortDropdown.selectOption(option);
  }

  /**
   * Clicks the shopping cart icon to navigate to the cart.
   */
  async goToCart(): Promise<void> {
    logger.step('Navigating to cart');
    await this.header.openCart();
  }

  // ── Queries ───────────────────────────────────────────────────────────────

  /**
   * Returns all product names currently displayed on the page, in order.
   */
  async getProductNames(): Promise<string[]> {
    const nameLocators = this.page.locator('[data-test="inventory-item-name"]');
    return nameLocators.allTextContents();
  }

  /**
   * Returns all product prices as numbers, in display order.
   */
  async getProductPrices(): Promise<number[]> {
    const priceLocators = this.page.locator('[data-test="inventory-item-price"]');
    const texts = await priceLocators.allTextContents();
    return texts.map((t) => parsePrice(t));
  }

  /**
   * Returns all products as structured objects (name + price).
   */
  async getProducts(): Promise<Product[]> {
    const names = await this.getProductNames();
    const prices = await this.getProductPrices();
    return names.map((name, i) => ({ name, price: prices[i] ?? 0 }));
  }

  /**
   * Returns the cart badge count from the header.
   * Returns 0 when the cart is empty.
   */
  async getCartBadgeCount(): Promise<number> {
    return this.header.getCartBadgeCount();
  }

  /**
   * Returns the number of inventory items currently rendered.
   */
  async getProductCount(): Promise<number> {
    return this.inventoryItems.count();
  }

  // ── Assertions ────────────────────────────────────────────────────────────

  /**
   * Asserts that the inventory page has loaded and products are visible.
   */
  async assertPageLoaded(): Promise<void> {
    await expect(this.inventoryContainer).toBeVisible();
    await this.assertOnPage(ROUTES.inventory);
  }

  /**
   * Asserts that the cart badge displays the expected count.
   *
   * @param expectedCount - Expected number shown in the cart badge
   */
  async assertCartBadgeCount(expectedCount: number): Promise<void> {
    if (expectedCount === 0) {
      await expect(this.header.cartBadge).not.toBeVisible();
    } else {
      await expect(this.header.cartBadge).toBeVisible();
      await expect(this.header.cartBadge).toHaveText(String(expectedCount));
    }
  }

  /**
   * Asserts that at least one product is visible on the page.
   */
  async assertProductsVisible(): Promise<void> {
    await expect(this.inventoryItems.first()).toBeVisible();
  }
}
