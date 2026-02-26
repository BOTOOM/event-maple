import { expect, test, type Locator, type Page } from "@playwright/test";
import { loginWithEnvCredentials } from "./utils/test-helpers";

function formatDateForInput(date: Date): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

function uniqueSuffix(): string {
	return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

async function getAddTalkButton(page: Page): Promise<Locator | null> {
	const addButton = page.getByTestId("talks-add-button");
	if ((await addButton.count()) > 0 && (await addButton.first().isVisible())) {
		return addButton.first();
	}

	const addEmptyButton = page.getByTestId("talks-add-empty-button");
	if ((await addEmptyButton.count()) > 0 && (await addEmptyButton.first().isVisible())) {
		return addEmptyButton.first();
	}

	return null;
}

async function openFirstEditableEvent(page: Page): Promise<boolean> {
	await page.goto("/en/my-events");
	await page.waitForLoadState("networkidle");

	const editButton = page.locator('a[href*="/edit"], button:has-text("Continue Editing")').first();
	if (!(await editButton.isVisible({ timeout: 5000 }))) {
		return false;
	}

	await editButton.click();
	await page.waitForURL(/my-events\/\d+\/edit/);
	await page.waitForLoadState("networkidle");

	const importButton = page.getByTestId("talks-import-button");
	const addButton = await getAddTalkButton(page);

	const hasImport = (await importButton.count()) > 0 && (await importButton.first().isVisible());
	return hasImport && !!addButton;
}

async function openAddTalkForm(page: Page): Promise<void> {
	const addButton = await getAddTalkButton(page);
	expect(addButton).not.toBeNull();

	await addButton!.click();
	await expect(page.locator("#talk-title")).toBeVisible({ timeout: 10000 });
}

test.describe("Talks management in event edit", () => {
	test.beforeEach(async ({ page }) => {
		if (!(await loginWithEnvCredentials(page))) {
			test.skip();
		}
	});

	test("should create a talk from edit page", async ({ page }) => {
		if (!(await openFirstEditableEvent(page))) {
			test.skip();
		}

		await openAddTalkForm(page);

		const talkTitle = `Playwright Talk ${uniqueSuffix()}`;
		const talkDate = formatDateForInput(new Date());

		await page.locator("#talk-title").fill(talkTitle);
		await page.locator("#talk-date").fill(talkDate);
		await page.locator("#talk-start-time").fill("09:00");
		await page.locator("#talk-end-time").fill("10:00");
		await page.locator("#talk-room").fill("PW Room");

		await page.locator('form:has(#talk-title) button[type="submit"]').click();

		await expect(page.locator("#talk-title")).not.toBeVisible({ timeout: 10000 });
		await expect(page.getByText(talkTitle).first()).toBeVisible({ timeout: 15000 });
	});

	test("should validate required fields and time order in talk form", async ({ page }) => {
		if (!(await openFirstEditableEvent(page))) {
			test.skip();
		}

		await openAddTalkForm(page);

		await page.locator('form:has(#talk-title) button[type="submit"]').click();
		await expect(page.getByText("Title is required").first()).toBeVisible({ timeout: 10000 });

		const talkDate = formatDateForInput(new Date());
		await page.locator("#talk-title").fill(`Validation Talk ${uniqueSuffix()}`);
		await page.locator("#talk-date").fill(talkDate);
		await page.locator("#talk-start-time").fill("11:00");
		await page.locator("#talk-end-time").fill("10:00");

		await page.locator('form:has(#talk-title) button[type="submit"]').click();
		await expect(page.getByText("End time must be after start time").first()).toBeVisible({ timeout: 10000 });

		await page.locator('form:has(#talk-title) button[type="button"]').first().click();
		await expect(page.locator("#talk-title")).not.toBeVisible({ timeout: 10000 });
	});

	test("should import talks from CSV file", async ({ page }) => {
		if (!(await openFirstEditableEvent(page))) {
			test.skip();
		}

		await page.getByTestId("talks-import-button").click();
		await expect(page.getByRole("dialog")).toBeVisible({ timeout: 10000 });

		const talkTitle = `Imported Talk ${uniqueSuffix()}`;
		const talkDate = formatDateForInput(new Date());
		const csvContent = [
			"title,date,start_time,end_time,room",
			`"${talkTitle}",${talkDate},14:00,14:45,"Imported Room"`,
		].join("\n");

		await page.locator("#talks-import-file").setInputFiles({
			name: "talks-import.csv",
			mimeType: "text/csv",
			buffer: Buffer.from(csvContent, "utf-8"),
		});

		await expect(page.getByText("1 talk(s) ready to import")).toBeVisible({ timeout: 10000 });

		await page.getByRole("button", { name: /Import \d+ talk\(s\)/i }).click();
		await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 15000 });
		await expect(page.getByText(talkTitle).first()).toBeVisible({ timeout: 15000 });
	});
});
