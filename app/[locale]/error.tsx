"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { Link } from "@/lib/i18n/navigation";

export default function ErrorPage({
	error,
	reset,
}: Readonly<{
	error: Error & { digest?: string };
	reset: () => void;
}>) {
	const t = useTranslations("Errors.General");

	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className="min-h-screen flex flex-col bg-surface">
			<Navbar />
			<main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
				<div className="max-w-md w-full text-center bg-card p-8 rounded-2xl shadow-sm border border-border">
					<div className="relative w-20 h-20 mx-auto mb-6 bg-red-50 rounded-full flex items-center justify-center">
						<div className="relative w-10 h-10">
							<Image src="/error.svg" alt="Error Illustration" fill className="object-contain" />
						</div>
					</div>

					<h1 className="text-2xl font-bold text-foreground mb-3">{t("title")}</h1>
					<p className="text-muted-foreground mb-8 text-sm leading-relaxed">{t("description")}</p>

					<div className="space-y-3">
						<button
							type="button"
							onClick={reset}
							className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-primary/90 transition-colors shadow-sm"
						>
							{t("retry")}
						</button>

						<Link
							href="/"
							className="w-full inline-flex items-center justify-center px-6 py-3 border border-border text-base font-medium rounded-lg text-foreground bg-card hover:bg-surface transition-colors"
						>
							{t("home")}
						</Link>
					</div>

					<div className="mt-8 pt-6 border-t border-border">
						<p className="text-xs text-muted-foreground bg-surface py-2 px-3 rounded font-mono inline-block">
							ID: {error.digest || "unknown"}
						</p>
						<p className="text-xs text-muted-foreground mt-2">{t("support")}</p>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
}
