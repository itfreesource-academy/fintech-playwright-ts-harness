import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage.js';
import { DashboardPage } from '../src/pages/DashboardPage.js';
import { KafkaStreamPage } from '../src/pages/KafkaStreamPage.js';

test.describe('Kafka Event Stream & Asynchronous Pub/Sub Inspector Suite', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let kafkaPage: KafkaStreamPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    kafkaPage = new KafkaStreamPage(page);

    await loginPage.goto();
    await loginPage.login();
  });

  test('Event Streaming - Emits PAYMENT_SETTLED event with JSON payload to Kafka inspector', async () => {
    // Initiate payment
    await dashboardPage.submitPayment('ACC-KAFKA-CONSUMER', '125.50', 'USD', 'Kafka stream test');
    await expect(dashboardPage.responseBadge).toContainText('201 CREATED');

    // Switch to Kafka Event Stream tab
    await kafkaPage.open();

    // Verify stream contains events
    const count = await kafkaPage.getMessageCount();
    expect(count).toBeGreaterThan(0);

    // Verify latest event metadata and JSON payload
    const latestEvent = await kafkaPage.getLatestEvent();
    expect(latestEvent.header).toContain('Event: PAYMENT_SETTLED');
    expect(latestEvent.payload.amount).toBe(125.50);
    expect(latestEvent.payload.currency).toBe('USD');
    expect(latestEvent.payload.destinationAccount).toBe('ACC-KAFKA-CONSUMER');
  });

  test('Audit Stream - Duplicate retry publishes IDEMPOTENT_RETRY_DETECTED audit event', async () => {
    // Submit payment and trigger duplicate
    await dashboardPage.submitPayment('ACC-KAFKA-DEDUP', '90.00', 'USD', 'Dedup test');
    await dashboardPage.triggerDuplicatePaymentTest();

    // Inspect Kafka stream
    await kafkaPage.open();
    const latestEvent = await kafkaPage.getLatestEvent();

    expect(latestEvent.header).toContain('Event: IDEMPOTENT_RETRY_DETECTED');
    expect(latestEvent.payload.action).toBe('DUPLICATE_DROP_SUCCESS');
  });
});
