import { expect, test } from "@playwright/test";
import { assertPageLoaded, loginWithEnvCredentials, navigateTo } from "./utils/test-helpers";

const TEST_EMAIL = process.env.PW_USER || "";
const TEST_PASS = process.env.PW_PSS || "";

test.describe("My Events - Editing Published Events", () => {
	test.beforeEach(async ({ page }) => {
		if (!TEST_EMAIL || !TEST_PASS) {
			test.skip(true, "Credentials not provided");
		}

		if (!(await loginWithEnvCredentials(page, "en"))) {
			test.skip(true, "Unable to login with environment credentials");
		}
	});

	test("should show correct buttons when editing a published event", async ({ page }) => {
		await navigateTo(page, "/en/my-events");
		await assertPageLoaded(page);

		const publishedCard = page
			.locator("div.bg-card")
			.filter({ has: page.getByText(/^Published$/) })
			.first();

		if ((await publishedCard.count()) === 0) {
			test.skip(true, "No published events available to validate edit flow");
		}

		await expect(publishedCard).toBeVisible();

		const editLink = publishedCard.locator('a[href*="/my-events/"][href$="/edit"]').first();
		await expect(editLink).toBeVisible();
		await editLink.click();

		await expect(page).toHaveURL(/\/en\/my-events\/\d+\/edit/);
		await assertPageLoaded(page);

		const saveChangesButton = page.getByRole("button", { name: /Save Changes/i });
		const unpublishButton = page.getByRole("button", { name: /Unpublish Event/i });
		const publishedWarning = page.getByText(/This event is currently published/i);

		await expect(saveChangesButton).toBeVisible();
		await expect(unpublishButton).toBeVisible();
		await expect(publishedWarning).toBeVisible();
	});
});
