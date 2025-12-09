import { test, expect } from '@playwright/test';

const TEST_USER = process.env.PW_USER || '';
const TEST_PASS = process.env.PW_PSS || '';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing session
    await page.context().clearCookies();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    test.skip(!TEST_USER || !TEST_PASS, 'PW_USER and PW_PSS environment variables are required');

    await page.goto('/en/login');

    // Fill login form
    await page.fill('input[id="email"]', TEST_USER);
    await page.fill('input[id="password"]', TEST_PASS);

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for navigation to events page
    await page.waitForURL(/\/events/, { timeout: 15000 });

    // Verify we're on the events page
    await expect(page).toHaveURL(/\/events/);

    // Verify page loaded without errors
    await expect(page.locator('body')).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/en/login');

    // Fill login form with invalid credentials
    await page.fill('input[id="email"]', 'invalid@test.com');
    await page.fill('input[id="password"]', 'wrongpassword123');

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for error message to appear
    const errorMessage = page.locator('[data-testid="login-error"]');
    await expect(errorMessage).toBeVisible({ timeout: 10000 });

    // Verify error message contains text
    await expect(errorMessage).not.toBeEmpty();

    // Verify we're still on login page (not redirected)
    await expect(page).toHaveURL(/\/login/);

    // Verify the form is still visible (login didn't succeed)
    await expect(page.locator('input[id="email"]')).toBeVisible();
  });

  test('should access events page after successful login', async ({ page }) => {
    test.skip(!TEST_USER || !TEST_PASS, 'PW_USER and PW_PSS environment variables are required');

    await page.goto('/en/login');

    // Login
    await page.fill('input[id="email"]', TEST_USER);
    await page.fill('input[id="password"]', TEST_PASS);
    await page.click('button[type="submit"]');

    // Wait for events page
    await page.waitForURL(/\/events/, { timeout: 15000 });

    // Collect console errors
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Navigate to events page explicitly
    await page.goto('/en/events');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000); // Allow time for console errors

    // Verify page content
    await expect(page.locator('body')).toBeVisible();

    // Filter non-critical errors
    const criticalErrors = consoleErrors.filter((error) => {
      const nonCriticalPatterns = [
        'favicon', '404', 'hydrat', 'ServiceWorker', 'sw.js', 'redirect',
        // React development warnings
        'cannot contain a nested',
        'mounting a new',
        'unmounted first',
        'render more than one',
        '%s',
        'ancestor stack trace',
        // Network errors (transient)
        'ERR_NETWORK',
        'net::ERR_',
        'Failed to load resource',
      ];
      return !nonCriticalPatterns.some(pattern =>
        error.toLowerCase().includes(pattern.toLowerCase())
      );
    });

    expect(criticalErrors).toHaveLength(0);
  });

  test('should display login form elements correctly', async ({ page }) => {
    await page.goto('/en/login');

    // Verify form elements are present
    await expect(page.locator('input[id="email"]')).toBeVisible();
    await expect(page.locator('input[id="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();

    // Verify links are present
    await expect(page.locator('a[href*="forgot-password"]')).toBeVisible();
    await expect(page.locator('a[href*="register"]')).toBeVisible();
  });
});
