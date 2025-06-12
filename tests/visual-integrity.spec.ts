import { test, expect } from '@playwright/test';

const viewports = [320, 375, 768, 1024, 1440];

test.describe('Visual Integrity Tests', () => {
  viewports.forEach((width) => {
    test(`Dashboard integrity @ ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/dashboard');
      
      // Wait for page to load
      await page.waitForLoadState('networkidle');
      
      // Check for singleton violations
      const fabs = await page.locator('[data-singleton="magic-star"]').count();
      expect(fabs).toBeLessThanOrEqual(1);
      
      const toggles = await page.locator('[data-singleton="theme-toggle"]').count();
      expect(toggles).toBeLessThanOrEqual(1);
      
      // Check that FAB doesn't overlap with other UI elements
      const fab = page.locator('[data-testid="magic-star-fab"]');
      const themeToggle = page.locator('[data-testid="theme-toggle"]');
      
      if (await fab.count() > 0 && await themeToggle.count() > 0) {
        const fabBox = await fab.boundingBox();
        const toggleBox = await themeToggle.boundingBox();
        
        if (fabBox && toggleBox) {
          // Check no overlap
          const noOverlap = 
            fabBox.x + fabBox.width < toggleBox.x ||
            toggleBox.x + toggleBox.width < fabBox.x ||
            fabBox.y + fabBox.height < toggleBox.y ||
            toggleBox.y + toggleBox.height < fabBox.y;
          
          expect(noOverlap).toBeTruthy();
        }
      }
      
      // Check that all widgets fit in viewport
      const widgets = page.locator('[data-testid*="widget"]');
      const widgetCount = await widgets.count();
      
      for (let i = 0; i < widgetCount; i++) {
        const widget = widgets.nth(i);
        const box = await widget.boundingBox();
        if (box) {
          expect(box.x).toBeGreaterThanOrEqual(0);
          expect(box.y).toBeGreaterThanOrEqual(0);
          expect(box.x + box.width).toBeLessThanOrEqual(width);
        }
      }
    });
    
    test(`Landing page integrity @ ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/');
      
      await page.waitForLoadState('networkidle');
      
      // Should not have FAB or theme toggle on landing page
      const fabs = await page.locator('[data-singleton="magic-star"]').count();
      expect(fabs).toBe(0);
      
      // Check CTA buttons are visible and clickable
      const candidateBtn = page.locator('text=I\'m a Candidate');
      const employerBtn = page.locator('text=I\'m an Employer');
      
      await expect(candidateBtn).toBeVisible();
      await expect(employerBtn).toBeVisible();
      
      // Check responsive layout
      const header = page.locator('header');
      const headerBox = await header.boundingBox();
      if (headerBox) {
        expect(headerBox.width).toBeLessThanOrEqual(width);
      }
    });
  });
  
  test('Assistant overlay behavior', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Open assistant
    const fab = page.locator('[data-testid="magic-star-fab"]');
    if (await fab.count() > 0) {
      await fab.click();
      
      // Check overlay appears
      const overlay = page.locator('[data-testid="assistant-overlay"]');
      await expect(overlay).toBeVisible();
      
      // Check FAB is hidden when overlay is open
      await expect(fab).not.toBeVisible();
      
      // Check only one overlay exists
      const overlayCount = await page.locator('[data-singleton="assistant-overlay"]').count();
      expect(overlayCount).toBe(1);
      
      // Close overlay
      const closeBtn = page.locator('[data-testid="assistant-overlay"] button:has-text("×")').first();
      await closeBtn.click();
      
      // Check overlay disappears and FAB reappears
      await expect(overlay).not.toBeVisible();
      await expect(fab).toBeVisible();
    }
  });
  
  test('Onboarding flow singleton enforcement', async ({ page }) => {
    await page.goto('/onboarding/candidate');
    await page.waitForLoadState('networkidle');
    
    // Should not have FAB or theme toggle during onboarding
    const fabs = await page.locator('[data-singleton="magic-star"]').count();
    expect(fabs).toBe(0);
    
    const toggles = await page.locator('[data-singleton="theme-toggle"]').count();
    expect(toggles).toBe(0);
    
    // Form should be accessible
    const form = page.locator('form');
    await expect(form).toBeVisible();
    
    // Check required form fields
    const nameInput = page.locator('input[placeholder*="name"]');
    const emailInput = page.locator('input[type="email"]');
    
    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
  });
});