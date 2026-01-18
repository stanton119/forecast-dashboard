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

test('Default view shows the forecast chart', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle'); // Wait for network to be idle after page load

  // Check that the chart is visible
  const chart = page.locator('#forecast-chart');
  await expect(chart).toBeVisible();

  // Check that there are two lines on the chart
  const lines = chart.locator('path.recharts-curve');
  await expect(lines).toHaveCount(2, { timeout: 10000 }); // Add timeout for robustness
});

test('Default view shows correct attribution', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const attribution = page.locator('#attribution');

  // Assert that "BBC Weather" link is present
  await expect(attribution.locator('a[href="https://www.bbc.co.uk/weather/"]')).toBeVisible();

  // Assert that "Powered by Gemini" is NOT present
  // This is the part that should fail initially
  await expect(attribution).not.toContainText('Powered by Gemini');
});
