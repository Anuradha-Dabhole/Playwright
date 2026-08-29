# SauceDemo Playwright Test Automation Framework

A professional, industry-grade end-to-end test automation framework built with **Playwright** and **TypeScript** for the [Sauce Demo](https://www.saucedemo.com/) e-commerce application.

---

## 📋 Overview

This framework demonstrates real-world automation engineering practices including:

- **Page Object Model (POM)** with a clean, layered architecture
- **Component Object Model** for shared UI elements
- **Custom Playwright Fixtures** for zero-boilerplate test setup
- **Typed Test Data** managed in JSON files (no hardcoded values in tests)
- **Environment-aware Configuration** supporting DEV / QA / STAGING / PRODUCTION
- **Cross-browser Testing** on Chromium, Firefox, and WebKit
- **Test Categorisation** via `@smoke`, `@regression`, and `@e2e` tags
- **Parallel Execution** with fully independent tests
- **CI/CD Integration** via GitHub Actions

---

## 📁 Project Structure

```
SauceLabTestFramework/
│
├── .github/workflows/
│   └── playwright.yml          # GitHub Actions CI workflow
│
├── config/
│   └── environments.ts         # Typed environment configs
│
├── components/
│   └── HeaderComponent.ts      # Shared app header (cart badge, nav menu)
│
├── fixtures/
│   └── testFixtures.ts         # Custom Playwright fixtures
│
├── pages/
│   ├── BasePage.ts             # Abstract base page
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   ├── CheckoutInformationPage.ts
│   ├── CheckoutOverviewPage.ts
│   └── CheckoutCompletePage.ts
│
├── test-data/
│   ├── users.json              # Login credentials
│   └── checkoutData.json       # Customer checkout data
│
├── tests/
│   ├── login/login.spec.ts
│   ├── inventory/inventory.spec.ts
│   ├── inventory/sorting.spec.ts
│   ├── cart/cart.spec.ts
│   └── checkout/checkout.spec.ts
│
├── types/
│   └── index.ts                # Shared TypeScript interfaces, enums, constants
│
├── utils/
│   ├── logger.ts               # Structured logging utility
│   ├── helpers.ts              # Pure utility functions
│   └── environment.ts          # Environment variable accessor
│
├── .env                        # Local config (gitignored)
├── .env.example                # Template — copy to .env
├── playwright.config.ts        # Central Playwright configuration
├── tsconfig.json               # TypeScript strict-mode config
├── .eslintrc.json              # ESLint rules
└── .prettierrc                 # Prettier formatting rules
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v20 or higher
- **npm** v9 or higher

### Installation

```bash
# 1. Install project dependencies
npm install

# 2. Install Playwright browsers
npx playwright install

# 3. Copy the environment template
cp .env.example .env
```

The `.env` file is pre-configured to target `https://www.saucedemo.com`. No changes are needed for local runs.

---

## 🧪 Running Tests

### Run all tests

```bash
npm test
```

### Run by tag

```bash
# Smoke tests only (fast — Chromium, subset of tests)
npm run test:smoke

# Full regression suite
npm run test:regression

# End-to-end tests
npm run test:e2e
```

### Run by browser

```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

### Debug / Interactive modes

```bash
# Run tests headed (browser visible)
npm run test:headed

# Debug a specific test with Playwright Inspector
npm run test:debug

# Use Playwright's interactive UI mode
npm run test:ui
```

### View the HTML report

```bash
npm run report
```

---

## 🔧 Configuration

All configuration is centralised in [`playwright.config.ts`](./playwright.config.ts).

| Setting | Local | CI |
|---|---|---|
| Retries | 0 | 2 |
| Workers | Auto | 2 |
| Video | Off | On failure |
| Trace | On first retry | On first retry |
| Screenshots | On failure | On failure |

### Environment Variables

Copy `.env.example` to `.env` and adjust as needed:

| Variable | Default | Description |
|---|---|---|
| `TEST_ENVIRONMENT` | `qa` | Target environment (`dev`, `qa`, `staging`, `production`) |
| `BASE_URL` | `https://www.saucedemo.com` | Application URL override |
| `BROWSER` | `chromium` | Default browser |
| `HEADLESS` | `true` | Headless mode |

---

## 🏗️ Architecture

### Layered Design

```
Test Spec
   ↓
Fixture (provides pre-built page objects)
   ↓
Page Object / Component
   ↓
Playwright Actions
   ↓
Application Under Test
```

### Test Data Flow

```
tests/
  ↓ imports fixtures from
fixtures/testFixtures.ts
  ↓ constructs
pages/*.ts
  ↓ uses data from
test-data/*.json
  ↓ typed by
types/index.ts
```

---

## 🧩 Test Suites

| Suite | Tag | Browsers | Trigger |
|---|---|---|---|
| Smoke | `@smoke` | Chromium | Every push |
| Regression | `@regression` | Chromium, Firefox, WebKit | Pull Requests |
| E2E | `@e2e` | Chromium, Firefox, WebKit | Pull Requests |

### Test Coverage

| Area | Tests |
|---|---|
| **Login** | Valid login, invalid credentials, locked user, empty fields, error dismissal |
| **Inventory** | Page load, product display, add/remove items, cart badge, navigation |
| **Sorting** | All 4 sort options validated programmatically against DOM order |
| **Cart** | Add/remove items, badge count, continue shopping, empty cart, persistence |
| **Checkout** | Full e2e flow, form validation (3 error states), totals arithmetic, cancel flows |

---

## 🛡️ Code Quality

```bash
# Run ESLint
npm run lint

# Auto-fix ESLint issues
npm run lint:fix

# Check Prettier formatting
npm run format:check

# Apply Prettier formatting
npm run format

# TypeScript type check (no emit)
npm run type-check
```

---

## 🤖 CI/CD

The GitHub Actions workflow (`.github/workflows/playwright.yml`) provides:

1. **Smoke job** — runs on every `push` to `main`/`develop` using Chromium
2. **Regression job** — runs on every `pull_request` across Chromium, Firefox, and WebKit in parallel
3. Both jobs upload HTML reports and test result artifacts on failure

---

## 📌 Key Design Decisions

| Decision | Rationale |
|---|---|
| Custom fixtures | Eliminate login/navigation boilerplate from every test |
| JSON test data | Single source of truth; no magic strings in specs |
| `types/index.ts` | Centralised type safety; eliminates scattered error string literals |
| `BasePage` abstract class | Shared `navigate()`, `assertOnPage()` without duplication |
| `HeaderComponent` | Cart badge, menu, logout are used on 5+ pages — component prevents duplication |
| Programmatic sort validation | Tests extract actual DOM order vs. only clicking the dropdown |
| `parsePrice()` helper | Reusable price parsing handles `$X.XX`, `Total: $X.XX`, etc. |
| `isSortedAscending/Descending()` | Boolean sorting predicates make assertions expressive and reusable |

---

## 🔮 Future Enhancements

The framework is designed to accommodate:

- [ ] API testing via Playwright `APIRequestContext`
- [ ] Visual regression testing
- [ ] Accessibility testing with `axe-core`
- [ ] Allure reporting integration
- [ ] Docker support for containerised CI
- [ ] Test sharding for faster parallel CI execution
- [ ] Slack / Teams failure notifications
