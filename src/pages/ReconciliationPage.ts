import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage.js';

/**
 * Page Object for End-of-Day Account Reconciliation.
 */
export class ReconciliationPage extends BasePage {
  readonly tabReconcileBtn: Locator;
  readonly runReconcileBtn: Locator;
  readonly outputBox: Locator;

  constructor(page: Page) {
    super(page);
    this.tabReconcileBtn = page.locator('button[data-tab="tab-reconcile"]');
    this.runReconcileBtn = page.locator('#btn-run-reconciliation');
    this.outputBox = page.locator('#reconcile-output');
  }

  async open(): Promise<void> {
    await this.tabReconcileBtn.click();
  }

  async executeReconciliation(): Promise<string> {
    await this.open();
    await this.runReconcileBtn.click();
    return (await this.outputBox.innerText()).trim();
  }
}
