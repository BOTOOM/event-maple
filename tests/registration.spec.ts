import { expect, test } from "@playwright/test";
import {
	assertH1Visible,
	assertNoUntranslatedKeys,
	assertVisible,
	fillRegistrationForm,
	LOCALES,
	navigateTo,
	navigateToLocalized,
} from "./utils/test-helpers";

test.describe("Registration Page", () => {
	test("should display registration form correctly", async ({ page }) => {
		await navigateTo(page, "/en/register");

		await assertH1Visible(page);
		await assertVisible(page, 'input[placeholder*="name"], input[id="name"]');
		await assertVisible(page, 'input[id="email"]');
		await assertVisible(page, 'input[id="password"]');
		await assertVisible(page, 'input[placeholder*="Confirm"], input[id="confirmPassword"]');
		await assertVisible(page, 'button[type="submit"]');
	});

	test("should have terms and privacy links", async ({ page }) => {
		await navigateTo(page, "/en/register");

		const termsLink = page.locator('a[href*="terms"]');
		const privacyLink = page.locator('a[href*="privacy"]');

		await expect(termsLink).toBeVisible();
		await expect(privacyLink).toBeVisible();
	});

	test("should have login link for existing users", async ({ page }) => {
		await navigateTo(page, "/en/register");

		const loginLink = page.locator('a[href*="login"]');
		await expect(loginLink).toBeVisible();
	});

	test("should navigate to login page from register", async ({ page }) => {
		await navigateTo(page, "/en/register");

		const loginLink = page.locator('a[href*="login"]');
		await loginLink.click();

		await expect(page).toHaveURL(/\/login/);
	});

	test("should show validation for empty form submission", async ({ page }) => {
		await navigateTo(page, "/en/register");

		// Try to submit empty form
		const submitButton = page.locator('button[type="submit"]');
		await submitButton.click();

		// Form should still be visible (not submitted)
		await assertVisible(page, 'input[id="email"]');
		await expect(page).toHaveURL(/\/register/);
	});

	test("should block plus-addressed emails before signup submission", async ({ page }) => {
		await navigateTo(page, "/en/register");

		let signupRequests = 0;
		page.on("request", (request) => {
			if (request.url().includes("/auth/v1/signup")) {
				signupRequests += 1;
			}
		});

		await fillRegistrationForm(page, "Test User", "event+bot@example.com", "secret123");
		await page.locator("#terms").click();
		await page.locator("form").dispatchEvent("submit");

		const notification = page.getByRole("status");
		await expect(notification).toContainText(
			"Email aliases with + are not allowed. Please use your main email address.",
		);
		await expect(page).toHaveURL(/\/en\/register/);
		expect(signupRequests).toBe(0);
	});

	test("should keep the confirmation toast visible after successful signup", async ({ page }) => {
		await navigateTo(page, "/en/register");

		const uniqueEmail = `eventmaple${Date.now()}@example.com`;

		await fillRegistrationForm(page, "Test User", uniqueEmail, "secret123");
		await page.locator("#terms").click();
		await page.locator("form").dispatchEvent("submit");

		const notification = page.getByRole("status");
		await expect(notification).toBeVisible();

		const notificationText = await notification.innerText();
		if (/rate limit exceeded/i.test(notificationText)) {
			test.skip(true, `Skipped due to signup rate limiting: "${notificationText}"`);
		}

		await expect(notification).toContainText("Account created successfully!");
		await expect(notification).toContainText("IMPORTANT: Check your email");
		await expect(notification).toContainText(uniqueEmail);
		await expect(notification).toContainText(
			"Don't forget to check your SPAM folder if you don't see it in your main inbox.",
		);
		await expect(page).toHaveURL(/\/en\/register/);
	});

	test.describe("Registration i18n", () => {
		for (const locale of LOCALES) {
			test(`should load registration page correctly in ${locale}`, async ({ page }) => {
				await navigateToLocalized(page, locale, "/register");

				await expect(page).toHaveURL(new RegExp(`/${locale}/register`));
				await assertH1Visible(page);
				await assertNoUntranslatedKeys(page, locale);
			});
		}
	});
});

test.describe("Forgot Password Page", () => {
	test("should display forgot password form correctly", async ({ page }) => {
		await navigateTo(page, "/en/forgot-password");

		await assertH1Visible(page);
		await assertVisible(page, 'input[id="email"], input[type="email"]');
		await assertVisible(page, 'button[type="submit"]');
	});

	test("should have back to login link", async ({ page }) => {
		await navigateTo(page, "/en/forgot-password");

		const backLink = page.locator('a[href*="login"]').first();
		await expect(backLink).toBeVisible();
	});

	test("should navigate to login page", async ({ page }) => {
		await navigateTo(page, "/en/forgot-password");

		const loginLink = page.locator('a[href*="login"]').first();
		await loginLink.click();

		await expect(page).toHaveURL(/\/login/);
	});

	test.describe("Forgot Password i18n", () => {
		for (const locale of LOCALES) {
			test(`should load forgot password page correctly in ${locale}`, async ({ page }) => {
				await navigateToLocalized(page, locale, "/forgot-password");

				await expect(page).toHaveURL(new RegExp(`/${locale}/forgot-password`));
				await assertH1Visible(page);
				await assertNoUntranslatedKeys(page, locale);
			});
		}
	});
});
