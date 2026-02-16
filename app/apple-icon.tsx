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

	const encodedLogo = new TextEncoder().encode(logoSvg);
	const binaryLogo = Array.from(encodedLogo, (charCode) => String.fromCodePoint(charCode)).join("");
	const logoSvgBase64 = btoa(binaryLogo);
	const logoDataUri = `data:image/svg+xml;base64,${logoSvgBase64}`;
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
			<div
				style={{
					width: 140,
					height: 140,
					backgroundImage: `url(${logoDataUri})`,
					backgroundRepeat: "no-repeat",
					backgroundPosition: "center",
					backgroundSize: "contain",
				}}
			/>
		</div>,
		{
			...size,
		},
	);
}
