import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage.js';

/**
 * Page Object for OAuth 2.0 Client Credentials Login Modal.
 */
export class LoginPage extends BasePage {
  readonly authModal: Locator;
  readonly clientIdInput: Locator;
  readonly clientSecretInput: Locator;
  readonly scopeInput: Locator;
  readonly submitButton: Locator;
  readonly authPill: Locator;
  readonly authStatusText: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.authModal = page.locator('#auth-modal');
    this.clientIdInput = page.locator('#auth-client-id');
    this.clientSecretInput = page.locator('#auth-secret');
    this.scopeInput = page.locator('#auth-scope');
    this.submitButton = page.locator('#btn-login-submit');
    this.authPill = page.locator('#auth-pill');
    this.authStatusText = page.locator('#auth-status-text');
    this.logoutButton = page.locator('#btn-logout');
  }

  async isModalVisible(): Promise<boolean> {
    return await this.authModal.isVisible();
  }

  async login(clientId: string = 'vishal.sdet@defendloop.io', clientSecret: string = 'MoniepointQuality2026!'): Promise<void> {
    if (await this.isModalVisible()) {
      await this.clientIdInput.fill(clientId);
      await this.clientSecretInput.fill(clientSecret);
      await this.submitButton.click();
      await expect(this.authModal).not.toHaveClass(/show/);
    }
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
    await expect(this.authModal).toHaveClass(/show/);
  }

  async getAuthStatus(): Promise<string> {
    return (await this.authStatusText.innerText()).trim();
  }
}
