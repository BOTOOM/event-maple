import { defineConfig, devices } from "@playwright/test";

process.env.PLAYWRIGHT_BROWSERS_PATH ??= "0";

const DEFAULT_PLAYWRIGHT_PORT = 3100;
const envPortRaw = process.env.PLAYWRIGHT_PORT;
const envPort = envPortRaw === undefined ? DEFAULT_PLAYWRIGHT_PORT : Number(envPortRaw);
const PLAYWRIGHT_PORT =
	Number.isFinite(envPort) && envPort > 0 && envPort <= 65535 ? envPort : DEFAULT_PLAYWRIGHT_PORT;
const PLAYWRIGHT_BASE_URL = `http://localhost:${PLAYWRIGHT_PORT}`;

/**
 * Playwright configuration for Event Planner
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
	testDir: "./tests",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: [["html"], ["list"]],

	use: {
		baseURL: PLAYWRIGHT_BASE_URL,
		trace: "on-first-retry",
		screenshot: "only-on-failure",
	},

	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],

	webServer: {
		command: `pnpm run dev --port ${PLAYWRIGHT_PORT} --hostname localhost`,
		url: PLAYWRIGHT_BASE_URL,
		reuseExistingServer: !process.env.CI,
		timeout: 120 * 1000,
	},
});
