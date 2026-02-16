import { expect, test } from "@playwright/test";
import { loginWithEnvCredentials, openCreateEventPage } from "./utils/test-helpers";

const locales = ["en", "es", "pt", "fr"];

test.describe("My Events Page", () => {
	test.describe("Authentication Required", () => {
		test("should redirect to login when not authenticated", async ({ page }) => {
			await page.goto("/en/my-events");
			// Should redirect to login since my-events is a protected route
			await page.waitForLoadState("networkidle");
			const url = page.url();
			// Must redirect to login
			expect(url).toContain("/login");
		});
	});

	test.describe("Authenticated User", () => {
		test.beforeEach(async ({ page }) => {
			if (!(await loginWithEnvCredentials(page))) {
				test.skip();
			}
		});

		test("should load My Events page", async ({ page }) => {
			await page.goto("/en/my-events");
			await expect(page).toHaveURL(/my-events/);

			// Check for page title
			const title = page.locator("h1");
			await expect(title).toBeVisible();
		});

		test("should have create event button", async ({ page }) => {
			await page.goto("/en/my-events");

			// Look for create button
			const createButton = page.locator('a[href*="create"], button:has-text("Create")');
			await expect(createButton.first()).toBeVisible();
		});

		test("should have filter tabs", async ({ page }) => {
			await page.goto("/en/my-events");

			// Check for filter buttons
			const allFilter = page.locator('button:has-text("All"), button:has-text("Todos")');
			await expect(allFilter.first()).toBeVisible();
		});

		test("should have search input", async ({ page }) => {
			await page.goto("/en/my-events");

			// Check for search input
			const searchInput = page.locator(
				'input[type="text"][placeholder*="earch"], input[type="text"][placeholder*="uscar"]',
			);
			await expect(searchInput.first()).toBeVisible();
		});
	});

	test.describe("i18n - My Events Page", () => {
		for (const locale of locales) {
			test(`should load My Events page in ${locale}`, async ({ page }) => {
				if (!(await loginWithEnvCredentials(page, locale))) {
					return;
				}

				// Navigate to my-events
				await page.goto(`/${locale}/my-events`);
				await expect(page).toHaveURL(new RegExp(`/${locale}/my-events`));

				// Page should have content
				const content = await page.textContent("body");
				expect(content).toBeTruthy();

				// Should not have untranslated keys (keys starting with MyEvents.)
				expect(content).not.toMatch(/MyEvents\.\w+/);
			});
		}
	});
});

test.describe("Create Event Page", () => {
	test.describe("Authentication Required", () => {
		test("should redirect to login when not authenticated", async ({ page }) => {
			await page.goto("/en/my-events/create");
			// Should redirect to login since create event is a protected route
			await page.waitForLoadState("networkidle");
			const url = page.url();
			// Must redirect to login
			expect(url).toContain("/login");
		});
	});

	test.describe("Authenticated User", () => {
		test.beforeEach(async ({ page }) => {
			if (!(await loginWithEnvCredentials(page))) {
				test.skip();
			}
		});

		test("should load Create Event page", async ({ page }) => {
			await page.goto("/en/my-events/create");
			await expect(page).toHaveURL(/my-events\/create/);

			// Check for page title
			const title = page.locator("h1");
			await expect(title).toBeVisible();
		});

		test("should have event form fields", async ({ page }) => {
			await openCreateEventPage(page);

			// Check for form fields - use more flexible selectors
			const nameInput = page.locator("input#name");
			await expect(nameInput).toBeVisible({ timeout: 10000 });

			// Check for category buttons (they are rendered as buttons)
			const categoryButtons = page
				.locator('button[type="button"]')
				.filter({ hasText: /Technology|Software|Business|Education/i });
			await expect(categoryButtons.first()).toBeVisible({ timeout: 10000 });

			// Check for date inputs
			const startDateInput = page.locator('input[type="datetime-local"]').first();
			await expect(startDateInput).toBeVisible({ timeout: 10000 });
		});

		test("should have live preview section", async ({ page }) => {
			await openCreateEventPage(page);

			// Check for preview section - look for the sticky preview container
			// The preview has a red pulsing dot and preview text
			const previewContainer = page.locator(".sticky").first();
			await expect(previewContainer).toBeVisible({ timeout: 10000 });

			// Also check for the preview card component
			const previewCard = page.locator(".sticky .rounded-lg.shadow-lg");
			await expect(previewCard).toBeVisible({ timeout: 10000 });
		});

		test("should have country autocomplete field", async ({ page }) => {
			await openCreateEventPage(page);

			// Look for the country autocomplete button (it's a combobox-style button)
			const countryButton = page.locator(
				'button:has-text("Select a country"), button:has-text("Seleccionar país")',
			);
			await expect(countryButton.first()).toBeVisible({ timeout: 10000 });
		});

		test("should have timezone autocomplete field", async ({ page }) => {
			await openCreateEventPage(page);

			// Look for the timezone autocomplete button - check for any timezone-related button
			// The button may show "Select timezone" or already have a selected value like "UTC"
			const timezoneButton = page.locator(
				'button:has-text("Select timezone"), button:has-text("Selecciona zona horaria"), button:has-text("UTC")',
			);
			await expect(timezoneButton.first()).toBeVisible({ timeout: 10000 });
		});

		test("should have save and publish buttons", async ({ page }) => {
			await openCreateEventPage(page);

			// Check for action buttons
			const saveButton = page.locator(
				'button:has-text("Save"), button:has-text("Guardar"), button:has-text("Salvar"), button:has-text("Enregistrer")',
			);
			await expect(saveButton.first()).toBeVisible();

			const publishButton = page.locator(
				'button:has-text("Publish"), button:has-text("Publicar"), button:has-text("Publier")',
			);
			await expect(publishButton.first()).toBeVisible();
		});

		test("should update preview when typing event name", async ({ page }) => {
			await openCreateEventPage(page);

			const testEventName = "Test Event Name 2024";

			// Type in the name field
			const nameInput = page.locator('input#name, input[name="name"]');
			await nameInput.fill(testEventName);

			// Check if preview updates
			const previewTitle = page.locator(".sticky h3, [class*='preview'] h3");
			await expect(previewTitle).toContainText(testEventName);
		});
	});

	test.describe("i18n - Create Event Page", () => {
		for (const locale of locales) {
			test(`should load Create Event page in ${locale}`, async ({ page }) => {
				if (!(await loginWithEnvCredentials(page, locale))) {
					return;
				}

				// Navigate to create page
				await page.goto(`/${locale}/my-events/create`);
				await expect(page).toHaveURL(new RegExp(`/${locale}/my-events/create`));
				await page.waitForLoadState("networkidle");

				// Page should have content and render properly
				const title = page.locator("h1");
				await expect(title).toBeVisible({ timeout: 10000 });

				// Check that the form is rendered (not showing raw i18n keys in visible text)
				const visibleText = await page.locator("h1, h2, label, button").allTextContents();
				const combinedText = visibleText.join(" ");

				// Should not have untranslated keys in visible UI elements
				expect(combinedText).not.toMatch(/^MyEvents\./);
				expect(combinedText).not.toMatch(/^Form\./);
				expect(combinedText).not.toMatch(/^Preview\./);
			});
		}
	});
});
