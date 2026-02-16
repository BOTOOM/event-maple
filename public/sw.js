self.addEventListener("install", () => {
	console.log("Service Worker installing.");
	self.skipWaiting();
});

self.addEventListener("activate", () => {
	console.log("Service Worker activating.");
	self.clients.claim();
});

self.addEventListener("fetch", (_event) => {
	// Pass-through for now
});
