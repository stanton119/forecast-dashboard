// tests/e2e/test_auto_refresh.spec.js
import { test, expect } from '@playwright/test';

test.describe('Auto-Refresh Forecast on Parameter Change', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the initial forecast to load
    await expect(page.locator('text=Loading forecast...')).not.toBeVisible();
    await expect(page.locator('#forecast-chart canvas')).toBeVisible();
    await expect(page.locator('#data-table table')).toBeVisible();
  });

  test('should auto-refresh forecast when postcode changes', async ({ page }) => {
    const postcodeInput = page.locator('input#postcode');
    const chartCanvas = page.locator('#forecast-chart canvas');
    const dataTable = page.locator('#data-table table');

    // Get initial data for comparison (e.g., first row of table)
    const initialTableCell = await dataTable.locator('tbody tr:first-child td:nth-child(3)').textContent();

    // Change postcode
    await postcodeInput.fill('SW1A 0AA');
    // Expect loading indicator to appear and disappear
    await expect(page.locator('text=Loading forecast...')).toBeVisible();
    await expect(page.locator('text=Loading forecast...')).not.toBeVisible({ timeout: 10000 }); // Wait for loading to finish

    // Verify chart and table reflect new data
    await expect(chartCanvas).toBeVisible();
    await expect(dataTable).toBeVisible();

    // Ensure data has changed
    const newTableCell = await dataTable.locator('tbody tr:first-child td:nth-child(3)').textContent();
    expect(newTableCell).not.toBe(initialTableCell);
  });

  test('should auto-refresh forecast when indoor temperature changes', async ({ page }) => {
    const indoorTempInput = page.locator('input#indoorTemp');
    const dataTable = page.locator('#data-table table');

    // Get initial indoor RH for comparison
    const initialIndoorRH = await dataTable.locator('tbody tr:first-child td:nth-child(5)').textContent();

    // Change indoor temperature
    await indoorTempInput.fill('25'); // Change from default 20 to 25
    // Expect loading indicator to appear and disappear (though for indoor temp it's client-side calc)
    // The loading for indoor temp might be very fast if it's purely client-side calculation
    // However, the ForecastPage does re-render and re-process, so it might briefly show
    await expect(page.locator('text=Loading forecast...')).not.toBeVisible({ timeout: 5000 });

    // Verify table reflects new indoor RH
    await expect(dataTable).toBeVisible();

    // Ensure indoor RH has changed (it should, as the calculation depends on indoorTemp)
    const newIndoorRH = await dataTable.locator('tbody tr:first-child td:nth-child(5)').textContent();
    expect(newIndoorRH).not.toBe(initialIndoorRH);
    expect(parseFloat(newIndoorRH)).toBeGreaterThan(parseFloat(initialIndoorRH)); // Higher temp -> higher RH
  });

  test('should display error message for invalid postcode', async ({ page }) => {
    const postcodeInput = page.locator('input#postcode');

    await postcodeInput.fill('INVALID123');
    await expect(page.locator('text=Loading forecast...')).toBeVisible();
    await expect(page.locator('text=Loading forecast...')).not.toBeVisible({ timeout: 10000 });

    // Expect error message to be visible
    await expect(page.locator('text=Error:')).toBeVisible();
    // Expect chart and table not to be visible or show no data
    await expect(page.locator('#forecast-chart canvas')).not.toBeVisible();
    await expect(page.locator('#data-table table')).not.toBeVisible();
    await expect(page.locator('text=No forecast data available. Adjust parameters and try again.')).toBeVisible();
  });
});
