import { test, expect } from '@playwright/test';

test.describe('Permalink functionality', () => {
  test('updates URL with new parameters and loads correctly from permalink', async ({ page }) => {
    await page.goto('/');

    // Initial state: ensure chart is visible
    const chart = page.locator('#forecast-chart');
    await expect(chart).toBeVisible();

    // Change postcode and indoor temperature
    const newPostcode = 'CB1';
    const newIndoorTemp = '22';

    await page.fill('#postcode', newPostcode);
    await page.fill('#indoorTemp', newIndoorTemp);
    await page.click('button:has-text("Get Forecast")');

    // Wait for URL to update and page to potentially reload with new parameters
    await page.waitForURL((url) => {
      const searchParams = new URLSearchParams(url.search);
      return searchParams.get('postcode') === newPostcode && searchParams.get('indoorTemp') === newIndoorTemp;
    });

    const updatedUrl = page.url();
    expect(updatedUrl).toContain(`postcode=${newPostcode}`);
    expect(updatedUrl).toContain(`indoorTemp=${newIndoorTemp}`);

    // Navigate to the updated URL (permalink)
    await page.goto(updatedUrl);

    // Verify that the chart is still visible with the new parameters
    await expect(chart).toBeVisible();

    // Optionally, verify that the form fields reflect the new parameters from the URL
    await expect(page.locator('#postcode')).toHaveValue(newPostcode);
    await expect(page.locator('#indoorTemp')).toHaveValue(newIndoorTemp);
  });
});
