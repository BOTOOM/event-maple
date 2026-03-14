"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
	useEffect(() => {
		if (process.env.NODE_ENV !== "production") return;
		if (!("serviceWorker" in navigator)) return;

		const registerServiceWorker = async () => {
			try {
				const registration = await navigator.serviceWorker.register("/sw.js", {
					scope: "/",
				});
				console.log("Scope: ", registration.scope);
			} catch (error) {
				console.error("SW registration failed: ", error);
			}
		};

		if (document.readyState === "complete") {
			void registerServiceWorker();
			return;
		}

		window.addEventListener("load", registerServiceWorker, { once: true });

		return () => {
			window.removeEventListener("load", registerServiceWorker);
		};
	}, []);

	return null;
}
