import { type Page } from '@playwright/test';
import { test, expect } from '../../fixtures/testFixtures';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutInformationPage } from '../../pages/CheckoutInformationPage';
import { CheckoutOverviewPage } from '../../pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from '../../pages/CheckoutCompletePage';
import { ERROR_MESSAGES, ROUTES } from '../../types';

/**
 * Checkout Test Suite
 *
 * End-to-end validation of the complete checkout workflow.
 *
 * Workflow:
 *   Login → Select Product → Add to Cart → Open Cart
 *         → Enter Customer Info → Review Order → Complete Order
 *
 * Tags:
 *   @smoke   — Happy-path e2e checkout
 *   @e2e     — Full end-to-end flow
 *   @regression — All checkout scenarios including negative paths
 *
 * All tests start from a pre-authenticated session via the inventoryPage fixture.
 */
test.describe('Checkout', () => {
  /**
   * Helper: performs the add-to-cart → navigate to cart → proceed to checkout
   * flow, returning the CheckoutInformationPage object.
   *
   * Extracted to avoid repeating this setup across every checkout test.
   */
  async function navigateToCheckoutInfo(
    page: Page,
    inventoryPage: InventoryPage,
    productName = 'Sauce Labs Backpack',
  ): Promise<CheckoutInformationPage> {
    await inventoryPage.addProductToCart(productName);
    await inventoryPage.goToCart();

    const cartPage = new CartPage(page);
    await cartPage.proceedToCheckout();

    return new CheckoutInformationPage(page);
  }

  // ── Smoke / E2E Tests ──────────────────────────────────────────────────────

  test(
    'should complete a full checkout successfully @smoke @e2e @regression',
    async ({ page, inventoryPage, testCheckoutData }) => {
      const PRODUCT = 'Sauce Labs Backpack';

      // Step 1: Add product and navigate to checkout
      const checkoutInfoPage = await navigateToCheckoutInfo(page, inventoryPage, PRODUCT);

      // Step 2: Fill customer information
      await checkoutInfoPage.fillAndContinue(testCheckoutData.validCustomer);

      // Step 3: Verify overview and finish
      const overviewPage = new CheckoutOverviewPage(page);
      await overviewPage.assertPageLoaded();
      await overviewPage.assertProductInOverview(PRODUCT);
      await overviewPage.assertTotalsAreCorrect();
      await overviewPage.finishOrder();

      // Step 4: Verify confirmation
      const completePage = new CheckoutCompletePage(page);
      await completePage.assertOrderCompleted();
    },
  );

  // ── Checkout Information Validation ───────────────────────────────────────

  test.describe('Checkout Information', () => {
    test(
      'should display error when first name is missing @regression',
      async ({ page, inventoryPage, testCheckoutData }) => {
        const checkoutInfoPage = await navigateToCheckoutInfo(page, inventoryPage);
        await checkoutInfoPage.fillCheckoutForm(testCheckoutData.missingFirstName);
        await checkoutInfoPage.continueCheckout();
        await checkoutInfoPage.assertErrorMessage(ERROR_MESSAGES.firstNameRequired);
      },
    );

    test(
      'should display error when last name is missing @regression',
      async ({ page, inventoryPage, testCheckoutData }) => {
        const checkoutInfoPage = await navigateToCheckoutInfo(page, inventoryPage);
        await checkoutInfoPage.fillCheckoutForm(testCheckoutData.missingLastName);
        await checkoutInfoPage.continueCheckout();
        await checkoutInfoPage.assertErrorMessage(ERROR_MESSAGES.lastNameRequired);
      },
    );

    test(
      'should display error when postal code is missing @regression',
      async ({ page, inventoryPage, testCheckoutData }) => {
        const checkoutInfoPage = await navigateToCheckoutInfo(page, inventoryPage);
        await checkoutInfoPage.fillCheckoutForm(testCheckoutData.missingPostalCode);
        await checkoutInfoPage.continueCheckout();
        await checkoutInfoPage.assertErrorMessage(ERROR_MESSAGES.postalCodeRequired);
      },
    );

    test(
      'should cancel checkout and return to cart @regression',
      async ({ page, inventoryPage, testCheckoutData }) => {
        const checkoutInfoPage = await navigateToCheckoutInfo(page, inventoryPage);
        await checkoutInfoPage.cancelCheckout();
        await expect(page).toHaveURL(new RegExp(ROUTES.cart));
      },
    );

    test(
      'should remain on checkout info page after submitting with invalid data @regression',
      async ({ page, inventoryPage, testCheckoutData }) => {
        const checkoutInfoPage = await navigateToCheckoutInfo(page, inventoryPage);
        await checkoutInfoPage.fillCheckoutForm(testCheckoutData.missingFirstName);
        await checkoutInfoPage.continueCheckout();
        await checkoutInfoPage.assertOnPage(ROUTES.checkoutInformation);
      },
    );
  });

  // ── Checkout Overview Validation ──────────────────────────────────────────

  test.describe('Checkout Overview', () => {
    test(
      'should display correct product in order overview @regression',
      async ({ page, inventoryPage, testCheckoutData }) => {
        const PRODUCT = 'Sauce Labs Fleece Jacket';
        const checkoutInfoPage = await navigateToCheckoutInfo(page, inventoryPage, PRODUCT);
        await checkoutInfoPage.fillAndContinue(testCheckoutData.validCustomer);

        const overviewPage = new CheckoutOverviewPage(page);
        await overviewPage.assertPageLoaded();
        await overviewPage.assertProductInOverview(PRODUCT);
      },
    );

    test(
      'should display tax and total that mathematically add up @regression',
      async ({ page, inventoryPage, testCheckoutData }) => {
        const checkoutInfoPage = await navigateToCheckoutInfo(page, inventoryPage);
        await checkoutInfoPage.fillAndContinue(testCheckoutData.validCustomer);

        const overviewPage = new CheckoutOverviewPage(page);
        await overviewPage.assertPageLoaded();
        await overviewPage.assertTotalsAreCorrect();
      },
    );

    test(
      'should cancel from overview and return to inventory @regression',
      async ({ page, inventoryPage, testCheckoutData }) => {
        const checkoutInfoPage = await navigateToCheckoutInfo(page, inventoryPage);
        await checkoutInfoPage.fillAndContinue(testCheckoutData.validCustomer);

        const overviewPage = new CheckoutOverviewPage(page);
        await overviewPage.cancelOrder();

        await expect(page).toHaveURL(new RegExp(ROUTES.inventory));
      },
    );
  });

  // ── Order Completion ──────────────────────────────────────────────────────

  test.describe('Order Completion', () => {
    test(
      'should show confirmation header after completing an order @regression',
      async ({ page, inventoryPage, testCheckoutData }) => {
        const checkoutInfoPage = await navigateToCheckoutInfo(page, inventoryPage);
        await checkoutInfoPage.fillAndContinue(testCheckoutData.validCustomer);

        const overviewPage = new CheckoutOverviewPage(page);
        await overviewPage.finishOrder();

        const completePage = new CheckoutCompletePage(page);
        const header = await completePage.getConfirmationHeader();
        expect(header).toContain('Thank you for your order');
      },
    );

    test(
      'should navigate back to products from order confirmation @regression',
      async ({ page, inventoryPage, testCheckoutData }) => {
        const checkoutInfoPage = await navigateToCheckoutInfo(page, inventoryPage);
        await checkoutInfoPage.fillAndContinue(testCheckoutData.validCustomer);

        const overviewPage = new CheckoutOverviewPage(page);
        await overviewPage.finishOrder();

        const completePage = new CheckoutCompletePage(page);
        await completePage.backToProducts();

        await expect(page).toHaveURL(new RegExp(ROUTES.inventory));
      },
    );
  });
});
