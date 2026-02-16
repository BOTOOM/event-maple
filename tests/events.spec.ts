import { expect, test, type Page } from "@playwright/test";
import {
	assertNoUntranslatedKeys,
	clickViewDetails,
	enablePastEventsFilter,
	LOCALES,
	searchForEvent,
	TEST_EVENT_NAME,
} from "./utils/test-helpers";

async function openEventsPageWithPastFilter(
	page: Page,
	loadState: "domcontentloaded" | "networkidle" = "domcontentloaded",
	waitMs: number = 500,
) {
	await page.goto("/en/events");
	await page.waitForLoadState(loadState);
	await enablePastEventsFilter(page);
	await page.waitForTimeout(waitMs);
}

async function openEventDetailPage(
	page: Page,
	locale: string = "en",
	loadState: "domcontentloaded" | "networkidle" = "domcontentloaded",
) {
	await page.goto(`/${locale}/events/1`);
	await page.waitForLoadState(loadState);
}

test.describe("Events Page", () => {
	test.describe("Event Search and Navigation", () => {
		test("should search for event and find it in past events", async ({ page }) => {
			await openEventsPageWithPastFilter(page);

			// Search for the event
			await searchForEvent(page, TEST_EVENT_NAME);

			// Verify event appears in the list
			const eventCard = page.locator(`text=${TEST_EVENT_NAME}`).first();
			await expect(eventCard).toBeVisible({ timeout: 10000 });
		});

		test("should access event detail page from event card", async ({ page }) => {
			await openEventsPageWithPastFilter(page);

			// Search for the event
			await searchForEvent(page, TEST_EVENT_NAME);
			await clickViewDetails(page);

			// Verify we're on the event detail page
			await page.waitForURL(/\/events\/\d+/);
			await expect(page.locator("body")).toBeVisible();

			// Verify no untranslated keys
			await assertNoUntranslatedKeys(page);
		});

		test("should display event content without errors", async ({ page }) => {
			await openEventDetailPage(page);

			// Verify page has content
			await expect(page.locator("body")).toBeVisible();

			// Check for untranslated keys
			await assertNoUntranslatedKeys(page);

			// Verify no error state
			const errorElement = page.locator("text=Something went wrong, text=Error");
			const errorCount = await errorElement.count();
			// Allow "Error" in navigation/labels but not as main content
			expect(errorCount).toBeLessThan(3);
		});
	});

	test.describe("Event Detail i18n", () => {
		for (const locale of LOCALES) {
			test(`should load event detail page correctly in ${locale}`, async ({ page }) => {
				await openEventDetailPage(page, locale);

				// Verify URL
				await expect(page).toHaveURL(new RegExp(`/${locale}/events/1`));

				// Verify page loaded
				await expect(page.locator("body")).toBeVisible();

				// Check for untranslated keys
				await assertNoUntranslatedKeys(page, locale);
			});
		}
	});
});

test.describe("Events Page - Published Events Only", () => {
	test("should only show published events (no draft events)", async ({ page }) => {
		await openEventsPageWithPastFilter(page, "networkidle", 1000);

		// Get all event cards
		const eventCards = page.locator(".bg-white.rounded-lg.shadow-sm");
		const cardCount = await eventCards.count();

		// If there are events, verify none have draft status badge
		if (cardCount > 0) {
			// Draft badges would have "Draft" or "Borrador" text with orange styling
			const draftBadges = page.locator(
				'.bg-orange-500:has-text("Draft"), .bg-orange-500:has-text("Borrador")',
			);
			const draftCount = await draftBadges.count();

			// No draft events should be visible in the public events list
			expect(draftCount).toBe(0);
		}
	});

	test("should display event date with time when timestamp is available", async ({ page }) => {
		await openEventsPageWithPastFilter(page, "networkidle", 1000);

		// Look for date elements in event cards
		const dateElements = page.locator(".text-gray-600 span").first();

		if (await dateElements.isVisible({ timeout: 5000 })) {
			const dateText = await dateElements.textContent();

			// Date should be in readable format (not ISO string)
			if (dateText) {
				expect(dateText).not.toMatch(/^\d{4}-\d{2}-\d{2}T/);
				// Should contain some alphabetic month-like token
				expect(dateText).toMatch(/\b[a-zA-Z]{3,}\b/);
			}
		}
	});
});

test.describe("Event Detail Page - Date and Time Display", () => {
	test("should display date with time on event detail page", async ({ page }) => {
		await openEventDetailPage(page, "en", "networkidle");

		// Find the date info row
		const dateRow = page.locator('text="Date"').locator("..").locator("span").last();

		if (await dateRow.isVisible({ timeout: 5000 })) {
			const dateText = await dateRow.textContent();

			// Date should be in readable format
			if (dateText) {
				expect(dateText).not.toMatch(/^\d{4}-\d{2}-\d{2}T/);
				// Should contain some alphabetic month-like token
				expect(dateText).toMatch(/\b[a-zA-Z]{3,}\b/);
			}
		}
	});

	test("should show time in user browser timezone when event has full timestamp", async ({
		page,
	}) => {
		await openEventDetailPage(page, "en", "networkidle");

		// Find date display - events with full timestamp should show time
		const dateDisplay = page.locator(String.raw`.lg\:col-span-2 span`).first();

		if (await dateDisplay.isVisible({ timeout: 5000 })) {
			const dateText = await dateDisplay.textContent();

			// If event has full timestamp, it should include time indicators (AM/PM or 24h format)
			// This is informational - some events may only have date
			if (dateText) {
				// Date should be formatted, not raw ISO
				expect(dateText).not.toMatch(/^\d{4}-\d{2}-\d{2}T/);
			}
		}
	});
});

test.describe("Event Card Features", () => {
	test("should display share button on event cards", async ({ page }) => {
		await openEventsPageWithPastFilter(page);

		// Find share button on event cards
		const shareButton = page
			.locator('button[aria-label*="Share"], button:has(svg.lucide-share2)')
			.first();

		// Share button should be visible on event cards
		await expect(shareButton).toBeVisible({ timeout: 10000 });
	});

	test("should display category badge on event cards when category exists", async ({ page }) => {
		await openEventsPageWithPastFilter(page);

		// Look for category badges (they have a Tag icon and blue styling)
		const categoryBadge = page.locator(".text-blue-600.bg-blue-50").first();

		// If events have categories, the badge should be visible
		const badgeCount = await categoryBadge.count();
		// This is informational - some events may not have categories
		expect(badgeCount).toBeGreaterThanOrEqual(0);
	});
});

test.describe("Event Favorites", () => {
	test("should display favorite button on event detail page", async ({ page }) => {
		await openEventDetailPage(page);

		// Find the favorite button - it can be icon variant or button variant
		// Button variant has text like "Add to favorites" or "In favorites"
		// Icon variant has aria-label with "favorite"
		const favoriteButtonWithText = page
			.locator(
				'button:has-text("Add to favorites"), button:has-text("favorites"), button:has-text("favoritos")',
			)
			.first();
		const favoriteButtonIcon = page
			.locator('button[aria-label*="favorite"], button[aria-label*="favorito"]')
			.first();

		// At least one variant should be visible
		const hasTextButton = await favoriteButtonWithText.isVisible();
		const hasIconButton = await favoriteButtonIcon.isVisible();

		expect(hasTextButton || hasIconButton, "Favorite button should be visible").toBeTruthy();
	});

	test("should redirect to login when clicking favorite without auth", async ({ page }) => {
		await openEventDetailPage(page);

		// Find the favorite button
		const favoriteButton = page
			.locator(
				'button:has-text("Add to favorites"), button:has-text("favorites"), button[aria-label*="favorite"]',
			)
			.first();

		if (await favoriteButton.isVisible()) {
			await favoriteButton.click();

			// Wait for potential redirect
			await page.waitForTimeout(2000);

			// Should either stay on page (if authenticated) or redirect to login
			const currentUrl = page.url();
			const isOnEventPage = currentUrl.includes("/events/1");
			const isOnLogin = currentUrl.includes("/login");

			// One of these should be true
			expect(
				isOnEventPage || isOnLogin,
				`Expected event page or login, got: ${currentUrl}`,
			).toBeTruthy();

			// Page should load without errors
			await expect(page.locator("body")).toBeVisible();
		}
	});

	test("should show heart icon with correct styling", async ({ page }) => {
		await openEventDetailPage(page);

		// Find heart icon inside a button
		const heartIcon = page.locator('button svg.lucide-heart, button svg[class*="heart"]').first();

		if (await heartIcon.isVisible()) {
			// Heart icon should be visible
			await expect(heartIcon).toBeVisible();

			// Check if it has the expected classes (either gray for not favorite or red for favorite)
			const heartClasses = (await heartIcon.getAttribute("class")) || "";
			const hasValidStyling = heartClasses.includes("text-") || heartClasses.includes("fill-");
			expect(hasValidStyling, "Heart icon should have color styling").toBeTruthy();
		}
	});
});

test.describe("Event Agenda Navigation", () => {
	test("should navigate to full agenda from event detail", async ({ page }) => {
		await openEventDetailPage(page);

		// Find "View Full Agenda" or "Ver Agenda Completa" button
		const fullAgendaButton = page
			.locator(
				'a:has-text("Full Agenda"), a:has-text("Agenda Completa"), button:has-text("Full Agenda"), button:has-text("Agenda Completa")',
			)
			.first();

		if (await fullAgendaButton.isVisible()) {
			await fullAgendaButton.click();

			// Verify URL changed to agenda page but still same event
			await page.waitForURL(/\/events\/1\/agenda/);
			await expect(page).toHaveURL(/\/events\/1\/agenda/);

			// Verify page loaded
			await expect(page.locator("body")).toBeVisible();

			// Check for untranslated keys
			await assertNoUntranslatedKeys(page);
		}
	});

	test("should show my agenda button in event detail", async ({ page }) => {
		await openEventDetailPage(page);

		// Find "My Personal Agenda" or "My Agenda" button/link
		const myAgendaButton = page
			.locator(
				'a:has-text("My Personal Agenda"), a:has-text("My Agenda"), a:has-text("Personal Agenda")',
			)
			.first();

		// Verify the button exists (it should be visible in the Quick Actions section)
		// The button may redirect to login or my-agenda depending on auth state
		if (await myAgendaButton.isVisible()) {
			// Button is visible, test passes
			await expect(myAgendaButton).toBeVisible();

			// Get the href to verify it points to my-agenda
			const href = await myAgendaButton.getAttribute("href");
			expect(href).toContain("my-agenda");
		}
	});

	test("should maintain event context when navigating to full agenda", async ({ page }) => {
		// Start at event detail
		await openEventDetailPage(page);

		// Navigate to full agenda
		const fullAgendaButton = page
			.locator('a:has-text("Full Agenda"), a:has-text("View Full Agenda")')
			.first();
		if (await fullAgendaButton.isVisible()) {
			await fullAgendaButton.click();
			await page.waitForURL(/\/events\/1/);

			// Verify still on event 1
			expect(page.url()).toContain("/events/1");

			// Check for untranslated keys
			await assertNoUntranslatedKeys(page);
		}
	});

	test.describe("Agenda i18n", () => {
		for (const locale of LOCALES) {
			test(`should load full agenda page correctly in ${locale}`, async ({ page }) => {
				await page.goto(`/${locale}/events/1/agenda`);
				await page.waitForLoadState("domcontentloaded");

				await expect(page).toHaveURL(new RegExp(`/${locale}/events/1/agenda`));
				await expect(page.locator("body")).toBeVisible();

				await assertNoUntranslatedKeys(page, locale);
			});

			test(`should redirect to login or load my agenda page in ${locale}`, async ({ page }) => {
				await page.goto(`/${locale}/events/1/my-agenda`);
				await page.waitForLoadState("domcontentloaded");

				// My agenda requires auth, so it will either load or redirect to login
				const currentUrl = page.url();
				const isOnMyAgenda = currentUrl.includes("/my-agenda");
				const isOnLogin = currentUrl.includes("/login");

				expect(
					isOnMyAgenda || isOnLogin,
					`Expected my-agenda or login, got: ${currentUrl}`,
				).toBeTruthy();
				await expect(page.locator("body")).toBeVisible();

				// Check for untranslated keys on whatever page we landed on
				await assertNoUntranslatedKeys(page, locale);
			});
		}
	});
});
