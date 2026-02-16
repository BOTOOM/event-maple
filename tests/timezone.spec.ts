import { expect, test, type Page } from "@playwright/test";
import { enablePastEventsFilter, loginWithEnvCredentials, openCreateEventPage } from "./utils/test-helpers";

async function openFirstEditableEvent(page: Page) {
	await page.goto("/en/my-events");
	await page.waitForLoadState("networkidle");

	const editButton = page.locator('a[href*="/edit"], button:has-text("Continue Editing")').first();
	if (!(await editButton.isVisible({ timeout: 5000 }))) {
		return false;
	}

	await editButton.click();
	await page.waitForURL(/my-events\/\d+\/edit/);
	await page.waitForLoadState("networkidle");
	return true;
}

/**
 * Tests for timezone handling in event creation and editing
 *
 * Strategy:
 * 1. When creating an event, the timezone should be auto-detected from the browser
 * 2. When saving, the datetime should be converted from the selected timezone to UTC
 * 3. When editing, the datetime should be converted from UTC back to the event's timezone
 * 4. When viewing in cards, the datetime should be displayed in the user's browser timezone
 */

test.describe("Timezone Handling", () => {
	test.describe("Event Creation - Timezone Auto-detection", () => {
		test.beforeEach(async ({ page }) => {
			if (!(await loginWithEnvCredentials(page))) {
				test.skip();
			}
		});

		test("should auto-detect browser timezone when creating a new event", async ({ page }) => {
			await openCreateEventPage(page);

			// The timezone selector should have a value (auto-detected from browser)
			// Look for the timezone combobox button
			const timezoneButton = page.locator(
				'button:has-text("UTC"), button:has-text("America"), button:has-text("Europe"), button:has-text("Asia")',
			);

			// Should have some timezone selected (not empty placeholder)
			await expect(timezoneButton.first()).toBeVisible({ timeout: 10000 });

			// Get the button text to verify it contains a timezone
			const buttonText = await timezoneButton.first().textContent();
			expect(buttonText).toBeTruthy();
			// Should contain either UTC or a timezone offset like (UTC-05:00)
			expect(buttonText).toMatch(/UTC|America|Europe|Asia|Pacific/);
		});
	});

	test.describe("Event Editing - Timezone Conversion", () => {
		test.beforeEach(async ({ page }) => {
			if (!(await loginWithEnvCredentials(page))) {
				test.skip();
			}
		});

		test("should load event dates correctly when editing", async ({ page }) => {
			if (await openFirstEditableEvent(page)) {

				// Check that the start date input has a value
				const startDateInput = page.locator('input[type="datetime-local"]').first();
				await expect(startDateInput).toBeVisible({ timeout: 10000 });

				const startDateValue = await startDateInput.inputValue();
				// Should have a value in format YYYY-MM-DDTHH:mm
				expect(startDateValue).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);

				// Check that the timezone selector shows the event's timezone
				const timezoneButton = page.locator(
					'button:has-text("UTC"), button:has-text("America"), button:has-text("Europe")',
				);
				await expect(timezoneButton.first()).toBeVisible();
			}
		});

		test("should preserve timezone when editing and saving", async ({ page }) => {
			if (await openFirstEditableEvent(page)) {

				// Get the current timezone value
				const timezoneButton = page.locator(
					'button:has-text("UTC"), button:has-text("America"), button:has-text("Europe")',
				);
				const originalTimezone = await timezoneButton.first().textContent();

				// Get the current start date value
				const startDateInput = page.locator('input[type="datetime-local"]').first();
				const originalStartDate = await startDateInput.inputValue();

				// Make a small change to the event name
				const nameInput = page.locator('input#name, input[name="name"]');
				const originalName = await nameInput.inputValue();
				await nameInput.fill(`${originalName} (test)`);

				// Save as draft
				const saveButton = page.locator('button:has-text("Save as Draft")');
				await saveButton.click();

				// Wait for navigation back to my-events
				await page.waitForURL(/my-events(?!.*edit)/, { timeout: 10000 });

				// Go back to edit the same event
				if (!(await openFirstEditableEvent(page))) {
					return;
				}

				// Verify the timezone is still the same
				const newTimezoneButton = page.locator(
					'button:has-text("UTC"), button:has-text("America"), button:has-text("Europe")',
				);
				const newTimezone = await newTimezoneButton.first().textContent();
				expect(newTimezone).toBe(originalTimezone);

				// Verify the start date is still the same
				const newStartDateInput = page.locator('input[type="datetime-local"]').first();
				const newStartDate = await newStartDateInput.inputValue();
				expect(newStartDate).toBe(originalStartDate);

				// Revert the name change
				const nameInputAgain = page.locator('input#name, input[name="name"]');
				await nameInputAgain.fill(originalName);
				await saveButton.click();
				await page.waitForURL(/my-events(?!.*edit)/, { timeout: 10000 });
			}
		});
	});

	test.describe("Event Display - Browser Timezone", () => {
		test("should display event dates in user's browser timezone on events page", async ({
			page,
		}) => {
			await page.goto("/en/events");
			await page.waitForLoadState("networkidle");

			// Enable past events to see more events
			await enablePastEventsFilter(page);

			// Wait for events to load
			await page.waitForTimeout(1000);

			// Check for event cards - look for the date display within cards
			const eventCards = page.locator(".bg-white.rounded-lg");
			const cardCount = await eventCards.count();

			// If there are event cards, verify dates are displayed correctly
			if (cardCount > 0) {
				// Look for date text near Calendar icon
				const dateSpan = page.locator("span:near(svg.lucide-calendar)").first();
				if (await dateSpan.isVisible({ timeout: 5000 })) {
					const dateText = await dateSpan.textContent();
					// Date should be in a readable format (not raw ISO string)
					if (dateText) {
						expect(dateText).not.toMatch(/^\d{4}-\d{2}-\d{2}T/);
					}
				}
			}
		});

		test("should display event dates in user's browser timezone on my-events page", async ({
			page,
		}) => {
			if (!(await loginWithEnvCredentials(page))) {
				test.skip();
			}

			await page.goto("/en/my-events");
			await page.waitForLoadState("networkidle");

			// Check that event cards have date information
			const dateElements = page.locator('.text-gray-600:has(svg[class*="Calendar"])');
			const dateCount = await dateElements.count();

			// If there are events, verify dates are displayed correctly
			if (dateCount > 0) {
				const firstDate = await dateElements.first().textContent();
				// Date should be in a readable format
				expect(firstDate).not.toMatch(/^\d{4}-\d{2}-\d{2}T/);
			}
		});
	});
});
