import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage.js';

/**
 * Page Object for FinTech Payment Dashboard, Form Submission,
 * and Idempotency Verification Engine.
 */
export class DashboardPage extends BasePage {
  // Stats
  readonly balanceVal: Locator;
  readonly txCountVal: Locator;
  readonly eventCountVal: Locator;

  // Tabs
  readonly tabTransferBtn: Locator;
  readonly tabLedgerBtn: Locator;
  readonly tabKafkaBtn: Locator;
  readonly tabReconcileBtn: Locator;

  // Transfer Form
  readonly recipientInput: Locator;
  readonly amountInput: Locator;
  readonly currencySelect: Locator;
  readonly idempotencyKeyInput: Locator;
  readonly regenKeyBtn: Locator;
  readonly notesInput: Locator;
  readonly submitTransferBtn: Locator;
  readonly testDuplicateBtn: Locator;

  // Live Inspector Terminal
  readonly terminalOutput: Locator;
  readonly responseBadge: Locator;
  readonly terminalLatency: Locator;

  constructor(page: Page) {
    super(page);

    this.balanceVal = page.locator('#val-balance');
    this.txCountVal = page.locator('#val-tx-count');
    this.eventCountVal = page.locator('#val-event-count');

    this.tabTransferBtn = page.locator('button[data-tab="tab-transfer"]');
    this.tabLedgerBtn = page.locator('button[data-tab="tab-ledger"]');
    this.tabKafkaBtn = page.locator('button[data-tab="tab-kafka"]');
    this.tabReconcileBtn = page.locator('button[data-tab="tab-reconcile"]');

    this.recipientInput = page.locator('#recipient-account');
    this.amountInput = page.locator('#transfer-amount');
    this.currencySelect = page.locator('#transfer-currency');
    this.idempotencyKeyInput = page.locator('#idempotency-key');
    this.regenKeyBtn = page.locator('#btn-regen-key');
    this.notesInput = page.locator('#transfer-notes');
    this.submitTransferBtn = page.locator('#btn-submit-transfer');
    this.testDuplicateBtn = page.locator('#btn-simulate-duplicate');

    this.terminalOutput = page.locator('#terminal-output');
    this.responseBadge = page.locator('#response-status-badge');
    this.terminalLatency = page.locator('#terminal-latency');
  }

  async getOperatingBalance(): Promise<string> {
    return (await this.balanceVal.innerText()).trim();
  }

  async getSettledTransactionCount(): Promise<number> {
    const text = (await this.txCountVal.innerText()).trim();
    return parseInt(text, 10) || 0;
  }

  async getIdempotencyKey(): Promise<string> {
    return await this.idempotencyKeyInput.inputValue();
  }

  async regenerateIdempotencyKey(): Promise<string> {
    const oldKey = await this.getIdempotencyKey();
    await this.regenKeyBtn.click();
    await expect(this.idempotencyKeyInput).not.toHaveValue(oldKey);
    return await this.getIdempotencyKey();
  }

  async submitPayment(recipient: string, amount: string, currency: string = 'USD', notes: string = 'Automation run'): Promise<void> {
    await this.tabTransferBtn.click();
    await this.recipientInput.fill(recipient);
    await this.amountInput.fill(amount);
    await this.currencySelect.selectOption(currency);
    await this.notesInput.fill(notes);
    await this.submitTransferBtn.click();
  }

  async triggerDuplicatePaymentTest(): Promise<void> {
    await this.tabTransferBtn.click();
    await this.testDuplicateBtn.click();
  }

  async getResponseBadgeText(): Promise<string> {
    return (await this.responseBadge.innerText()).trim();
  }

  async getTerminalPayload(): Promise<Record<string, any>> {
    const text = await this.terminalOutput.innerText();
    return JSON.parse(text);
  }

  async openTab(tab: 'transfer' | 'ledger' | 'kafka' | 'reconcile'): Promise<void> {
    const tabMap = {
      transfer: this.tabTransferBtn,
      ledger: this.tabLedgerBtn,
      kafka: this.tabKafkaBtn,
      reconcile: this.tabReconcileBtn,
    };
    await tabMap[tab].click();
  }
}
