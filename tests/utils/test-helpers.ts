import { expect, Page } from "@playwright/test";

// ============================================================================
// CONSTANTS
// ============================================================================

export const LOCALES = ["en", "es", "pt", "fr"] as const;
export type Locale = (typeof LOCALES)[number];

export const TEST_EVENT_NAME = "DevOpsDays Bogotá 2025";
export const TEST_EVENT_ID = "1";

// Non-critical error patterns to filter out in console error checks
export const NON_CRITICAL_ERROR_PATTERNS = [
	"favicon",
	"404",
	"hydrat",
	"ServiceWorker",
	"sw.js",
	"redirect",
	// React development warnings
	"cannot contain a nested",
	"mounting a new",
	"unmounted first",
	"render more than one",
	"%s",
	"ancestor stack trace",
	"html html html",
	"body body body",
	// Network errors (transient)
	"ERR_NETWORK",
	"net::ERR_",
	"Failed to load resource",
];

// Expected translated content for each locale
export const LOCALE_CONTENT: Record<Locale, { landing: RegExp; about: RegExp; login: RegExp }> = {
	en: {
		landing: /The smartest way|Explore Events|Sign In/i,
		about: /About EventMaple|Our Mission|Community/i,
		login: /Welcome|Sign in|Email|Password/i,
	},
	es: {
		landing: /La forma más inteligente|Explorar Eventos|Iniciar sesión/i,
		about: /Acerca de EventMaple|Nuestra Misión|Comunidad/i,
		login: /Bienvenido|Iniciar sesión|Correo|Contraseña/i,
	},
	pt: {
		landing: /A forma mais inteligente|Explorar Eventos|Entrar/i,
		about: /Sobre o EventMaple|Nossa Missão|Comunidade/i,
		login: /Bem-vindo|Entrar|Email|Senha/i,
	},
	fr: {
		landing: /La façon la plus intelligente|Explorer les événements|Se connecter/i,
		about: /À propos d'EventMaple|Notre Mission|Communauté/i,
		login: /Bienvenue|Se connecter|Email|Mot de passe/i,
	},
};

// ============================================================================
// PAGE NAVIGATION HELPERS
// ============================================================================

/**
 * Navigate to a page and wait for it to load
 */
export async function navigateTo(page: Page, path: string): Promise<void> {
	await page.goto(path);
	await page.waitForLoadState("domcontentloaded");
}

/**
 * Navigate to a localized page
 */
export async function navigateToLocalized(
	page: Page,
	locale: Locale,
	path: string = "",
): Promise<void> {
	await navigateTo(page, `/${locale}${path}`);
}

// ============================================================================
// I18N HELPERS
// ============================================================================

/**
 * Check for untranslated keys in the page body
 * Untranslated keys look like: {key.path}, {Error.common}, etc.
 */
export async function checkForUntranslatedKeys(page: Page): Promise<string[]> {
	const bodyText = await page.locator("body").innerText();
	const untranslatedPattern = /\{[A-Za-z]+\.[A-Za-z.]+\}/g;
	const matches = bodyText.match(untranslatedPattern) || [];

	// Filter out valid template patterns
	const validPatterns = new Set(["{year}", "{count}", "{email}"]);
	return matches.filter((match) => !validPatterns.has(match));
}

/**
 * Assert no untranslated keys exist on the page
 */
export async function assertNoUntranslatedKeys(page: Page, context: string = ""): Promise<void> {
	const untranslatedKeys = await checkForUntranslatedKeys(page);
	const contextMessage = context ? ` in ${context}` : "";

	expect(
		untranslatedKeys,
		`Found untranslated keys${contextMessage}: ${untranslatedKeys.join(", ")}`,
	).toHaveLength(0);
}

/**
 * Verify translated content is present on the page
 */
export async function assertTranslatedContent(page: Page, pattern: RegExp): Promise<void> {
	const bodyText = await page.locator("body").innerText();
	expect(bodyText).toMatch(pattern);
}

// ============================================================================
// CONSOLE ERROR HELPERS
// ============================================================================

/**
 * Setup console error collection
 */
export function setupConsoleErrorCollection(page: Page): string[] {
	const consoleErrors: string[] = [];
	page.on("console", (msg) => {
		if (msg.type() === "error") {
			consoleErrors.push(msg.text());
		}
	});
	return consoleErrors;
}

/**
 * Filter out non-critical errors from collected console errors
 */
export function filterCriticalErrors(errors: string[]): string[] {
	return errors.filter((error) => {
		return !NON_CRITICAL_ERROR_PATTERNS.some((pattern) =>
			error.toLowerCase().includes(pattern.toLowerCase()),
		);
	});
}

/**
 * Assert no critical console errors
 */
export function assertNoCriticalErrors(errors: string[]): void {
	const criticalErrors = filterCriticalErrors(errors);
	expect(criticalErrors).toHaveLength(0);
}

// ============================================================================
// EVENTS PAGE HELPERS
// ============================================================================

/**
 * Enable past events filter in the sidebar
 */
export async function enablePastEventsFilter(page: Page): Promise<void> {
	const toggle = page.locator("#show-past-events");

	// Check if toggle is visible (sidebar might be open on desktop)
	if (await toggle.isVisible()) {
		const isChecked = await toggle.isChecked();
		if (!isChecked) {
			await toggle.click();
			await page.waitForTimeout(500);
		}
		return;
	}

	// On mobile, need to open the sidebar first
	const filtersButton = page
		.locator('button:has-text("Filters"), button:has-text("Filtros")')
		.first();
	if (await filtersButton.isVisible()) {
		await filtersButton.click();
		await page.waitForTimeout(500);

		const toggleAfterOpen = page.locator("#show-past-events");
		if (await toggleAfterOpen.isVisible()) {
			const isChecked = await toggleAfterOpen.isChecked();
			if (!isChecked) {
				await toggleAfterOpen.click();
				await page.waitForTimeout(500);
			}
		}
	}
}

/**
 * Search for an event by name
 */
export async function searchForEvent(page: Page, eventName: string): Promise<void> {
	const searchInput = page.locator('input[type="text"], input[type="search"]').first();
	await searchInput.fill(eventName);
	await page.waitForTimeout(1000);
}

/**
 * Click on "View details" button for an event
 */
export async function clickViewDetails(page: Page): Promise<void> {
	const viewDetailsButton = page
		.locator('a:has-text("View details"), a:has-text("Ver detalles")')
		.first();
	await expect(viewDetailsButton).toBeVisible({ timeout: 10000 });
	await viewDetailsButton.click();
	await page.waitForURL(/\/events\/\d+/);
}

// ============================================================================
// AUTH HELPERS
// ============================================================================

/**
 * Fill login form
 */
export async function fillLoginForm(page: Page, email: string, password: string): Promise<void> {
	await page.fill('input[id="email"]', email);
	await page.fill('input[id="password"]', password);
}

/**
 * Submit login form
 */
export async function submitLoginForm(page: Page): Promise<void> {
	await page.click('button[type="submit"]');
}

/**
 * Perform login
 */
export async function login(page: Page, email: string, password: string): Promise<void> {
	await fillLoginForm(page, email, password);
	await submitLoginForm(page);
}

/**
 * Fill registration form
 */
export async function fillRegistrationForm(
	page: Page,
	name: string,
	email: string,
	password: string,
): Promise<void> {
	await page.fill('input[id="name"], input[placeholder*="name"]', name);
	await page.fill('input[id="email"]', email);
	await page.fill('input[id="password"]', password);
	await page.fill('input[id="confirmPassword"], input[placeholder*="Confirm"]', password);
}

// ============================================================================
// ASSERTION HELPERS
// ============================================================================

/**
 * Assert page is visible and loaded
 */
export async function assertPageLoaded(page: Page): Promise<void> {
	await expect(page.locator("body")).toBeVisible();
}

/**
 * Assert URL matches pattern
 */
export async function assertUrlMatches(page: Page, pattern: RegExp): Promise<void> {
	await expect(page).toHaveURL(pattern);
}

/**
 * Assert element is visible
 */
export async function assertVisible(page: Page, selector: string): Promise<void> {
	await expect(page.locator(selector)).toBeVisible();
}

/**
 * Assert h1 is visible (common for page headers)
 */
export async function assertH1Visible(page: Page): Promise<void> {
	await expect(page.locator("h1")).toBeVisible();
}

// ============================================================================
// BUTTON/LINK HELPERS
// ============================================================================

/**
 * Find and return favorite button
 */
export function getFavoriteButton(page: Page) {
	return page
		.locator(
			'button:has-text("Add to favorites"), button:has-text("favorites"), button:has-text("favoritos"), button[aria-label*="favorite"], button[aria-label*="favorito"]',
		)
		.first();
}

/**
 * Find and return full agenda button
 */
export function getFullAgendaButton(page: Page) {
	return page
		.locator(
			'a:has-text("Full Agenda"), a:has-text("View Full Agenda"), a:has-text("Agenda Completa")',
		)
		.first();
}

/**
 * Find and return my agenda button
 */
export function getMyAgendaButton(page: Page) {
	return page
		.locator('a:has-text("My Personal Agenda"), a:has-text("My Agenda"), a:has-text("Mi Agenda")')
		.first();
}

/**
 * Find and return language switcher button
 */
export function getLanguageSwitcher(page: Page) {
	return page.locator('button:has-text("Switch Language")').first();
}
