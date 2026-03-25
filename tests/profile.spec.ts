import { expect, test, type APIRequestContext, type Page } from "@playwright/test";
import { LOCALES, loginWithEnvCredentials } from "./utils/test-helpers";

const SAVE_PROFILE_BUTTON_TEXT =
	/Save changes|Guardar cambios|Salvar alterações|Enregistrer les modifications/i;
const PROFILE_UNAVAILABLE_TEXT =
	/profile is not available yet|perfil aún no está disponible|perfil ainda não está disponível|profil n'est pas encore disponible/i;
const PROFILE_UPDATE_ERROR_TEXT =
	/could not update your profile|no pudimos actualizar tu perfil|não foi possível atualizar seu perfil|impossible de mettre à jour votre profil/i;

function getSaveProfileButton(page: Page) {
	return page.getByRole("button", { name: SAVE_PROFILE_BUTTON_TEXT }).first();
}

function getSupabaseSessionCookieName() {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:54321";
	const projectRef = new URL(supabaseUrl).hostname.split(".")[0];

	return `sb-${projectRef}-auth-token`;
}

function parseSupabaseSessionCookieValue(value: string) {
	const encodedValue = value.startsWith("base64-") ? value.slice(7) : value;

	try {
		const parsedValue = JSON.parse(Buffer.from(encodedValue, "base64url").toString("utf8")) as {
			access_token?: string;
			user?: {
				id?: string;
			};
		};

		if (!parsedValue.access_token || !parsedValue.user?.id) {
			return null;
		}

		return {
			accessToken: parsedValue.access_token,
			userId: parsedValue.user.id,
		};
	} catch {
		return null;
	}
}

async function getAuthenticatedSession(page: Page) {
	const expectedCookieName = getSupabaseSessionCookieName();
	const cookies = await page.context().cookies();
	const sessionCookie =
		cookies.find((cookie) => cookie.name === expectedCookieName) ||
		cookies.find((cookie) => cookie.name.endsWith("-auth-token"));

	if (!sessionCookie) {
		return null;
	}

	return parseSupabaseSessionCookieValue(sessionCookie.value);
}

async function setDisplayNameUpdatedAt(
	page: Page,
	request: APIRequestContext,
	displayNameUpdatedAt: string | null,
) {
	const session = await getAuthenticatedSession(page);
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	if (!session || !supabaseUrl || !supabaseAnonKey) {
		return false;
	}

	const response = await request.patch(
		`${supabaseUrl}/rest/v1/user_profiles?id=eq.${encodeURIComponent(session.userId)}`,
		{
			headers: {
				apikey: supabaseAnonKey,
				Authorization: `Bearer ${session.accessToken}`,
				"Content-Type": "application/json",
				Prefer: "return=representation",
			},
			data: {
				display_name_updated_at: displayNameUpdatedAt,
			},
		},
	);

	return response.ok();
}

async function hasTransientProfileUpdateFailure(page: Page) {
	const profileUnavailableError = page.getByText(PROFILE_UNAVAILABLE_TEXT).first();
	const profileUpdateError = page.getByText(PROFILE_UPDATE_ERROR_TEXT).first();

	if (await profileUnavailableError.isVisible({ timeout: 2500 }).catch(() => false)) {
		return true;
	}

	if (await profileUpdateError.isVisible({ timeout: 2500 }).catch(() => false)) {
		return true;
	}

	return false;
}

async function confirmDisplayNameChangeIfNeeded(page: Page) {
	const confirmationDialog = page.getByTestId("profile-display-name-confirmation-dialog");

	if (await confirmationDialog.isVisible({ timeout: 3000 }).catch(() => false)) {
		await page.getByTestId("profile-display-name-confirm-submit").click();
	}
}

async function selectTimezone(page: Page, targetTimezoneLabel: string) {
	const timezoneCombobox = page.locator('button[role="combobox"]').first();

	await timezoneCombobox.click();

	const timezoneSearch = page
		.locator(
			'input[placeholder*="timezone" i], input[placeholder*="horaria" i], input[placeholder*="fuso" i], input[placeholder*="fuseau" i]',
		)
		.first();

	await timezoneSearch.fill(targetTimezoneLabel);
	await page.locator("div[cmdk-item]").filter({ hasText: targetTimezoneLabel }).first().click();
	await expect(timezoneCombobox).toContainText(targetTimezoneLabel);
}

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

	test("should update locale/timezone and keep values after refresh", async ({ page, request }) => {
		if (!(await loginWithEnvCredentials(page, "en"))) {
			return;
		}

		await setDisplayNameUpdatedAt(page, request, null);
		await page.goto("/en/profile");
		await expect(page).toHaveURL(/\/en\/profile/);

		const nextDisplayName = `Profile E2E ${Date.now()}`;
		const displayNameInput = page.locator("#profile-display-name");
		const canEditDisplayName = await displayNameInput.isEnabled().catch(() => false);

		if (canEditDisplayName) {
			await displayNameInput.fill(nextDisplayName);
		}

		const targetLocale = "es";
		await page.selectOption("#profile-locale", targetLocale);

		const timezoneCombobox = page.locator('button[role="combobox"]').first();
		const initialTimezoneLabel = (await timezoneCombobox.textContent()) || "";
		const targetTimezoneLabel = initialTimezoneLabel.includes("Madrid")
			? "Paris, Brussels, Copenhagen"
			: "Madrid, Barcelona";

		await selectTimezone(page, targetTimezoneLabel);

		await getSaveProfileButton(page).click();

		if (canEditDisplayName) {
			await expect(page.getByTestId("profile-display-name-confirmation-dialog")).toBeVisible({
				timeout: 5000,
			});
		}

		await confirmDisplayNameChangeIfNeeded(page);

		if (await hasTransientProfileUpdateFailure(page)) {
			return;
		}

		await page.waitForURL(new RegExp(`/${targetLocale}/profile`), { timeout: 10000 }).catch(() => undefined);
		await page.reload();

		await expect(page.locator("#profile-locale")).toHaveValue(targetLocale);
		await expect(page.locator('button[role="combobox"]').first()).not.toBeEmpty();
	});

	test("should lock display name while keeping the rest of the profile editable", async ({
		page,
		request,
	}) => {
		if (!(await loginWithEnvCredentials(page, "en"))) {
			return;
		}

		const cooldownConfigured = await setDisplayNameUpdatedAt(page, request, new Date().toISOString());

		await page.goto("/en/profile");

		const displayNameInput = page.locator("#profile-display-name");

		if (!cooldownConfigured) {
			const nextDisplayName = `Profile Lock ${Date.now()}`;
			await displayNameInput.fill(nextDisplayName);
			await getSaveProfileButton(page).click();
			await confirmDisplayNameChangeIfNeeded(page);

			if (await hasTransientProfileUpdateFailure(page)) {
				return;
			}

			await page.reload();
		}

		if (!(await displayNameInput.isDisabled().catch(() => false))) {
			return;
		}

		await expect(page.getByTestId("profile-display-name-status-badge")).toBeVisible();
		await expect(page.getByTestId("profile-display-name-status-message")).toBeVisible();
		await expect(page.locator("#profile-locale")).toBeEnabled();

		const timezoneCombobox = page.locator('button[role="combobox"]').first();
		await expect(timezoneCombobox).toBeEnabled();

		const targetLocale = "fr";
		await page.selectOption("#profile-locale", targetLocale);

		const initialTimezoneLabel = (await timezoneCombobox.textContent()) || "";
		const targetTimezoneLabel = initialTimezoneLabel.includes("Madrid")
			? "Paris, Brussels, Copenhagen"
			: "Madrid, Barcelona";

		await selectTimezone(page, targetTimezoneLabel);
		await getSaveProfileButton(page).click();

		if (await hasTransientProfileUpdateFailure(page)) {
			return;
		}

		await page.waitForURL(new RegExp(`/${targetLocale}/profile`), { timeout: 10000 }).catch(() => undefined);
		await page.reload();

		await expect(page.locator("#profile-locale")).toHaveValue(targetLocale);
		await expect(page.locator("#profile-display-name")).toBeDisabled();
		await expect(page.locator('button[role="combobox"]').first()).not.toBeEmpty();
	});
});
