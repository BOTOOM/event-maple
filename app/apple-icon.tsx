import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
	width: 180,
	height: 180,
};

export const contentType = "image/png";

export default async function AppleIcon() {
	// Fetch the SVG logo from the public directory
	const logoSvg = await fetch(new URL("/logo.svg", "http://localhost:3000")).then((res) =>
		res.text(),
	);
	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				//   backgroundColor: '#221b69',
				borderRadius: 40,
			}}
		>
			<img
				src={`data:image/svg+xml;base64,${Buffer.from(logoSvg).toString("base64")}`}
				width="140"
				height="140"
				alt="Logo"
			/>
		</div>,
		{
			...size,
		},
	);
}
