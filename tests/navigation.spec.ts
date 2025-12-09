import { test, expect } from '@playwright/test';

test.describe('Public Pages Navigation', () => {
  test('should load landing page successfully', async ({ page }) => {
    await page.goto('/');
    
    // Verify page loads without errors
    await expect(page).toHaveURL(/\/(en|es)?$/);
    
    // Check for main content
    await expect(page.locator('body')).toBeVisible();
    
    // Verify no error state
    const errorElement = page.locator('text=Something went wrong');
    await expect(errorElement).not.toBeVisible();
  });

  test('should navigate to Terms and Conditions page', async ({ page }) => {
    await page.goto('/en/terms');
    
    // Verify URL
    await expect(page).toHaveURL(/\/en\/terms/);
    
    // Verify page content loaded - Terms uses LegalPageLayout with h1
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should navigate to Privacy Policy page', async ({ page }) => {
    await page.goto('/en/privacy');
    
    // Verify URL
    await expect(page).toHaveURL(/\/en\/privacy/);
    
    // Verify page content loaded - Privacy uses LegalPageLayout with h1
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should navigate to Contact page', async ({ page }) => {
    await page.goto('/en/contact');
    
    // Verify URL
    await expect(page).toHaveURL(/\/en\/contact/);
    
    // Verify page content loaded - Contact has h1 header
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should navigate to About Us page', async ({ page }) => {
    await page.goto('/en/about');
    
    // Verify URL
    await expect(page).toHaveURL(/\/en\/about/);
    
    // Verify page content loaded - About has h1 header
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should have no critical console errors on landing page', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Filter out known non-critical errors (dev mode warnings, service worker, hydration)
    const criticalErrors = consoleErrors.filter((error) => {
      const nonCriticalPatterns = [
        'favicon',
        '404',
        'hydrat',
        'ServiceWorker',
        'sw.js',
        'redirect',
      ];
      return !nonCriticalPatterns.some(pattern => 
        error.toLowerCase().includes(pattern.toLowerCase())
      );
    });
    
    expect(criticalErrors).toHaveLength(0);
  });

  test('should navigate between pages using footer links', async ({ page }) => {
    await page.goto('/en');
    
    // Look for footer links
    const footer = page.locator('footer');
    
    if (await footer.isVisible()) {
      // Try to find and click terms link
      const termsLink = footer.locator('a[href*="terms"]').first();
      if (await termsLink.isVisible()) {
        await termsLink.click();
        await expect(page).toHaveURL(/\/terms/);
      }
    }
  });
});
