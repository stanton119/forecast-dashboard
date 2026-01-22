// tests/e2e/test_scrolling_view.spec.js
import { test, expect } from '@playwright/test';
import mockForecastData from './mock-forecast-data.json';

test.describe('Scrolling Data View', () => {
  test.beforeEach(async ({ page }) => {
    // Intercept BBC weather API calls and return mock data
    await page.route('https://weather-broker-cdn.api.bbci.co.uk/**/*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockForecastData),
      });
    });

    await page.goto('/?postcode=SW7');
    // Wait for the data to be loaded and the table to be visible
    await page.waitForSelector('#data-table');
  });

  test('should display the data table within a scrollable container', async ({ page }) => {
    const scrollableContainer = page.locator('#data-table-container');

    // 1. Check if the CSS properties for scrolling are applied
    await expect(scrollableContainer).toHaveCSS('overflow-y', 'auto');

    // 2. Check if the content is actually overflowing
    const scrollHeight = await scrollableContainer.evaluate(node => node.scrollHeight);
    const clientHeight = await scrollableContainer.evaluate(node => node.clientHeight);

    // Add a small wait to ensure rendering is complete before the check
    await page.waitForTimeout(200);

    expect(scrollHeight).toBeGreaterThan(clientHeight);

    // 3. Check if the container's height is less than the table's height
    const dataTable = page.locator('#data-table');
    const containerHeight = await scrollableContainer.boundingBox().then(box => box.height);
    const tableHeight = await dataTable.boundingBox().then(box => box.height);
    expect(containerHeight).toBeLessThan(tableHeight);
  });
});