"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";

export function Navbar() {
	const t = useTranslations("Navbar");

	return (
		<nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-14 sm:h-16">
					{/* Logo */}
					<Link href="/" className="flex items-center gap-2">
						<Image
							src="/logo.svg"
							alt="EventMaple Logo"
							width={32}
							height={32}
							className="w-8 h-8 sm:w-10 sm:h-10"
						/>
						<span className="font-bold text-lg sm:text-xl text-foreground">
							<span className="hidden sm:inline">EventMaple</span>
							<span className="sm:hidden">EventApp</span>
						</span>
					</Link>

					{/* Navigation Links - Hidden on mobile */}
					<div className="hidden md:flex items-center gap-8">
						<Link
							href="/events"
							className="text-muted-foreground hover:text-foreground transition-colors font-medium"
						>
							{t("links.events")}
						</Link>
						<Link href="#benefits" className="text-muted-foreground hover:text-foreground transition-colors">
							{t("links.benefits")}
						</Link>
						<Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
							{t("links.features")}
						</Link>
						{/* <Link
              href="#pricing"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Precios
            </Link> */}
					</div>

					{/* CTA Buttons */}
					<div className="flex items-center gap-2 sm:gap-3">
						<LanguageSwitcher />
						<Link href="/login">
							<Button variant="ghost" className="text-sm sm:text-base px-3 sm:px-4">
								<span className="hidden sm:inline">{t("actions.login")}</span>
								<span className="sm:hidden">{t("actions.login")}</span>
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</nav>
	);
}
