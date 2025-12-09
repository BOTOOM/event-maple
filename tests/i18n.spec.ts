import { test, expect } from '@playwright/test';

const LOCALES = ['en', 'es', 'pt', 'fr'] as const;

test.describe('Internationalization (i18n)', () => {
  for (const locale of LOCALES) {
    test.describe(`Locale: ${locale}`, () => {
      
      test(`should load landing page in ${locale}`, async ({ page }) => {
        await page.goto(`/${locale}`);
        
        // Verify URL contains locale
        await expect(page).toHaveURL(new RegExp(`/${locale}`));
        
        // Verify page loads
        await expect(page.locator('body')).toBeVisible();
      });

      test(`should load About Us page in ${locale}`, async ({ page }) => {
        await page.goto(`/${locale}/about`);
        
        await expect(page).toHaveURL(new RegExp(`/${locale}/about`));
        await expect(page.locator('h1')).toBeVisible();
      });

      test(`should load Terms page in ${locale}`, async ({ page }) => {
        await page.goto(`/${locale}/terms`);
        
        await expect(page).toHaveURL(new RegExp(`/${locale}/terms`));
        await expect(page.locator('h1')).toBeVisible();
      });

      test(`should load Privacy page in ${locale}`, async ({ page }) => {
        await page.goto(`/${locale}/privacy`);
        
        await expect(page).toHaveURL(new RegExp(`/${locale}/privacy`));
        await expect(page.locator('h1')).toBeVisible();
      });

      test(`should load Login page in ${locale}`, async ({ page }) => {
        await page.goto(`/${locale}/login`);
        
        await expect(page).toHaveURL(new RegExp(`/${locale}/login`));
        await expect(page.locator('h1')).toBeVisible();
        
        // Verify form elements
        await expect(page.locator('input[id="email"]')).toBeVisible();
        await expect(page.locator('input[id="password"]')).toBeVisible();
      });

      test(`should load Events page in ${locale}`, async ({ page }) => {
        await page.goto(`/${locale}/events`);
        
        await expect(page).toHaveURL(new RegExp(`/${locale}/events`));
        await expect(page.locator('body')).toBeVisible();
      });
    });
  }

  test.describe('No Console Errors', () => {
    for (const locale of LOCALES) {
      test(`should have no critical errors on ${locale} pages`, async ({ page }) => {
        const consoleErrors: string[] = [];
        
        page.on('console', (msg) => {
          if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
          }
        });

        // Visit main pages
        const pages = ['', '/about', '/terms', '/privacy'];
        for (const path of pages) {
          await page.goto(`/${locale}${path}`);
          await page.waitForLoadState('domcontentloaded');
        }

        // Filter non-critical errors
        const criticalErrors = consoleErrors.filter((error) => {
          const nonCriticalPatterns = [
            'favicon', '404', 'hydrat', 'ServiceWorker', 'sw.js', 'redirect'
          ];
          return !nonCriticalPatterns.some(pattern =>
            error.toLowerCase().includes(pattern.toLowerCase())
          );
        });

        expect(criticalErrors).toHaveLength(0);
      });
    }
  });
});
