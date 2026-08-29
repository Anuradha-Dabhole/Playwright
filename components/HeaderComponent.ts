import { type Locator, type Page } from '@playwright/test';

/**
 * HeaderComponent
 *
 * Encapsulates the shared application header that appears across all
 * authenticated pages. Provides access to the cart badge, navigation
 * menu, and page title — preventing duplication across page objects.
 *
 * Usage:
 *   const header = new HeaderComponent(page);
 *   const count = await header.getCartBadgeCount();
 */
export class HeaderComponent {
  private readonly page: Page;

  // ── Locators ──────────────────────────────────────────────────────────────
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly menuButton: Locator;
  readonly pageTitle: Locator;

  // ── Sidebar menu items ────────────────────────────────────────────────────
  readonly menuAllItems: Locator;
  readonly menuAbout: Locator;
  readonly menuLogout: Locator;
  readonly menuResetAppState: Locator;
  readonly menuCloseButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.pageTitle = page.locator('[data-test="title"]');

    this.menuAllItems = page.locator('[data-test="inventory-sidebar-link"]');
    this.menuAbout = page.locator('[data-test="about-sidebar-link"]');
    this.menuLogout = page.locator('[data-test="logout-sidebar-link"]');
    this.menuResetAppState = page.locator('[data-test="reset-sidebar-link"]');
    this.menuCloseButton = page.locator('#react-burger-cross-btn');
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  /**
   * Clicks the shopping cart icon to navigate to the cart page.
   */
  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  /**
   * Opens the hamburger navigation menu.
   */
  async openMenu(): Promise<void> {
    await this.menuButton.click();
    // Wait for the menu to be visible before interacting
    await this.menuAllItems.waitFor({ state: 'visible' });
  }

  /**
   * Closes the navigation menu.
   */
  async closeMenu(): Promise<void> {
    await this.menuCloseButton.click();
  }

  /**
   * Logs out the current user via the navigation menu.
   */
  async logout(): Promise<void> {
    await this.openMenu();
    await this.menuLogout.click();
  }

  /**
   * Resets the application state via the navigation menu.
   * Useful for clearing cart state without re-logging in.
   */
  async resetAppState(): Promise<void> {
    await this.openMenu();
    await this.menuResetAppState.click();
    await this.closeMenu();
  }

  // ── Queries ───────────────────────────────────────────────────────────────

  /**
   * Returns the number displayed on the cart badge.
   * Returns 0 when no badge is visible (empty cart).
   */
  async getCartBadgeCount(): Promise<number> {
    const isVisible = await this.cartBadge.isVisible();
    if (!isVisible) return 0;

    const text = await this.cartBadge.textContent();
    return parseInt(text ?? '0', 10);
  }

  /**
   * Returns the text of the page title element.
   */
  async getPageTitle(): Promise<string> {
    return (await this.pageTitle.textContent()) ?? '';
  }

  /**
   * Returns true when the cart badge is visible (cart has items).
   */
  async isCartBadgeVisible(): Promise<boolean> {
    return this.cartBadge.isVisible();
  }
}
