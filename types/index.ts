/**
 * Shared TypeScript Interfaces, Types, and Enums
 *
 * Central location for all domain types used across pages, fixtures,
 * test data, and tests. Keeping types here prevents circular imports
 * and makes the data model easy to discover.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Authentication
// ─────────────────────────────────────────────────────────────────────────────

/** A user credential pair used for login */
export interface UserCredentials {
  username: string;
  password: string;
}

/** All test user accounts available in the test data */
export interface TestUsers {
  validUser: UserCredentials;
  lockedUser: UserCredentials;
  performanceGlitchUser: UserCredentials;
  invalidUser: UserCredentials;
  emptyUser: UserCredentials;
}

// ─────────────────────────────────────────────────────────────────────────────
// Checkout
// ─────────────────────────────────────────────────────────────────────────────

/** Customer information required during the checkout flow */
export interface CheckoutData {
  firstName: string;
  lastName: string;
  postalCode: string;
}

/** All checkout data sets available in the test data */
export interface TestCheckoutData {
  validCustomer: CheckoutData;
  missingFirstName: CheckoutData;
  missingLastName: CheckoutData;
  missingPostalCode: CheckoutData;
}

// ─────────────────────────────────────────────────────────────────────────────
// Products
// ─────────────────────────────────────────────────────────────────────────────

/** Represents a product displayed on the inventory page */
export interface Product {
  name: string;
  price: number;
  description?: string;
}

/** Represents a product item inside the shopping cart */
export interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Sorting
// ─────────────────────────────────────────────────────────────────────────────

/** Available sort options on the inventory page */
export enum SortOption {
  NameAscending = 'az',
  NameDescending = 'za',
  PriceLowToHigh = 'lohi',
  PriceHighToLow = 'hilo',
}

/** Human-readable labels for each sort option (matches the UI dropdown text) */
export const SORT_OPTION_LABELS: Record<SortOption, string> = {
  [SortOption.NameAscending]: 'Name (A to Z)',
  [SortOption.NameDescending]: 'Name (Z to A)',
  [SortOption.PriceLowToHigh]: 'Price (low to high)',
  [SortOption.PriceHighToLow]: 'Price (high to low)',
};

// ─────────────────────────────────────────────────────────────────────────────
// Navigation
// ─────────────────────────────────────────────────────────────────────────────

/** Known application route paths */
export const ROUTES = {
  home: '/',
  inventory: '/inventory.html',
  cart: '/cart.html',
  checkoutInformation: '/checkout-step-one.html',
  checkoutOverview: '/checkout-step-two.html',
  checkoutComplete: '/checkout-complete.html',
} as const;

/** Type representing a valid application route */
export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

// ─────────────────────────────────────────────────────────────────────────────
// Error Messages
// ─────────────────────────────────────────────────────────────────────────────

/** Known error messages produced by the application */
export const ERROR_MESSAGES = {
  lockedUser: 'Epic sadface: Sorry, this user has been locked out.',
  invalidCredentials: 'Epic sadface: Username and password do not match any user in this service',
  usernameRequired: 'Epic sadface: Username is required',
  passwordRequired: 'Epic sadface: Password is required',
  firstNameRequired: "Error: First Name is required",
  lastNameRequired: "Error: Last Name is required",
  postalCodeRequired: "Error: Postal Code is required",
} as const;

/** Type representing a known application error message */
export type ErrorMessage = (typeof ERROR_MESSAGES)[keyof typeof ERROR_MESSAGES];
