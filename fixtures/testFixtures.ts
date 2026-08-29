import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutInformationPage } from '../pages/CheckoutInformationPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';
import type { TestUsers, TestCheckoutData } from '../types';

// Static JSON imports — resolveJsonModule must be enabled in tsconfig (it is)
import usersData from '../test-data/users.json';
import checkoutDataJson from '../test-data/checkoutData.json';

const users = usersData as TestUsers;


/**
 * Shape of the custom fixture set exposed to tests.
 *
 * Fixtures are designed so that each test receives freshly constructed
 * page objects without repeating boilerplate setup code.
 */
interface SauceFixtures {
  /** Page object for the login screen (no authentication pre-applied) */
  loginPage: LoginPage;

  /**
   * Page object for the inventory screen.
   * The fixture automatically logs in as standard_user before handing control
   * to the test. Use this for any test that requires an authenticated session
   * but is NOT testing the login functionality itself.
   */
  inventoryPage: InventoryPage;

  /**
   * Page object for the shopping cart.
   * Pre-authenticated as standard_user.
   */
  cartPage: CartPage;

  /**
   * Page object for the checkout information form.
   * Pre-authenticated as standard_user.
   */
  checkoutInfoPage: CheckoutInformationPage;

  /**
   * Page object for the checkout order overview.
   * Pre-authenticated as standard_user.
   */
  checkoutOverviewPage: CheckoutOverviewPage;

  /**
   * Page object for the order confirmation screen.
   * Pre-authenticated as standard_user.
   */
  checkoutCompletePage: CheckoutCompletePage;

  /** Raw test user data loaded from test-data/users.json */
  testUsers: TestUsers;

  /** Raw checkout data loaded from test-data/checkoutData.json */
  testCheckoutData: TestCheckoutData;
}

/**
 * Performs a programmatic login using the LoginPage POM.
 * Extracted as a helper so all authenticated fixtures share the same login path.
 */
async function performLogin(loginPage: LoginPage): Promise<void> {
  await loginPage.navigate();
  await loginPage.login(users.validUser);
}

/**
 * Augmented test object with custom SauceDemo fixtures.
 *
 * Usage in tests:
 *   import { test, expect } from '../../fixtures/testFixtures';
 *
 *   test('should display products', async ({ inventoryPage }) => {
 *     await inventoryPage.assertProductsVisible();
 *   });
 */
export const test = base.extend<SauceFixtures>({
  // ── Test data fixtures ─────────────────────────────────────────────────────

  testUsers: async ({}, use) => {
    await use(users);
  },

  testCheckoutData: async ({}, use) => {
    await use(checkoutDataJson as TestCheckoutData);
  },

  // ── Page object fixtures ───────────────────────────────────────────────────

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await use(loginPage);
  },

  inventoryPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await performLogin(loginPage);

    const inventoryPage = new InventoryPage(page);
    // Wait for the inventory page to be ready before handing control to the test
    await inventoryPage.assertPageLoaded();
    await use(inventoryPage);
  },

  cartPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await performLogin(loginPage);

    const cartPage = new CartPage(page);
    await cartPage.navigate();
    await use(cartPage);
  },

  checkoutInfoPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await performLogin(loginPage);

    const checkoutInfoPage = new CheckoutInformationPage(page);
    await use(checkoutInfoPage);
  },

  checkoutOverviewPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await performLogin(loginPage);

    const checkoutOverviewPage = new CheckoutOverviewPage(page);
    await use(checkoutOverviewPage);
  },

  checkoutCompletePage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await performLogin(loginPage);

    const checkoutCompletePage = new CheckoutCompletePage(page);
    await use(checkoutCompletePage);
  },
});

/**
 * Re-export Playwright's expect so tests only need to import from this module.
 */
export { expect } from '@playwright/test';
