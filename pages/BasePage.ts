import { type Page, type Locator, expect } from '@playwright/test';

/**
 * BasePage
 *
 * Abstract base class for all page objects. Provides common navigation,
 * title retrieval, and URL assertion helpers so that individual page
 * objects stay focused on page-specific behaviour.
 *
 * Design principle:
 *   Test → PageObject (extends BasePage) → Playwright → Application
 */
export abstract class BasePage {
  protected readonly page: Page;

  /** The relative path this page lives at (e.g. '/inventory.html') */
  protected abstract readonly path: string;

  constructor(page: Page) {
    this.page = page;
  }

  // ── Navigation ────────────────────────────────────────────────────────────

  /**
   * Navigates directly to this page's path.
   * Waits for the page to reach 'domcontentloaded' before returning.
   */
  async navigate(): Promise<void> {
    await this.page.goto(this.path);
    await this.page.waitForLoadState('domcontentloaded');
  }

  // ── Page State ────────────────────────────────────────────────────────────

  /**
   * Returns the current page title from the browser tab.
   */
  async getTitle(): Promise<string> {
    return this.page.title();
  }

  /**
   * Returns the current page URL.
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  // ── Assertions ────────────────────────────────────────────────────────────

  /**
   * Asserts that the current URL contains the expected path segment.
   *
   * @param expectedPath - Path segment to look for in the current URL
   */
  async assertOnPage(expectedPath: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(expectedPath.replace('.', '\\.')));
  }

  /**
   * Waits for a locator to become visible with a clear timeout error.
   *
   * @param locator - The element to wait for
   * @param timeout - Optional timeout in milliseconds (defaults to Playwright default)
   */
  protected async waitForElement(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ state: 'visible', ...(timeout ? { timeout } : {}) });
  }
}
