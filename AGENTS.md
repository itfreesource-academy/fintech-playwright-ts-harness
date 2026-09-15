# AGENTS.md: FinTech Playwright TypeScript Test Harness Context Guide

This repository contains **`fintech-playwright-ts-harness`**, an enterprise-grade **Playwright + TypeScript** end-to-end test automation platform engineered to validate mission-critical financial user journeys, strict transactional idempotency, real-time WebSocket feeds, asynchronous Kafka stream rendering, and OAuth 2.0 authentication flows.

---

## 🏛️ Architecture & Page Object Model (POM)

```
fintech-playwright-ts-harness/
├── src/
│   └── pages/
│       ├── BasePage.ts           # Shared locator abstractions, auto-waiting, screenshot capture
│       ├── LoginPage.ts          # OAuth 2.0 simulation, client credentials, JWT storage
│       ├── DashboardPage.ts      # Account balance widgets, quick transfer inputs, currency toggle
│       ├── LedgerPage.ts         # Transaction ledger table assertions, idempotent badge checks
│       ├── KafkaStreamPage.ts    # Asynchronous WebSocket/Kafka virtual stream inspector
│       └── ReconciliationPage.ts # End-of-day bank batch account audit sweep simulator
├── tests/
│   ├── auth.spec.ts              # OAuth 2.0 authentication & token expiry specs
│   ├── payment-idempotency.spec.ts # Idempotency replay testing (asserting no double-debits)
│   ├── kafka-stream.spec.ts      # Event-driven stream arrival & payload schema assertions
│   └── batch-reconciliation.spec.ts # Multi-account pooling balance sweep assertions
├── infra/                        # Docker, BrowserStack, and grid configurations
├── playwright.config.ts          # Multi-browser matrix (Chromium, Firefox, WebKit), retries, traces
├── Jenkinsfile                   # Declarative CI pipeline referencing fintech-jenkins-shared-library
└── package.json                  # Scripts & Playwright test runner dependencies
```

---

## 🚀 Commands & Test Execution

```bash
npm install                     # Install test framework dependencies
npx playwright install --with-deps # Install browser binaries (Chromium, Firefox, WebKit)

# Run full test suite in headless mode
npm test

# Run tests in UI mode (Interactive Playwright Test Runner)
npm run test:ui

# Run specific browser targets
npm run test:chromium
npm run test:firefox
npm run test:webkit

# View HTML Test Report & Traces
npm run report
```

---

## 🎯 Target System Under Test (SUT)

- Primary Target: **[fintech-payment-portal](https://github.com/itfreesource-academy/fintech-payment-portal)**
- Automated Scenarios:
  1. **Financial Idempotency**: Asserts that re-sending identical `Idempotency-Key` headers yields `200 OK` cached receipts without double-debiting balances.
  2. **Kafka Asynchronous Stream**: Asserts `PAYMENT_SETTLED` and `IDEMPOTENT_RETRY_DETECTED` events.
  3. **Zero-Flake Assertions**: Uses Playwright's built-in auto-waiting and web-first assertions (`expect(locator).toBeVisible()`).
