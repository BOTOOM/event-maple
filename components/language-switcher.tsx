"use client";

import { Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { languages } from "@/lib/i18n/config";
import { usePathname, useRouter } from "@/lib/i18n/navigation";

export function LanguageSwitcher() {
	const locale = useLocale();
	const router = useRouter();
	const pathname = usePathname();
	const [isOpen, setIsOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	// Close on click outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleLanguageChange = (newLocale: string) => {
		router.replace(pathname, { locale: newLocale });
		setIsOpen(false);
	};

	return (
		<div className="relative" ref={ref}>
			<Button
				variant="ghost"
				size="icon"
				onClick={() => setIsOpen(!isOpen)}
				className="text-muted-foreground hover:text-foreground"
			>
				<Globe className="h-5 w-5" />
				<span className="sr-only">Switch Language</span>
			</Button>

			{isOpen && (
				<div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg ring-1 ring-border py-1 z-50">
					{languages.map((lang) => (
						<button
							type="button"
							key={lang.code}
							onClick={() => handleLanguageChange(lang.code)}
							className={`block w-full text-left px-4 py-2 text-sm ${
								locale === lang.code
									? "bg-secondary text-foreground font-medium"
									: "text-muted-foreground hover:bg-surface"
							}`}
						>
							<span className="mr-2">{lang.flag}</span>
							{lang.label}
						</button>
					))}
				</div>
			)}
		</div>
	);
}
