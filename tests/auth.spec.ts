import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage.js';
import { DashboardPage } from '../src/pages/DashboardPage.js';

test.describe('OAuth 2.0 Identity & Access Management Suite', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.goto();
  });

  test('Security Gate - Displays OAuth modal when unauthenticated', async () => {
    // Check modal is presented with credentials input
    const isVisible = await loginPage.isModalVisible();
    expect(isVisible).toBeTruthy();
    await expect(loginPage.authModal).toBeVisible();
    await expect(loginPage.clientIdInput).toHaveValue('vishal.sdet@defendloop.io');
  });

  test('OAuth Authentication - Logs in with Client Credentials & generates Bearer token', async () => {
    await loginPage.login('vishal.sdet@defendloop.io', 'MoniepointQuality2026!');
    const status = await loginPage.getAuthStatus();
    expect(status).toContain('OAuth 2.0: Active (Bearer)');

    // Modal should no longer be visible
    expect(await loginPage.isModalVisible()).toBeFalsy();
  });

  test('Session Termination - Logout clears Bearer token and locks portal', async () => {
    await loginPage.login();
    await loginPage.logout();
    expect(await loginPage.isModalVisible()).toBeTruthy();
  });
});
