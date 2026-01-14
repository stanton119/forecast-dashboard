import { test, expect } from '@playwright/test';

test('Default view shows the forecast chart', async ({ page }) => {
  await page.goto('/');

  // Check that the chart is visible
  const chart = page.locator('#forecast-chart');
  await expect(chart).toBeVisible();

  // Check that there are two lines on the chart
    const lines = chart.locator('path.recharts-curve');
    await expect(lines).toHaveCount(2);
});
