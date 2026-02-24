const baselineWarningPrefix = "[baseline-browser-mapping]";
const originalWarn = console.warn.bind(console);

console.warn = (...args) => {
	if (typeof args[0] === "string" && args[0].startsWith(baselineWarningPrefix)) {
		return;
	}

	originalWarn(...args);
};
