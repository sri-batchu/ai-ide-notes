import { test, expect } from '@playwright/test';

test('should add a note, delete it, and verify list', async ({ page }) => {
  await page.goto('/');
  
  const noteText = 'Test note from Playwright';
  await page.getByPlaceholder('Write a quick note…').fill(noteText);
  await page.getByRole('button', { name: 'Add' }).click();
  
  await expect(page.getByText(noteText)).toBeVisible();
  
  const notesBefore = await page.locator('li').count();
  
  await page.getByText(noteText)
    .locator('..')
    .getByRole('button', { name: 'Delete' })
    .click();
  
  await expect(page.getByText(noteText)).not.toBeVisible();
  
  const notesAfter = await page.locator('li').count();
  expect(notesAfter).toBe(notesBefore - 1);
});
