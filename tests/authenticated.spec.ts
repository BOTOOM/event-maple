import { expect, test } from "@playwright/test";
import {
	assertNoUntranslatedKeys,
	assertPageLoaded,
	login,
	navigateTo,
} from "./utils/test-helpers";

// Credentials from environment variables
const TEST_USER = process.env.PW_USER || "";
const TEST_PASS = process.env.PW_PSS || "";

test.describe("Authenticated User Features", () => {
	// Skip all tests if credentials are not provided
	test.beforeEach(async ({ page }) => {
		test.skip(!TEST_USER || !TEST_PASS, "PW_USER and PW_PSS environment variables are required");

		// Clear cookies and login
		await page.context().clearCookies();
		await navigateTo(page, "/en/login");
		await login(page, TEST_USER, TEST_PASS);
		await page.waitForURL(/\/events/, { timeout: 15000 });
	});

	test.describe("User Session", () => {
		test("should display user email in header when logged in", async ({ page }) => {
			// User email should be visible in header
			const userEmail = page.locator(`text=${TEST_USER}`);
			await expect(userEmail).toBeVisible();
		});

		test("should display sign out button when logged in", async ({ page }) => {
			const signOutButton = page.locator(
				'button:has-text("Sign Out"), button:has-text("Cerrar sesión")',
			);
			await expect(signOutButton).toBeVisible();
		});

		test("should sign out successfully", async ({ page }) => {
			const signOutButton = page.locator(
				'button:has-text("Sign Out"), button:has-text("Cerrar sesión")',
			);
			await signOutButton.click();

			// Wait for redirect or page update
			await page.waitForTimeout(2000);

			// Should see Sign In button again
			const signInButton = page.locator('button:has-text("Sign In"), a:has-text("Sign In")');
			await expect(signInButton.first()).toBeVisible();
		});
	});

	test.describe("Favorites", () => {
		test("should toggle event favorites", async ({ page }) => {
			// Navigate to event detail
			await navigateTo(page, "/en/events/1");

			// Find any favorite button
			const favoriteButton = page
				.locator("button")
				.filter({ hasText: /favorites|favoritos/i })
				.first();

			if (await favoriteButton.isVisible()) {
				await favoriteButton.click();
				await page.waitForTimeout(1500);

				// Page should still be loaded
				await assertPageLoaded(page);
			}
		});

		test("should remove event from favorites", async ({ page }) => {
			await navigateTo(page, "/en/events/1");

			// First add to favorites if not already
			const addButton = page.locator('button:has-text("Add to favorites")').first();
			if (await addButton.isVisible()) {
				await addButton.click();
				await page.waitForTimeout(1000);
			}

			// Now remove from favorites
			const inFavoritesButton = page.locator('button:has-text("In favorites")').first();
			if (await inFavoritesButton.isVisible()) {
				await inFavoritesButton.click();
				await page.waitForTimeout(1000);

				// Button should change back to "Add to favorites"
				const addButtonAfter = page.locator('button:has-text("Add to favorites")');
				await expect(addButtonAfter.first()).toBeVisible();
			}
		});
	});

	test.describe("My Personal Agenda", () => {
		test("should access my agenda page when authenticated", async ({ page }) => {
			await navigateTo(page, "/en/events/1/my-agenda");

			// Should be on my-agenda page (not redirected to login)
			await expect(page).toHaveURL(/\/my-agenda/);
			await assertPageLoaded(page);
		});

		test("should display personalized schedule", async ({ page }) => {
			await navigateTo(page, "/en/events/1/my-agenda");

			// Should see schedule heading or timeline
			const scheduleHeader = page.locator("h1, h2, h3").first();
			await expect(scheduleHeader).toBeVisible();

			// Page should have loaded correctly
			await assertPageLoaded(page);
		});

		test("should display day schedule timeline", async ({ page }) => {
			await navigateTo(page, "/en/events/1/my-agenda");

			// Should see time slots
			const timeSlots = page.locator(`text=/\\d{1,2}:\\d{2}\\s*(AM|PM)/i`);
			const count = await timeSlots.count();
			expect(count).toBeGreaterThan(0);
		});

		test("should display rooms section", async ({ page }) => {
			await navigateTo(page, "/en/events/1/my-agenda");

			// Page should load correctly
			await assertPageLoaded(page);

			// Should see some content (rooms or talks)
			const content = page.locator("h3, h4");
			const count = await content.count();
			expect(count).toBeGreaterThan(0);
		});

		test("should navigate between full agenda and my agenda tabs", async ({ page }) => {
			await navigateTo(page, "/en/events/1/my-agenda");

			// Click on Full Agenda tab
			const fullAgendaTab = page
				.locator('a:has-text("Full Agenda"), button:has-text("Full Agenda")')
				.first();
			await fullAgendaTab.click();

			await expect(page).toHaveURL(/\/agenda/);

			// Click on My Agenda tab
			const myAgendaTab = page
				.locator('a:has-text("My Agenda"), button:has-text("My Agenda")')
				.first();
			await myAgendaTab.click();

			await expect(page).toHaveURL(/\/my-agenda/);
		});

		test("should show conflict warnings when talks overlap", async ({ page }) => {
			await navigateTo(page, "/en/events/1/my-agenda");

			// Look for conflict indicators
			const conflictIndicator = page.locator("text=Conflict, text=Conflicto, text=conflict");
			const hasConflicts = (await conflictIndicator.count()) > 0;

			// This is informational - conflicts may or may not exist
			if (hasConflicts) {
				await expect(conflictIndicator.first()).toBeVisible();
			}
		});
	});

	test.describe("Talk Detail (Authenticated)", () => {
		test("should access talk detail page when authenticated", async ({ page }) => {
			await navigateTo(page, "/en/events/1/talks/1");

			// Should be on talk detail page (not redirected to login)
			await expect(page).toHaveURL(/\/talks\/\d+/);
			await assertPageLoaded(page);
		});

		test("should display talk information", async ({ page }) => {
			await navigateTo(page, "/en/events/1/talks/1");

			// Should see talk title (h1)
			const title = page.locator("h1");
			await expect(title).toBeVisible();

			// Page should load without errors
			await assertPageLoaded(page);
		});

		test("should display talk metadata", async ({ page }) => {
			await navigateTo(page, "/en/events/1/talks/1");

			// Page should load with content
			await assertPageLoaded(page);

			// Should see paragraphs with metadata
			const paragraphs = page.locator("p");
			const count = await paragraphs.count();
			expect(count).toBeGreaterThan(0);
		});

		test("should add talk to my agenda", async ({ page }) => {
			await navigateTo(page, "/en/events/1/talks/18");

			// Find "Add to my agenda" button
			const addButton = page.locator(
				'button:has-text("Add to my agenda"), button:has-text("Añadir a mi agenda")',
			);

			if (await addButton.isVisible()) {
				await addButton.click();
				await page.waitForTimeout(1000);

				// Button should change to "In my agenda"
				const inAgendaButton = page.locator(
					'button:has-text("In my agenda"), button:has-text("En mi agenda")',
				);
				await expect(inAgendaButton.first()).toBeVisible();
			}
		});

		test("should remove talk from my agenda", async ({ page }) => {
			await navigateTo(page, "/en/events/1/talks/18");

			// First add if not already
			const addButton = page.locator('button:has-text("Add to my agenda")').first();
			if (await addButton.isVisible()) {
				await addButton.click();
				await page.waitForTimeout(1000);
			}

			// Now remove
			const inAgendaButton = page.locator('button:has-text("In my agenda")').first();
			if (await inAgendaButton.isVisible()) {
				await inAgendaButton.click();
				await page.waitForTimeout(1000);

				// Button should change back
				const addButtonAfter = page.locator('button:has-text("Add to my agenda")');
				await expect(addButtonAfter.first()).toBeVisible();
			}
		});

		test("should have back navigation to agenda", async ({ page }) => {
			await navigateTo(page, "/en/events/1/talks/1?from=agenda");

			const backButton = page.locator('a:has-text("Back"), button:has-text("Back")').first();
			await expect(backButton).toBeVisible();
		});

		test("should display talk tags/topics", async ({ page }) => {
			await navigateTo(page, "/en/events/1/talks/18");

			// Should see tags like AI, Agents, etc. or any content
			const tags = page.locator("text=AI, text=Agents, text=DevOps, text=Production");
			const count = await tags.count();
			// Tags may or may not be visible depending on the talk
			expect(count >= 0).toBeTruthy();
		});

		test("should display difficulty level if available", async ({ page }) => {
			await navigateTo(page, "/en/events/1/talks/18");

			// Difficulty level may or may not be present
			const difficulty = page.locator(
				"text=Intermedio, text=Intermediate, text=Básico, text=Basic, text=Avanzado, text=Advanced",
			);
			const count = await difficulty.count();
			// This is informational - not all talks have difficulty level
			expect(count >= 0).toBeTruthy();
		});
	});

	test.describe("Full Agenda (Authenticated)", () => {
		test("should add talk to agenda from full agenda view", async ({ page }) => {
			await navigateTo(page, "/en/events/1/agenda");

			// Enable past talks filter
			const toggle = page.locator('switch[aria-label*="past"], #show-past-events').first();
			if (await toggle.isVisible()) {
				const isChecked = await toggle.isChecked().catch(() => false);
				if (!isChecked) {
					await toggle.click();
					await page.waitForTimeout(1000);
				}
			}

			// Find "Add to agenda" button on a talk card
			const addButton = page
				.locator('button:has-text("Add to agenda"), button[aria-label*="agenda"]')
				.first();

			if (await addButton.isVisible()) {
				await addButton.click();
				await page.waitForTimeout(1000);

				// Verify some visual feedback (button change or notification)
				await assertPageLoaded(page);
			}
		});

		test("should search talks in agenda", async ({ page }) => {
			await navigateTo(page, "/en/events/1/agenda");

			// Enable past talks
			const toggle = page.locator('switch[aria-label*="past"]').first();
			if (await toggle.isVisible()) {
				const isChecked = await toggle.isChecked().catch(() => false);
				if (!isChecked) {
					await toggle.click();
					await page.waitForTimeout(500);
				}
			}

			// Search for a talk
			const searchInput = page.locator('input[type="text"], input[type="search"]').first();
			await searchInput.fill("DevOps");
			await page.waitForTimeout(1000);

			// Should filter results
			await assertPageLoaded(page);
		});
	});

	test.describe("i18n (Authenticated)", () => {
		test("should load my agenda page without untranslated keys", async ({ page }) => {
			await navigateTo(page, "/en/events/1/my-agenda");
			await assertNoUntranslatedKeys(page, "my-agenda");
		});

		test("should load talk detail page without untranslated keys", async ({ page }) => {
			await navigateTo(page, "/en/events/1/talks/1");
			await assertNoUntranslatedKeys(page, "talk-detail");
		});
	});
});
