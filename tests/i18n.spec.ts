import { expect, test } from "@playwright/test";
import {
	assertH1Visible,
	assertNoCriticalErrors,
	assertNoUntranslatedKeys,
	assertPageLoaded,
	assertTranslatedContent,
	assertVisible,
	LOCALE_CONTENT,
	LOCALES,
	navigateToLocalized,
	setupConsoleErrorCollection,
} from "./utils/test-helpers";

test.describe("Internationalization (i18n)", () => {
	for (const locale of LOCALES) {
		test.describe(`Locale: ${locale}`, () => {
			test(`should load landing page with correct translations in ${locale}`, async ({ page }) => {
				await navigateToLocalized(page, locale);
				await expect(page).toHaveURL(new RegExp(`/${locale}`));
				await assertPageLoaded(page);
				await assertTranslatedContent(page, LOCALE_CONTENT[locale].landing);
				await assertNoUntranslatedKeys(page, locale);
			});

			test(`should load About Us page with correct translations in ${locale}`, async ({ page }) => {
				await navigateToLocalized(page, locale, "/about");
				await expect(page).toHaveURL(new RegExp(`/${locale}/about`));
				await assertH1Visible(page);
				await assertTranslatedContent(page, LOCALE_CONTENT[locale].about);
				await assertNoUntranslatedKeys(page, locale);
			});

			test(`should load Terms page without untranslated keys in ${locale}`, async ({ page }) => {
				await navigateToLocalized(page, locale, "/terms");
				await expect(page).toHaveURL(new RegExp(`/${locale}/terms`));
				await assertH1Visible(page);
				await assertNoUntranslatedKeys(page, locale);
			});

			test(`should load Privacy page without untranslated keys in ${locale}`, async ({ page }) => {
				await navigateToLocalized(page, locale, "/privacy");
				await expect(page).toHaveURL(new RegExp(`/${locale}/privacy`));
				await assertH1Visible(page);
				await assertNoUntranslatedKeys(page, locale);
			});

			test(`should load Login page with correct translations in ${locale}`, async ({ page }) => {
				await navigateToLocalized(page, locale, "/login");
				await expect(page).toHaveURL(new RegExp(`/${locale}/login`));
				await assertH1Visible(page);
				await assertVisible(page, 'input[id="email"]');
				await assertVisible(page, 'input[id="password"]');
				await assertTranslatedContent(page, LOCALE_CONTENT[locale].login);
				await assertNoUntranslatedKeys(page, locale);
			});

			test(`should load Events page without untranslated keys in ${locale}`, async ({ page }) => {
				await navigateToLocalized(page, locale, "/events");
				await expect(page).toHaveURL(new RegExp(`/${locale}/events`));
				await assertPageLoaded(page);
				await assertNoUntranslatedKeys(page, locale);
			});

			test(`should load Event Detail page without untranslated keys in ${locale}`, async ({
				page,
			}) => {
				await navigateToLocalized(page, locale, "/events/1");
				await expect(page).toHaveURL(new RegExp(`/${locale}/events/1`));
				await assertNoUntranslatedKeys(page, locale);
			});
		});
	}

	test.describe("No Console Errors", () => {
		for (const locale of LOCALES) {
			test(`should have no critical errors on ${locale} pages`, async ({ page }) => {
				const consoleErrors = setupConsoleErrorCollection(page);

				// Visit main pages
				const pages = ["", "/about", "/terms", "/privacy", "/events", "/events/1"];
				for (const path of pages) {
					await navigateToLocalized(page, locale, path);
				}

				assertNoCriticalErrors(consoleErrors);
			});
		}
	});
});
