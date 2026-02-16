import { expect, test } from "@playwright/test";
import {
	assertH1Visible,
	assertNoCriticalErrors,
	assertPageLoaded,
	navigateTo,
	setupConsoleErrorCollection,
} from "./utils/test-helpers";

test.describe("Public Pages Navigation", () => {
	test("should load landing page successfully", async ({ page }) => {
		await navigateTo(page, "/");

		await expect(page).toHaveURL(/\/(en|es)?$/);
		await assertPageLoaded(page);

		// Verify no error state
		const errorElement = page.locator("text=Something went wrong");
		await expect(errorElement).not.toBeVisible();
	});

	test("should navigate to Terms and Conditions page", async ({ page }) => {
		await navigateTo(page, "/en/terms");
		await expect(page).toHaveURL(/\/en\/terms/);
		await assertH1Visible(page);
	});

	test("should navigate to Privacy Policy page", async ({ page }) => {
		await navigateTo(page, "/en/privacy");
		await expect(page).toHaveURL(/\/en\/privacy/);
		await assertH1Visible(page);
	});

	test("should navigate to Contact page", async ({ page }) => {
		await navigateTo(page, "/en/contact");
		await expect(page).toHaveURL(/\/en\/contact/);
		await assertH1Visible(page);
	});

	test("should navigate to About Us page", async ({ page }) => {
		await navigateTo(page, "/en/about");
		await expect(page).toHaveURL(/\/en\/about/);
		await assertH1Visible(page);
	});

	test("should have no critical console errors on landing page", async ({ page }) => {
		const consoleErrors = setupConsoleErrorCollection(page);

		await navigateTo(page, "/");
		await page.waitForTimeout(1000); // Allow time for console errors to appear

		assertNoCriticalErrors(consoleErrors);
	});

	test("should navigate between pages using footer links", async ({ page }) => {
		await navigateTo(page, "/en");

		const footer = page.locator("footer");

		if (await footer.isVisible()) {
			const termsLink = footer.locator('a[href*="terms"]').first();
			if (await termsLink.isVisible()) {
				await termsLink.click();
				await expect(page).toHaveURL(/\/terms/);
			}
		}
	});
});
