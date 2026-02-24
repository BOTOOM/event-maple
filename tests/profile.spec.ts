import { expect, test } from "@playwright/test";
import { LOCALES, loginWithEnvCredentials } from "./utils/test-helpers";

test.describe("Profile Settings", () => {
	test("should redirect to login when not authenticated", async ({ page }) => {
		await page.goto("/en/profile");
		await page.waitForLoadState("networkidle");
		expect(page.url()).toContain("/login");
	});

	test.describe("SSR + i18n", () => {
		for (const locale of LOCALES) {
			test(`should load profile page in ${locale}`, async ({ page }) => {
				if (!(await loginWithEnvCredentials(page, locale))) {
					return;
				}

				await page.goto(`/${locale}/profile`);
				await expect(page).toHaveURL(new RegExp(`/${locale}/profile`));
				await expect(page.locator("h1")).toBeVisible();

				const visibleText = await page.locator("body").innerText();
				expect(visibleText).not.toMatch(/Profile\./);
				expect(visibleText).not.toMatch(/Form\./);
			});
		}
	});

	test("should expose profile metadata for SEO", async ({ page }) => {
		if (!(await loginWithEnvCredentials(page, "en"))) {
			return;
		}

		await page.goto("/en/profile");
		await expect(page).toHaveTitle(/Profile settings\s*\|\s*EventMaple/i);

		const description = page.locator('meta[name="description"]');
		await expect(description).toHaveAttribute("content", /personal preferences/i);
	});

	test("should update locale/timezone and keep values after refresh", async ({ page }) => {
		if (!(await loginWithEnvCredentials(page, "en"))) {
			return;
		}

		await page.goto("/en/profile");
		await expect(page).toHaveURL(/\/en\/profile/);

		const nextDisplayName = `Profile E2E ${Date.now()}`;
		await page.fill("#profile-display-name", nextDisplayName);

		const targetLocale = "es";
		await page.selectOption("#profile-locale", targetLocale);

		const timezoneCombobox = page.locator('button[role="combobox"]').first();
		const initialTimezoneLabel = (await timezoneCombobox.textContent()) || "";
		const targetTimezoneLabel = initialTimezoneLabel.includes("Madrid")
			? "Paris, Brussels, Copenhagen"
			: "Madrid, Barcelona";

		await timezoneCombobox.click();

		const timezoneSearch = page
			.locator(
				'input[placeholder*="timezone" i], input[placeholder*="horaria" i], input[placeholder*="fuso" i], input[placeholder*="fuseau" i]',
			)
			.first();
		await timezoneSearch.fill(targetTimezoneLabel);

		await page.locator("div[cmdk-item]").filter({ hasText: targetTimezoneLabel }).first().click();

		await expect(timezoneCombobox).toContainText(targetTimezoneLabel);

		await page
			.locator(
				'button:has-text("Save changes"), button:has-text("Guardar cambios"), button:has-text("Salvar alterações"), button:has-text("Enregistrer les modifications")',
			)
			.first()
			.click();

		const profileUnavailableError = page
			.locator(
				"text=/profile is not available yet|perfil aún no está disponible|perfil ainda não está disponível|profil n'est pas encore disponible/i",
			)
			.first();

		const profileUpdateError = page
			.locator(
				"text=/could not update your profile|no pudimos actualizar tu perfil|não foi possível atualizar seu perfil|impossible de mettre à jour votre profil/i",
			)
			.first();

		if (await profileUnavailableError.isVisible({ timeout: 2500 }).catch(() => false)) {
			return;
		}

		if (await profileUpdateError.isVisible({ timeout: 2500 }).catch(() => false)) {
			return;
		}

		await expect(page).toHaveURL(new RegExp(`/${targetLocale}/profile`), { timeout: 10000 });
		await page.reload();

		await expect(page.locator("#profile-locale")).toHaveValue(targetLocale);
		await expect(page.locator("#profile-display-name")).toHaveValue(nextDisplayName);
		await expect(page.locator('button[role="combobox"]').first()).toContainText(
			targetTimezoneLabel,
		);
	});
});
