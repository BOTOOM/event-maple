import Image from "next/image";
import { ReactNode } from "react";

export default function AuthLayout({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<div className="min-h-screen flex">
			{/* Decorative left panel - hidden on mobile */}
			<div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-winter-900 via-winter-700 to-winter-500 relative overflow-hidden">
				<div className="absolute inset-0 opacity-10">
					<div className="absolute top-20 left-10 w-72 h-72 bg-white/20 rounded-full blur-3xl" />
					<div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
				</div>
				<div className="relative z-10 flex flex-col items-center justify-center w-full px-12 text-white">
					<Image
						src="/logo.svg"
						alt="EventMaple"
						width={80}
						height={80}
						className="mb-6 brightness-0 invert"
					/>
					<h2 className="text-3xl font-bold mb-3 text-center">EventMaple</h2>
					<p className="text-white/70 text-center text-lg max-w-sm">
						The smartest way to organize your event.
					</p>
				</div>
			</div>

			{/* Form panel */}
			<div className="flex-1 flex items-center justify-center bg-gradient-to-br from-surface to-background px-4">
				{children}
			</div>
		</div>
	);
}
