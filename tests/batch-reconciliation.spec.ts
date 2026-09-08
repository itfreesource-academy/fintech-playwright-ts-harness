import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage.js';
import { ReconciliationPage } from '../src/pages/ReconciliationPage.js';

test.describe('End-of-Day Account Reconciliation & Batch Sweep Suite', () => {
  let loginPage: LoginPage;
  let reconcilePage: ReconciliationPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    reconcilePage = new ReconciliationPage(page);

    await loginPage.goto();
    await loginPage.login();
  });

  test('Batch Reconciliation - Verifies ledger vs pooling sweep produces 0 discrepancies and BALANCED status', async () => {
    const reportText = await reconcilePage.executeReconciliation();

    expect(reportText).toContain('[RECONCILIATION RUN COMPLETED]');
    expect(reportText).toContain('BALANCED (0 Discrepancies)');
    expect(reportText).toContain('Batch ID: BATCH-');
  });
});
