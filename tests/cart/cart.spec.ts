import { test, expect } from '../../fixtures/testFixtures';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { ROUTES } from '../../types';

/**
 * Shopping Cart Test Suite
 *
 * Validates cart state management: adding products, verifying items,
 * removing items, cart badge updates, and navigation flows.
 *
 * Tags:
 *   @smoke      — Core cart flows (add, view)
 *   @regression — Full cart scenario coverage
 *
 * Tests use the pre-authenticated cartPage and inventoryPage fixtures
 * where appropriate. Each test creates its own state to stay independent.
 */
test.describe('Shopping Cart', () => {
  // ── Smoke Tests ────────────────────────────────────────────────────────────

  test(
    'should display a product in the cart after adding it from inventory @smoke @regression',
    async ({ page, inventoryPage }) => {
      const PRODUCT = 'Sauce Labs Backpack';

      await inventoryPage.addProductToCart(PRODUCT);
      await inventoryPage.goToCart();

      const cartPage = new CartPage(page);
      await cartPage.assertItemInCart(PRODUCT);
    },
  );

  // ── Regression Tests ───────────────────────────────────────────────────────

  test('should display the correct item count after adding a single product @regression', async ({
    page,
    inventoryPage,
  }) => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();

    const cartPage = new CartPage(page);
    await cartPage.assertCartItemCount(1);
  });

  test('should display all items after adding multiple products @regression', async ({
    page,
    inventoryPage,
  }) => {
    const products = ['Sauce Labs Backpack', 'Sauce Labs Bike Light', 'Sauce Labs Bolt T-Shirt'];

    for (const product of products) {
      await inventoryPage.addProductToCart(product);
    }

    await inventoryPage.goToCart();
    const cartPage = new CartPage(page);
    await cartPage.assertCartItemCount(products.length);

    for (const product of products) {
      await cartPage.assertItemInCart(product);
    }
  });

  test('should remove an item from the cart @regression', async ({ page, inventoryPage }) => {
    const PRODUCT = 'Sauce Labs Backpack';

    await inventoryPage.addProductToCart(PRODUCT);
    await inventoryPage.goToCart();

    const cartPage = new CartPage(page);
    await cartPage.assertCartItemCount(1);
    await cartPage.removeItem(PRODUCT);
    await cartPage.assertCartIsEmpty();
  });

  test('should navigate back to inventory when Continue Shopping is clicked @regression', async ({
    page,
    inventoryPage,
  }) => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();

    const cartPage = new CartPage(page);
    await cartPage.continueShopping();

    await expect(page).toHaveURL(new RegExp(ROUTES.inventory));
  });

  test('should update cart badge count when items are added and removed @regression', async ({
    inventoryPage,
  }) => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.assertCartBadgeCount(1);

    await inventoryPage.addProductToCart('Sauce Labs Bike Light');
    await inventoryPage.assertCartBadgeCount(2);

    await inventoryPage.removeProductFromCart('Sauce Labs Backpack');
    await inventoryPage.assertCartBadgeCount(1);

    await inventoryPage.removeProductFromCart('Sauce Labs Bike Light');
    await inventoryPage.assertCartBadgeCount(0);
  });

  test('should navigate to checkout from the cart page @regression', async ({
    page,
    inventoryPage,
  }) => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();

    const cartPage = new CartPage(page);
    await cartPage.proceedToCheckout();

    await expect(page).toHaveURL(new RegExp(ROUTES.checkoutInformation));
  });

  test('should show empty cart when no products have been added @regression', async ({
    cartPage,
  }) => {
    await cartPage.assertCartIsEmpty();
  });

  test('should preserve cart items when returning from cart to inventory @regression', async ({
    page,
    inventoryPage,
  }) => {
    const PRODUCT = 'Sauce Labs Fleece Jacket';

    await inventoryPage.addProductToCart(PRODUCT);
    await inventoryPage.goToCart();

    const cartPage = new CartPage(page);
    await cartPage.continueShopping();

    // Return to cart and verify item is still there
    await inventoryPage.goToCart();
    await cartPage.assertItemInCart(PRODUCT);
  });
});
