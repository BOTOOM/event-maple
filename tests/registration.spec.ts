import { test, expect } from '@playwright/test';
import {
  LOCALES,
  navigateTo,
  navigateToLocalized,
  assertNoUntranslatedKeys,
  assertPageLoaded,
  assertH1Visible,
  assertVisible,
} from './utils/test-helpers';

test.describe('Registration Page', () => {
  
  test('should display registration form correctly', async ({ page }) => {
    await navigateTo(page, '/en/register');
    
    await assertH1Visible(page);
    await assertVisible(page, 'input[placeholder*="name"], input[id="name"]');
    await assertVisible(page, 'input[id="email"]');
    await assertVisible(page, 'input[id="password"]');
    await assertVisible(page, 'input[placeholder*="Confirm"], input[id="confirmPassword"]');
    await assertVisible(page, 'button[type="submit"]');
  });

  test('should have terms and privacy links', async ({ page }) => {
    await navigateTo(page, '/en/register');
    
    const termsLink = page.locator('a[href*="terms"]');
    const privacyLink = page.locator('a[href*="privacy"]');
    
    await expect(termsLink).toBeVisible();
    await expect(privacyLink).toBeVisible();
  });

  test('should have login link for existing users', async ({ page }) => {
    await navigateTo(page, '/en/register');
    
    const loginLink = page.locator('a[href*="login"]');
    await expect(loginLink).toBeVisible();
  });

  test('should navigate to login page from register', async ({ page }) => {
    await navigateTo(page, '/en/register');
    
    const loginLink = page.locator('a[href*="login"]');
    await loginLink.click();
    
    await expect(page).toHaveURL(/\/login/);
  });

  test('should show validation for empty form submission', async ({ page }) => {
    await navigateTo(page, '/en/register');
    
    // Try to submit empty form
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    // Form should still be visible (not submitted)
    await assertVisible(page, 'input[id="email"]');
    await expect(page).toHaveURL(/\/register/);
  });

  test.describe('Registration i18n', () => {
    for (const locale of LOCALES) {
      test(`should load registration page correctly in ${locale}`, async ({ page }) => {
        await navigateToLocalized(page, locale, '/register');
        
        await expect(page).toHaveURL(new RegExp(`/${locale}/register`));
        await assertH1Visible(page);
        await assertNoUntranslatedKeys(page, locale);
      });
    }
  });
});

test.describe('Forgot Password Page', () => {
  
  test('should display forgot password form correctly', async ({ page }) => {
    await navigateTo(page, '/en/forgot-password');
    
    await assertH1Visible(page);
    await assertVisible(page, 'input[id="email"], input[type="email"]');
    await assertVisible(page, 'button[type="submit"]');
  });

  test('should have back to login link', async ({ page }) => {
    await navigateTo(page, '/en/forgot-password');
    
    const backLink = page.locator('a[href*="login"]').first();
    await expect(backLink).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    await navigateTo(page, '/en/forgot-password');
    
    const loginLink = page.locator('a[href*="login"]').first();
    await loginLink.click();
    
    await expect(page).toHaveURL(/\/login/);
  });

  test.describe('Forgot Password i18n', () => {
    for (const locale of LOCALES) {
      test(`should load forgot password page correctly in ${locale}`, async ({ page }) => {
        await navigateToLocalized(page, locale, '/forgot-password');
        
        await expect(page).toHaveURL(new RegExp(`/${locale}/forgot-password`));
        await assertH1Visible(page);
        await assertNoUntranslatedKeys(page, locale);
      });
    }
  });
});
