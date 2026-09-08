import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage.js';

export interface LedgerRowData {
  transactionId: string;
  idempotencyKey: string;
  recipient: string;
  amount: string;
  status: string;
  kafkaEvent: string;
  timestamp: string;
}

/**
 * Page Object for the Settled Transaction Ledger.
 */
export class LedgerPage extends BasePage {
  readonly tabLedgerBtn: Locator;
  readonly tableRows: Locator;
  readonly clearLedgerBtn: Locator;
  readonly exportLedgerBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.tabLedgerBtn = page.locator('button[data-tab="tab-ledger"]');
    this.tableRows = page.locator('#ledger-tbody tr');
    this.clearLedgerBtn = page.locator('#btn-clear-ledger');
    this.exportLedgerBtn = page.locator('#btn-export-ledger');
  }

  async open(): Promise<void> {
    await this.tabLedgerBtn.click();
  }

  async getRowCount(): Promise<number> {
    await this.open();
    return await this.tableRows.count();
  }

  async getFirstRow(): Promise<LedgerRowData> {
    await this.open();
    const row = this.tableRows.first();
    const cells = row.locator('td');
    return {
      transactionId: (await cells.nth(0).innerText()).trim(),
      idempotencyKey: (await cells.nth(1).innerText()).trim(),
      recipient: (await cells.nth(2).innerText()).trim(),
      amount: (await cells.nth(3).innerText()).trim(),
      status: (await cells.nth(4).innerText()).trim(),
      kafkaEvent: (await cells.nth(5).innerText()).trim(),
      timestamp: (await cells.nth(6).innerText()).trim(),
    };
  }
}
