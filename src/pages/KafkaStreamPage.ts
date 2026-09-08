import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage.js';

export interface KafkaMessage {
  header: string;
  payload: Record<string, any>;
}

/**
 * Page Object for real-time Kafka Event Stream Inspector.
 */
export class KafkaStreamPage extends BasePage {
  readonly tabKafkaBtn: Locator;
  readonly messageBoxes: Locator;
  readonly clearStreamBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.tabKafkaBtn = page.locator('button[data-tab="tab-kafka"]');
    this.messageBoxes = page.locator('#kafka-stream-container .kafka-message-box');
    this.clearStreamBtn = page.locator('#btn-clear-kafka');
  }

  async open(): Promise<void> {
    await this.tabKafkaBtn.click();
  }

  async getMessageCount(): Promise<number> {
    await this.open();
    return await this.messageBoxes.count();
  }

  async getLatestEvent(): Promise<KafkaMessage> {
    await this.open();
    const firstBox = this.messageBoxes.first();
    const header = (await firstBox.locator('.kafka-msg-header').innerText()).trim();
    const payloadText = (await firstBox.locator('.kafka-msg-body').innerText()).trim();
    return {
      header,
      payload: JSON.parse(payloadText),
    };
  }
}
