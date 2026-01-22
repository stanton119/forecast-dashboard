import { test, expect } from '@playwright/test';
import mockForecastData from './mock-forecast-data.json'; // Import mock data

test.describe('Permalink functionality', () => {
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
  test('updates URL with new parameters and loads correctly from permalink', async ({ page }) => {
    await page.goto('/?postcode=SW7');

    // Initial state: ensure chart is visible
    const chart = page.locator('#forecast-chart');
    await expect(chart).toBeVisible();

    // Change postcode and indoor temperature
    const newPostcode = 'CB1';
    const newIndoorTemp = '22';

    await page.locator('#postcode').fill(newPostcode);
    await page.locator('#indoorTemp').fill(newIndoorTemp);

    await page.waitForTimeout(1000);

    // Now that the values are updated, we can proceed with other assertions
    await expect(page.locator('#postcode')).toHaveValue(newPostcode);
    await expect(page.locator('#indoorTemp')).toHaveValue(String(newIndoorTemp)); // fill converts to string

    // Wait for the forecast chart to appear with the new data
    await expect(page.locator('.recharts-line')).toHaveCount(2, { timeout: 20000 }); // Longer timeout for data fetch

    // Verify the URL has updated after the component state settled and updateUrlParams was called
    await page.waitForURL((url) => {
      const searchParams = new URLSearchParams(url.search);
      return (
        searchParams.get('postcode') === newPostcode &&
        searchParams.get('indoorTemp') === String(newIndoorTemp)
      );
    }, { timeout: 15000 });

    const updatedUrl = page.url();
    expect(updatedUrl).toContain(`postcode=${newPostcode}`);
    expect(updatedUrl).toContain(`indoorTemp=${newIndoorTemp}`);

    // Navigate to the updated URL (permalink)
    await page.goto(updatedUrl);

    // Verify that the chart is still visible with the new parameters after navigating to permalink
    await page.waitForLoadState('networkidle'); // Ensure data is re-fetched on new page load
    await expect(chart).toBeVisible();
    await expect(page.locator('.recharts-line')).toHaveCount(2, { timeout: 20000 }); // Longer timeout for data fetch

    // Verify that the form fields reflect the new parameters from the URL
    await expect(page.locator('#postcode')).toHaveValue(newPostcode);
    await expect(page.locator('#indoorTemp')).toHaveValue(newIndoorTemp);
  });
});
