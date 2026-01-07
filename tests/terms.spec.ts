import { expect, test } from "@playwright/test";

const locales = ["en", "es", "pt", "fr"];

test.describe("Terms and Conditions Page", () => {
	test("should load terms page in English", async ({ page }) => {
		await page.goto("/en/terms");
		await expect(page).toHaveURL(/\/en\/terms/);

		// Check for page title
		const title = page.locator("h1");
		await expect(title).toBeVisible();
		await expect(title).toContainText(/Terms|Conditions/i);
	});

	test("should display all sections including Event Content section", async ({ page }) => {
		await page.goto("/en/terms");
		await page.waitForLoadState("networkidle");

		// Check for the new Event Content section (section 6)
		const eventContentSection = page.locator(
			"text=/Event Content|Contenido de Eventos|Conteúdo de Eventos|Contenu des Événements/i",
		);
		await expect(eventContentSection.first()).toBeVisible();

		// Check for prohibited content subsection
		const prohibitedContent = page.locator(
			"text=/Prohibited Content|Contenido Prohibido|Conteúdo Proibido|Contenu Interdit/i",
		);
		await expect(prohibitedContent.first()).toBeVisible();

		// Check for enforcement subsection
		const enforcement = page.locator("text=/Enforcement|Aplicación|Aplicação|Application/i");
		await expect(enforcement.first()).toBeVisible();
	});

	test.describe("i18n - Terms Page", () => {
		for (const locale of locales) {
			test(`should load terms page in ${locale} without missing keys`, async ({ page }) => {
				await page.goto(`/${locale}/terms`);
				await expect(page).toHaveURL(new RegExp(`/${locale}/terms`));
				await page.waitForLoadState("networkidle");

				// Page should have content
				const content = await page.textContent("body");
				expect(content).toBeTruthy();

				// Should not have untranslated keys
				expect(content).not.toMatch(/Terms\.sections\.\w+/);
				expect(content).not.toMatch(/eventContent\.\w+/);
			});
		}
	});
});
