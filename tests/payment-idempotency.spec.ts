import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage.js';
import { DashboardPage } from '../src/pages/DashboardPage.js';
import { LedgerPage } from '../src/pages/LedgerPage.js';

test.describe('FinTech Payment Processing & Idempotency Test Suite', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let ledgerPage: LedgerPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    ledgerPage = new LedgerPage(page);

    await loginPage.goto();
    await loginPage.login();
  });

  test('Payment Settlement - Submits new transaction and updates ledger with 201 Created', async () => {
    const initialTxCount = await dashboardPage.getSettledTransactionCount();
    const initialKey = await dashboardPage.getIdempotencyKey();

    // Submit payment
    await dashboardPage.submitPayment('ACC-MONIEPOINT-QA-991', '750.00', 'USD', 'Vendor sprint settlement');

    // Assert status badge updates
    const badgeText = await dashboardPage.getResponseBadgeText();
    expect(badgeText).toContain('201 CREATED');

    // Assert transaction count increased by 1
    const newTxCount = await dashboardPage.getSettledTransactionCount();
    expect(newTxCount).toBe(initialTxCount + 1);

    // Assert fresh idempotency key is automatically generated
    const newKey = await dashboardPage.getIdempotencyKey();
    expect(newKey).not.toBe(initialKey);

    // Assert ledger table has new record on top
    const topRow = await ledgerPage.getFirstRow();
    expect(topRow.recipient).toBe('ACC-MONIEPOINT-QA-991');
    expect(topRow.amount).toContain('750.00 USD');
    expect(topRow.status).toBe('SETTLED');
  });

  test('Financial Idempotency Protection - Duplicate submission returns 200 OK cache hit without double-debiting balance', async () => {
    // 1. Submit initial payment to establish transaction
    await dashboardPage.submitPayment('ACC-MERCHANT-POOL', '300.00', 'USD', 'Initial payment');
    await expect(dashboardPage.responseBadge).toContainText('201 CREATED');

    // Record balance after first payment
    const balanceAfterFirst = await dashboardPage.getOperatingBalance();
    const txCountAfterFirst = await dashboardPage.getSettledTransactionCount();

    // 2. Trigger duplicate payment using exact same idempotency key
    await dashboardPage.triggerDuplicatePaymentTest();

    // 3. Verify response is 200 OK (Cache Hit)
    const badgeText = await dashboardPage.getResponseBadgeText();
    expect(badgeText).toContain('200 OK (IDEMPOTENT CACHE HIT)');

    // 4. Critical assertion: Operating balance is NOT debited twice!
    const balanceAfterDuplicate = await dashboardPage.getOperatingBalance();
    expect(balanceAfterDuplicate).toBe(balanceAfterFirst);

    // 5. Total unique transactions remain the same
    const txCountAfterDuplicate = await dashboardPage.getSettledTransactionCount();
    expect(txCountAfterDuplicate).toBe(txCountAfterFirst);
  });
});
