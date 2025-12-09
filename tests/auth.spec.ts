import { test, expect } from '@playwright/test';
import {
  navigateTo,
  assertPageLoaded,
  assertVisible,
  login,
  setupConsoleErrorCollection,
  assertNoCriticalErrors,
} from './utils/test-helpers';

const TEST_USER = process.env.PW_USER || '';
const TEST_PASS = process.env.PW_PSS || '';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    test.skip(!TEST_USER || !TEST_PASS, 'PW_USER and PW_PSS environment variables are required');

    await navigateTo(page, '/en/login');
    await login(page, TEST_USER, TEST_PASS);
    
    await page.waitForURL(/\/events/, { timeout: 15000 });
    await expect(page).toHaveURL(/\/events/);
    await assertPageLoaded(page);
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await navigateTo(page, '/en/login');
    await login(page, 'invalid@test.com', 'wrongpassword123');

    const errorMessage = page.locator('[data-testid="login-error"]');
    await expect(errorMessage).toBeVisible({ timeout: 10000 });
    await expect(errorMessage).not.toBeEmpty();
    await expect(page).toHaveURL(/\/login/);
    await assertVisible(page, 'input[id="email"]');
  });

  test('should access events page after successful login', async ({ page }) => {
    test.skip(!TEST_USER || !TEST_PASS, 'PW_USER and PW_PSS environment variables are required');

    await navigateTo(page, '/en/login');
    await login(page, TEST_USER, TEST_PASS);
    await page.waitForURL(/\/events/, { timeout: 15000 });

    const consoleErrors = setupConsoleErrorCollection(page);
    await navigateTo(page, '/en/events');
    await page.waitForTimeout(1000);

    await assertPageLoaded(page);
    assertNoCriticalErrors(consoleErrors);
  });

  test('should display login form elements correctly', async ({ page }) => {
    await navigateTo(page, '/en/login');

    await assertVisible(page, 'input[id="email"]');
    await assertVisible(page, 'input[id="password"]');
    await assertVisible(page, 'button[type="submit"]');
    await assertVisible(page, 'a[href*="forgot-password"]');
    await assertVisible(page, 'a[href*="register"]');
  });
});
