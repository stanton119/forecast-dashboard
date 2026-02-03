import { test, expect } from '@playwright/test';
import mockForecastData from './mock-forecast-data.json';

test.describe('Auto-show forecast on page load', () => {
  // Mock the API call before each test
  test.beforeEach(async ({ page }) => {
    await page.route('https://weather-broker-cdn.api.bbci.co.uk/**/*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockForecastData),
      });
    });
  });

  test('shows default forecast when no URL parameters are present', async ({ page }) => {
    // 1. Given: Navigate to the root URL
    await page.goto('/');

    // 2. When: The page finishes loading
    // (Wait for the data table to be populated, which indicates the forecast has loaded)
    await expect(page.locator('tbody tr')).toHaveCount(mockForecastData.forecasts[0].detailed.reports.length, { timeout: 10000 });

    // 3. Then: The forecast for the default postcode should be visible
    const postcodeValue = await page.locator('#postcode').inputValue();
    expect(postcodeValue).toBe('SW1A0AA');

    // 4. And: The page URL should be updated
    await page.waitForURL('**/?postcode=SW1A0AA', { timeout: 5000 });
  });

  test('shows forecast for postcode from URL parameter', async ({ page }) => {
    const specificPostcode = 'YO103DD';

    // 1. Given: Navigate to a URL with a postcode parameter
    await page.goto(`/?postcode=${specificPostcode}`);

    // 2. When: The page finishes loading
    await expect(page.locator('tbody tr')).toHaveCount(mockForecastData.forecasts[0].detailed.reports.length, { timeout: 10000 });

    // 3. Then: The forecast data for the specified postcode should be visible
    const postcodeValue = await page.locator('#postcode').inputValue();
    expect(postcodeValue).toBe(specificPostcode);

    // 4. And: The URL should remain unchanged
    expect(page.url()).toContain(`postcode=${specificPostcode}`);
  });
});
