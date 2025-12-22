import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "EventMaple",
		short_name: "EventMaple",
		description: "La forma más inteligente de organizar tu evento",
		start_url: "/",
		display: "standalone",
		background_color: "#ffffff",
		theme_color: "#000000",
		icons: [
			{
				src: "/icon/192",
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "/icon/512",
				sizes: "512x512",
				type: "image/png",
			},
		],
	};
}
