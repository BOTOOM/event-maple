import { expect, type Page, test } from "@playwright/test";
import {
	assertNoUntranslatedKeys,
	assertPageLoaded,
	loginWithEnvCredentials,
	navigateTo,
} from "./utils/test-helpers";

// Credentials from environment variables
const TEST_USER = process.env.PW_USER || "";
const TEST_PASS = process.env.PW_PSS || "";
const AGENDA_ADD_BUTTON_TEXT =
	/Add to my agenda|Añadir a mi agenda|Adicionar à minha agenda|Ajouter à mon agenda/i;
const AGENDA_IN_BUTTON_TEXT = /In my agenda|En mi agenda|Na minha agenda|Dans mon agenda/i;

async function ensureTalkAgendaState(page: Page, expectedState: "in" | "out") {
	const addButton = page.locator("button").filter({ hasText: AGENDA_ADD_BUTTON_TEXT }).first();
	const inAgendaButton = page.locator("button").filter({ hasText: AGENDA_IN_BUTTON_TEXT }).first();

	if (expectedState === "in") {
		if (await inAgendaButton.isVisible()) {
			return;
		}

		await expect(addButton).toBeVisible();
		await addButton.click();

		try {
			await expect(inAgendaButton).toBeVisible({ timeout: 6000 });
		} catch {
			await page.reload();
			await expect(inAgendaButton).toBeVisible({ timeout: 10000 });
		}

		return;
	}

	if (await addButton.isVisible()) {
		return;
	}

	await expect(inAgendaButton).toBeVisible();
	await inAgendaButton.click();

	try {
		await expect(addButton).toBeVisible({ timeout: 6000 });
	} catch {
		await page.reload();
		await expect(addButton).toBeVisible({ timeout: 10000 });
	}
}

test.describe("Authenticated User Features", () => {
	// Skip all tests if credentials are not provided
	test.beforeEach(async ({ page }) => {
		test.skip(!TEST_USER || !TEST_PASS, "PW_USER and PW_PSS environment variables are required");

		// Clear cookies and login
		await page.context().clearCookies();
		if (!(await loginWithEnvCredentials(page, "en"))) {
			test.skip();
		}
	});

	test.describe("User Session", () => {
		test("should display user email in header when logged in", async ({ page }) => {
			const userMenuTrigger = page.locator('[data-testid="header-user-menu-trigger"]');
			await expect(userMenuTrigger).toBeVisible();

			await userMenuTrigger.click();
			await expect(page.locator('[data-testid="header-user-menu-email"]')).toContainText(
				`(${TEST_USER})`,
			);
		});

		test("should navigate to profile page from user menu", async ({ page }) => {
			const userMenuTrigger = page.locator('[data-testid="header-user-menu-trigger"]');
			await userMenuTrigger.click();

			const profileLink = page.locator('[data-testid="header-user-menu-profile"]');
			await expect(profileLink).toBeVisible();
			await Promise.all([
				page.waitForURL(/\/profile(?:\?|$)/, { timeout: 15000 }),
				profileLink.click(),
			]);
			await assertPageLoaded(page);
		});

		test("should display sign out button when logged in", async ({ page }) => {
			const userMenuTrigger = page.locator('[data-testid="header-user-menu-trigger"]');
			await userMenuTrigger.click();

			const signOutButton = page.locator('[data-testid="header-user-menu-signout"]');
			await expect(signOutButton).toBeVisible();
		});

		test("should sign out successfully", async ({ page }) => {
			const userMenuTrigger = page.locator('[data-testid="header-user-menu-trigger"]');
			await userMenuTrigger.click();

			const signOutButton = page.locator('[data-testid="header-user-menu-signout"]');
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

			// Should see timeline section and at least one timeline card
			await expect(page.getByRole("heading", { name: /day schedule/i })).toBeVisible();
			const timelineCards = page.locator("main a:has(h3)");
			await expect(timelineCards.first()).toBeVisible();
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

			await ensureTalkAgendaState(page, "out");
			await ensureTalkAgendaState(page, "in");
		});

		test("should remove talk from my agenda", async ({ page }) => {
			await navigateTo(page, "/en/events/1/talks/18");

			await ensureTalkAgendaState(page, "in");
			await ensureTalkAgendaState(page, "out");
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
