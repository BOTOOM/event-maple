"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
	useEffect(() => {
		if ("serviceWorker" in navigator) {
			navigator.serviceWorker
				.register("/sw.js")
				.then((registration) => console.log("Scope: ", registration.scope))
				.catch((error) => console.error("SW registration failed: ", error));
		}
	}, []);

	return null;
}
