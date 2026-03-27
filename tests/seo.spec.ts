import { expect, type Page, test } from "@playwright/test";
import { LOCALES, navigateToLocalized, TEST_EVENT_ID } from "./utils/test-helpers";

const SITE_URL = "https://event-maple.edwardiaz.dev";

async function expectCanonicalPath(page: Page, expectedPath: string) {
	const canonicalHref = await page.locator('link[rel="canonical"]').getAttribute("href");
	expect(canonicalHref).toBeTruthy();
	expect(canonicalHref).toBe(`${SITE_URL}${expectedPath}`);
}

async function expectAlternateLinks(page: Page, expectedPath: string) {
	for (const locale of LOCALES) {
		const href = await page
			.locator(`link[rel="alternate"][hreflang="${locale}"]`)
			.getAttribute("href");
		expect(href).toBe(`${SITE_URL}/${locale}${expectedPath}`);
	}

	const defaultHref = await page
		.locator('link[rel="alternate"][hreflang="x-default"]')
		.getAttribute("href");
	expect(defaultHref).toBe(`${SITE_URL}/en${expectedPath}`);
}

test.describe("SEO metadata", () => {
	for (const locale of LOCALES) {
		test(`should render canonical and hreflang correctly on the localized home page in ${locale}`, async ({
			page,
		}) => {
			await navigateToLocalized(page, locale);
			await expect(page).toHaveURL(new RegExp(`/${locale}$`));

			await expectCanonicalPath(page, `/${locale}`);
			await expectAlternateLinks(page, "");
		});

		test(`should render canonical and hreflang correctly on the public events page in ${locale}`, async ({
			page,
		}) => {
			await navigateToLocalized(page, locale, "/events");
			await expect(page).toHaveURL(new RegExp(`/${locale}/events$`));

			await expectCanonicalPath(page, `/${locale}/events`);
			await expectAlternateLinks(page, "/events");
		});
	}

	test("should render canonical metadata and structured event data on the public event detail page", async ({
		page,
	}) => {
		await navigateToLocalized(page, "en", `/events/${TEST_EVENT_ID}`);
		await expect(page).toHaveURL(new RegExp(`/en/events/${TEST_EVENT_ID}$`));

		await expectCanonicalPath(page, `/en/events/${TEST_EVENT_ID}`);
		await expectAlternateLinks(page, `/events/${TEST_EVENT_ID}`);

		const jsonLdScripts = await page
			.locator('script[type="application/ld+json"]')
			.allTextContents();
		const eventJsonLd = jsonLdScripts.find((script) => script.includes('"@type":"Event"'));

		expect(eventJsonLd).toBeTruthy();
		expect(eventJsonLd).toContain(`${SITE_URL}/en/events/${TEST_EVENT_ID}`);
		expect(eventJsonLd).toContain('"inLanguage":"en"');
	});

	test("should expose localized URLs in sitemap.xml", async ({ page }) => {
		const response = await page.request.get("/sitemap.xml");
		expect(response.ok()).toBeTruthy();

		const xml = await response.text();

		for (const locale of LOCALES) {
			expect(xml).toContain(`${SITE_URL}/${locale}`);
			expect(xml).toContain(`${SITE_URL}/${locale}/events`);
		}

		expect(xml).toContain(`${SITE_URL}/en/events/${TEST_EVENT_ID}`);
		expect(xml).not.toContain("/agenda");
	});
});
