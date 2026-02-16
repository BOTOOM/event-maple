import { ReactNode } from "react";

export default function AuthLayout({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface to-background px-4">
			{children}
		</div>
	);
}
