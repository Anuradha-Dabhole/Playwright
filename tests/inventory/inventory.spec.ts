import { test, expect } from '../../fixtures/testFixtures';

/**
 * Inventory Test Suite
 *
 * Validates the product listing page functionality:
 * page load, product display, add/remove items, cart badge updates.
 *
 * Tags:
 *   @smoke      — Verifies page loads and add-to-cart works
 *   @regression — Full inventory functionality coverage
 *
 * All tests receive a pre-authenticated inventoryPage fixture, so no
 * login boilerplate is required here.
 */
test.describe('Inventory', () => {
  // ── Smoke Tests ────────────────────────────────────────────────────────────

  test('should display the inventory page with products after login @smoke @regression', async ({
    inventoryPage,
  }) => {
    await inventoryPage.assertPageLoaded();
    await inventoryPage.assertProductsVisible();
  });

  test('should add a product to the cart from the inventory page @smoke @regression', async ({
    inventoryPage,
  }) => {
    const PRODUCT = 'Sauce Labs Backpack';

    await inventoryPage.addProductToCart(PRODUCT);

    await inventoryPage.assertCartBadgeCount(1);
  });

  // ── Regression Tests ───────────────────────────────────────────────────────

  test('should display six products on the inventory page @regression', async ({
    inventoryPage,
  }) => {
    const count = await inventoryPage.getProductCount();
    expect(count).toBe(6);
  });

  test('should display product names and prices @regression', async ({ inventoryPage }) => {
    const products = await inventoryPage.getProducts();
    expect(products.length).toBeGreaterThan(0);

    for (const product of products) {
      expect(product.name).toBeTruthy();
      expect(product.price).toBeGreaterThan(0);
    }
  });

  test('should add multiple products to the cart and update badge count @regression', async ({
    inventoryPage,
  }) => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.assertCartBadgeCount(1);

    await inventoryPage.addProductToCart('Sauce Labs Bike Light');
    await inventoryPage.assertCartBadgeCount(2);

    await inventoryPage.addProductToCart('Sauce Labs Bolt T-Shirt');
    await inventoryPage.assertCartBadgeCount(3);
  });

  test('should remove a product from the cart via the inventory page @regression', async ({
    inventoryPage,
  }) => {
    const PRODUCT = 'Sauce Labs Backpack';

    await inventoryPage.addProductToCart(PRODUCT);
    await inventoryPage.assertCartBadgeCount(1);

    await inventoryPage.removeProductFromCart(PRODUCT);
    await inventoryPage.assertCartBadgeCount(0);
  });

  test('should not show cart badge when no products have been added @regression', async ({
    inventoryPage,
  }) => {
    await expect(inventoryPage.header.cartBadge).not.toBeVisible();
  });

  test('should navigate to the cart when the cart icon is clicked @regression', async ({
    inventoryPage,
    page,
  }) => {
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/cart\.html/);
  });
});
