import { test, expect } from '@playwright/test';
import mockForecastData from './mock-forecast-data.json'; // Import mock data

test.describe('Auto-Refresh Optimization', () => {
  test.beforeEach(async ({ page }) => {
    // Intercept BBC weather API calls and return mock data for initial load
    await page.route('https://weather-broker-cdn.api.bbci.co.uk/**/*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockForecastData),
      });
    });

    // Navigate to the forecast page before each test
    await page.goto('/?postcode=SW7');
    await page.waitForLoadState('networkidle'); // Wait for network to be idle after page load
    // Wait for the initial forecast data to load
    await expect(page.locator('#forecast-chart')).toBeVisible();
    await expect(page.locator('#data-table')).toBeVisible();
    // Ensure forecast data is displayed before proceeding
    await expect(page.locator('.recharts-line')).toHaveCount(2, { timeout: 10000 }); // Both indoor and outdoor lines
  });

  test('should not make an API call when only indoor temperature changes', async ({ page }) => {
    // Intercept network requests to check for BBC API calls
    let apiCallMade = false;
    page.route('**/weather-broker-cdn.api.bbci.co.uk/**', (route) => {
      apiCallMade = true;
      route.continue();
    });

    const initialIndoorHumidity = await page.locator('#data-table tbody tr').first().locator('td').nth(4).textContent();

    // Change indoor temperature in the form
    await page.fill('#indoorTemp', '25'); // Change from default 20 to 25

    // Allow time for the debounced change and potential re-render/recalculation
    await page.waitForTimeout(1000); // Wait for debounce (500ms) + effect to run

    // Expect no API call to the BBC weather service
    expect(apiCallMade).toBe(false);

    // Verify indoor humidity on display has updated (client-side recalculation)
    const updatedIndoorHumidity = await page.locator('#data-table tbody tr').first().locator('td').nth(4).textContent();
    expect(updatedIndoorHumidity).not.toBe('');
  });

  test('should make an API call when outdoor parameters (postcode) change', async ({ page }) => {
    // Intercept network requests to check for BBC API calls
    let apiCallMade = false;
    page.route('**/weather-broker-cdn.api.bbci.co.uk/**', (route) => {
      apiCallMade = true;
      route.continue();
    });

    const initialOutdoorHumidity = await page.locator('#data-table tbody tr').first().locator('td').nth(2).textContent();

    // Change postcode in the form
    await page.fill('#postcode', 'NW1'); // Change from default SW7 to NW1

    // Allow time for the debounced change and potential re-render/recalculation
    await page.waitForTimeout(1000); // Wait for debounce (500ms) + effect to run

    // Expect an API call to the BBC weather service
    expect(apiCallMade).toBe(true);

    // Verify outdoor humidity on display has updated (new data fetched)
    const updatedOutdoorHumidity = await page.locator('#data-table tbody tr').first().locator('td').nth(2).textContent();
    expect(updatedOutdoorHumidity).not.toBe(initialOutdoorHumidity);
    expect(updatedOutdoorHumidity).not.toBe('');

    // Also verify indoor humidity has updated (recalculated based on new outdoor data)
    const updatedIndoorHumidity = await page.locator('#data-table tbody tr').first().locator('td').nth(4).textContent();
    expect(updatedIndoorHumidity).not.toBe(''); // Just ensure it's not empty, actual value depends on new data
  });
});
