import { test, expect } from '@playwright/test';

test.describe('CV Assistant', () => {
  test('should open CV assistant from create CV page', async ({ page }) => {
    // Navigate to create CV page
    await page.goto('/create-cv');
    
    // Click the AI assistant button
    await page.click('text=Create CV with AI');
    
    // Wait for the CV assistant overlay to appear
    await expect(page.locator('text=AI CV Assistant')).toBeVisible();
    
    // Verify the first question is displayed
    await expect(page.locator('text=tell me your full name')).toBeVisible();
  });

  test('should handle CV generation flow', async ({ page }) => {
    // Navigate to create CV page
    await page.goto('/create-cv');
    
    // Open CV assistant
    await page.click('text=Create CV with AI');
    
    // Fill in the first response
    await page.fill('textarea', 'John Smith, john.smith@email.com, +1-555-0123, New York, NY');
    
    // Click next
    await page.click('text=Next Question');
    
    // Verify we moved to the next step
    await expect(page.locator('text=describe yourself professionally')).toBeVisible();
  });

  test('magic star button should not interfere with CV assistant', async ({ page }) => {
    // Navigate to dashboard (assuming user is logged in)
    await page.goto('/dashboard');
    
    // Open CV assistant
    await page.evaluate(() => {
      window.dispatchEvent(new Event('open-cv-assistant'));
    });
    
    // Wait for CV assistant to open
    await expect(page.locator('text=AI CV Assistant')).toBeVisible();
    
    // Verify magic star button is not visible when CV assistant is open
    await expect(page.locator('[data-testid="magic-star-fab"]')).not.toBeVisible();
  });
}); 