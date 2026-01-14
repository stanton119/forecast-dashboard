import { test, expect } from '@playwright/test';

test('Data table and CSV export functionality', async ({ page }) => {
  await page.goto('/');

  // Verify data table is present
  const dataTable = page.locator('#data-table');
  await expect(dataTable).toBeVisible();

  // Verify CSV export button is present and clickable
  const exportButton = page.locator('#export-csv-button');
  await expect(exportButton).toBeVisible();
  await expect(exportButton).toBeEnabled();

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
