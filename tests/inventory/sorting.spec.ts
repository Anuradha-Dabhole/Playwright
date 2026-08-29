import { test, expect } from '../../fixtures/testFixtures';
import { SortOption } from '../../types';
import {
  sortStringsAscending,
  sortStringsDescending,
  sortNumbersAscending,
  sortNumbersDescending,
  isSortedAscending,
  isSortedDescending,
} from '../../utils/helpers';

/**
 * Product Sorting Test Suite
 *
 * Validates that each sort option correctly reorders products on the
 * inventory page. Tests extract the actual rendered order from the DOM
 * and compare it against the programmatically computed expected order.
 *
 * Tags:
 *   @regression — Full sorting validation; not a smoke-level concern
 *
 * All tests receive a pre-authenticated inventoryPage fixture.
 */
test.describe('Product Sorting', () => {
  test('should sort products by Name (A to Z) @regression', async ({ inventoryPage }) => {
    // Get the unsorted names first to build the expected sorted order
    const unsortedNames = await inventoryPage.getProductNames();

    await inventoryPage.selectSortOption(SortOption.NameAscending);

    const sortedNames = await inventoryPage.getProductNames();
    const expectedOrder = sortStringsAscending(unsortedNames);

    expect(sortedNames).toEqual(expectedOrder);
    expect(isSortedAscending(sortedNames)).toBe(true);
  });

  test('should sort products by Name (Z to A) @regression', async ({ inventoryPage }) => {
    const unsortedNames = await inventoryPage.getProductNames();

    await inventoryPage.selectSortOption(SortOption.NameDescending);

    const sortedNames = await inventoryPage.getProductNames();
    const expectedOrder = sortStringsDescending(unsortedNames);

    expect(sortedNames).toEqual(expectedOrder);
    expect(isSortedDescending(sortedNames)).toBe(true);
  });

  test('should sort products by Price (low to high) @regression', async ({ inventoryPage }) => {
    const unsortedPrices = await inventoryPage.getProductPrices();

    await inventoryPage.selectSortOption(SortOption.PriceLowToHigh);

    const sortedPrices = await inventoryPage.getProductPrices();
    const expectedOrder = sortNumbersAscending(unsortedPrices);

    expect(sortedPrices).toEqual(expectedOrder);
    expect(isSortedAscending(sortedPrices)).toBe(true);
  });

  test('should sort products by Price (high to low) @regression', async ({ inventoryPage }) => {
    const unsortedPrices = await inventoryPage.getProductPrices();

    await inventoryPage.selectSortOption(SortOption.PriceHighToLow);

    const sortedPrices = await inventoryPage.getProductPrices();
    const expectedOrder = sortNumbersDescending(unsortedPrices);

    expect(sortedPrices).toEqual(expectedOrder);
    expect(isSortedDescending(sortedPrices)).toBe(true);
  });

  test('should default to Name (A to Z) sort order on page load @regression', async ({
    inventoryPage,
  }) => {
    const names = await inventoryPage.getProductNames();
    // The default sort on SauceDemo is A→Z
    expect(isSortedAscending(names)).toBe(true);
  });

  test('should preserve sort selection after re-sorting @regression', async ({
    inventoryPage,
  }) => {
    // Sort Z→A then switch to low→high and verify the final state is correct
    await inventoryPage.selectSortOption(SortOption.NameDescending);
    await inventoryPage.selectSortOption(SortOption.PriceLowToHigh);

    const prices = await inventoryPage.getProductPrices();
    expect(isSortedAscending(prices)).toBe(true);
  });
});
