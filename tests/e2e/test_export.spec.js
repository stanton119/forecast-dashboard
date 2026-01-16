import { test, expect } from '@playwright/test';
import mockForecastData from './mock-forecast-data.json'; // Import mock data

test.beforeEach(async ({ page }) => {
  // Intercept BBC weather API calls and return mock data
  await page.route('https://weather-broker-cdn.api.bbci.co.uk/**/*', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockForecastData),
    });
  });
});

test('Data table and CSV export functionality', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle'); // Wait for network to be idle after page load

  // Verify data table is present
  const dataTable = page.locator('#data-table');
  await expect(dataTable).toBeVisible();

  // Verify CSV export button is present and clickable
  const exportButton = page.locator('#export-csv-button');
  await expect(exportButton).toBeVisible();
  await expect(exportButton).toBeEnabled({ timeout: 10000 }); // Add timeout for robustness

  // Simulate click and verify download (this part will need further implementation)
  // For now, just click the button
  await exportButton.click();

  // More sophisticated checks for file download and content will go here
  // For example:
  // const [ download ] = await Promise.all([
  //   page.waitForEvent('download'),
  //   exportButton.click()
  // ]);
  // const path = await download.path();
  // expect(path).toBeTruthy();
});
