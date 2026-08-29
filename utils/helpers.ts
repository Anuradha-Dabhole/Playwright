/**
 * General-purpose Helper Functions
 *
 * Pure utility functions used across page objects and tests.
 * All functions here must be stateless and side-effect free.
 *
 * Design rule: Only add a helper when the same logic would otherwise
 * appear in more than one place. Simple one-liners belong inline.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Price Parsing
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parses a price string from the application UI into a numeric value.
 *
 * Handles formats such as:
 *   "$29.99"         → 29.99
 *   "Item total: $9.99"  → 9.99
 *   "Tax: $0.80"     → 0.80
 *   "Total: $10.79"  → 10.79
 *
 * @param priceText - Raw text containing a dollar amount
 * @returns Numeric price value, or 0 if no valid price is found
 */
export function parsePrice(priceText: string): number {
  const match = priceText.match(/\$?([\d]+\.[\d]{2})/);
  if (!match || !match[1]) return 0;
  return parseFloat(match[1]);
}

/**
 * Formats a number as a USD price string (e.g. 29.99 → "$29.99").
 *
 * @param price - Numeric price value
 * @returns Formatted price string with dollar sign
 */
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Array Sorting Helpers
// (Used in sorting tests to build expected sorted arrays for assertion)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns a new array of strings sorted alphabetically A → Z.
 * Does NOT mutate the original array.
 */
export function sortStringsAscending(items: string[]): string[] {
  return [...items].sort((a, b) => a.localeCompare(b));
}

/**
 * Returns a new array of strings sorted alphabetically Z → A.
 * Does NOT mutate the original array.
 */
export function sortStringsDescending(items: string[]): string[] {
  return [...items].sort((a, b) => b.localeCompare(a));
}

/**
 * Returns a new array of numbers sorted ascending (low → high).
 * Does NOT mutate the original array.
 */
export function sortNumbersAscending(numbers: number[]): number[] {
  return [...numbers].sort((a, b) => a - b);
}

/**
 * Returns a new array of numbers sorted descending (high → low).
 * Does NOT mutate the original array.
 */
export function sortNumbersDescending(numbers: number[]): number[] {
  return [...numbers].sort((a, b) => b - a);
}

// ─────────────────────────────────────────────────────────────────────────────
// Numeric Utilities
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Rounds a number to 2 decimal places.
 * Useful for comparing floating-point monetary values.
 *
 * @param value - The number to round
 */
export function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Returns a random integer between min and max (inclusive).
 *
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ─────────────────────────────────────────────────────────────────────────────
// Assertion Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns true when the provided array is sorted in ascending order.
 * Works for both strings and numbers.
 *
 * @param items - Array to check
 */
export function isSortedAscending<T extends string | number>(items: T[]): boolean {
  for (let i = 1; i < items.length; i++) {
    if (items[i - 1]! > items[i]!) return false;
  }
  return true;
}

/**
 * Returns true when the provided array is sorted in descending order.
 * Works for both strings and numbers.
 *
 * @param items - Array to check
 */
export function isSortedDescending<T extends string | number>(items: T[]): boolean {
  for (let i = 1; i < items.length; i++) {
    if (items[i - 1]! < items[i]!) return false;
  }
  return true;
}
