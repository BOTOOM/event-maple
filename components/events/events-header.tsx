"use client";

import { ChevronDown, Menu, Search, User as UserIcon } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/hooks/use-auth";
import { Link } from "@/lib/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

interface HeaderProfileSnapshot {
	display_name: string | null;
	avatar_url: string | null;
}

function getMetadataString(metadata: unknown, key: string): string | null {
	if (!metadata || typeof metadata !== "object") {
		return null;
	}

	const value = (metadata as Record<string, unknown>)[key];

	if (typeof value !== "string") {
		return null;
	}

	const trimmedValue = value.trim();
	return trimmedValue || null;
}

function getSafeAvatarUrl(value: string | null): string | null {
	if (!value) {
		return null;
	}

	const trimmedValue = value.trim();
	if (!trimmedValue) {
		return null;
	}

	try {
		const parsedUrl = new URL(trimmedValue);
		if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
			return null;
		}

		return parsedUrl.toString();
	} catch {
		return null;
	}
}

function getUserInitials(displayName: string, email: string | null | undefined): string {
	const normalizedName = displayName.trim();

	if (normalizedName) {
		const words = normalizedName.split(/\s+/).filter(Boolean);
		return words
			.slice(0, 2)
			.map((word) => word[0]?.toUpperCase() ?? "")
			.join("");
	}

	if (email) {
		return email.slice(0, 2).toUpperCase();
	}

	return "";
}

interface UserAvatarProps {
	readonly avatarUrl: string | null;
	readonly displayName: string;
	readonly email: string | null;
	readonly alt: string;
	readonly sizeClassName?: string;
	readonly textClassName?: string;
}

function UserAvatar({
	avatarUrl,
	displayName,
	email,
	alt,
	sizeClassName = "h-9 w-9",
	textClassName = "text-xs",
}: Readonly<UserAvatarProps>) {
	const initials = getUserInitials(displayName, email);

	if (avatarUrl) {
		return (
			<span
				className={`relative overflow-hidden rounded-full border border-border bg-muted ${sizeClassName}`}
			>
				<Image
					src={avatarUrl}
					alt={alt}
					fill
					sizes="36px"
					className="object-cover"
					loading="lazy"
					decoding="async"
				/>
			</span>
		);
	}

	return (
		<span
			className={`flex items-center justify-center rounded-full border border-border bg-muted text-foreground font-semibold ${sizeClassName} ${textClassName}`}
		>
			{initials || <UserIcon className="h-4 w-4" />}
		</span>
	);
}

export function EventsHeader() {
	const { user, signOut } = useAuth();
	const [showMobileMenu, setShowMobileMenu] = useState(false);
	const [showUserMenu, setShowUserMenu] = useState(false);
	const [headerProfile, setHeaderProfile] = useState<HeaderProfileSnapshot | null>(null);
	const t = useTranslations("Events.Header");

	useEffect(() => {
		if (!user) {
			setHeaderProfile(null);
			return;
		}

		let isCancelled = false;
		const supabase = createClient();

		const loadHeaderProfile = async () => {
			const { data, error } = await supabase
				.from("user_profiles")
				.select("display_name, avatar_url")
				.eq("id", user.id)
				.maybeSingle();

			if (isCancelled) {
				return;
			}

			if (error || !data) {
				setHeaderProfile(null);
				return;
			}

			setHeaderProfile({
				display_name: data.display_name,
				avatar_url: data.avatar_url,
			});
		};

		loadHeaderProfile();

		return () => {
			isCancelled = true;
		};
	}, [user]);

	const accountDisplayName = useMemo(() => {
		if (!user) {
			return t("userMenu.guestName");
		}

		const profileDisplayName = headerProfile?.display_name?.trim();
		if (profileDisplayName) {
			return profileDisplayName;
		}

		const metadataDisplayName =
			getMetadataString(user.user_metadata, "display_name") ||
			getMetadataString(user.user_metadata, "name");

		if (metadataDisplayName) {
			return metadataDisplayName;
		}

		const emailAlias = user.email?.split("@")[0]?.trim();
		if (emailAlias) {
			return emailAlias;
		}

		return t("userMenu.guestName");
	}, [headerProfile?.display_name, t, user]);

	const accountEmail = user?.email ?? null;
	const accountAvatarUrl =
		getSafeAvatarUrl(headerProfile?.avatar_url ?? null) ||
		getSafeAvatarUrl(getMetadataString(user?.user_metadata, "avatar_url"));
	const avatarAlt = t("userMenu.avatarAlt", { name: accountDisplayName });

	const handleSignOut = async () => {
		setShowUserMenu(false);
		await signOut();
	};

	return (
		<header className="sticky top-0 z-40 bg-card border-b border-border">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-14 sm:h-16">
					{/* Mobile: Hamburger */}
					<button
						type="button"
						className="md:hidden p-2 -ml-2"
						onClick={() => setShowMobileMenu(!showMobileMenu)}
					>
						<Menu className="h-6 w-6 text-foreground" />
					</button>

					{/* Logo / Title */}
					<Link href="/events" className="flex items-center gap-2">
						<Image
							src="/logo.svg"
							alt="EventMaple Logo"
							width={32}
							height={32}
							className="w-8 h-8 md:w-10 md:h-10"
						/>
						<span className="font-bold text-lg sm:text-xl text-foreground">
							<span className="hidden md:inline">{t("title")}</span>
							<span className="md:hidden">{t("titleMobile")}</span>
						</span>
					</Link>

					{/* Desktop: Search (optional for future) */}
					<div className="hidden lg:flex flex-1 max-w-md mx-8">
						{/* Search can be added here */}
					</div>

					{/* Mobile: Search Icon */}
					<div className="flex items-center gap-2 md:hidden">
						<LanguageSwitcher />
						<button type="button" className="p-2 -mr-2">
							<Search className="h-5 w-5 text-foreground" />
						</button>
					</div>

					{/* Desktop: User Menu */}
					<div className="hidden md:flex items-center gap-3">
						<LanguageSwitcher />
						{user ? (
							<>
								<Link href="/my-events">
									<Button variant="ghost">{t("nav.myEvents")}</Button>
								</Link>
								<Popover open={showUserMenu} onOpenChange={setShowUserMenu}>
									<PopoverTrigger asChild>
										<Button
											variant="ghost"
											className="h-10 rounded-full px-2 pr-3"
											aria-label={t("userMenu.openProfileMenu")}
											data-testid="header-user-menu-trigger"
										>
											<UserAvatar
												avatarUrl={accountAvatarUrl}
												displayName={accountDisplayName}
												email={accountEmail}
												alt={avatarAlt}
											/>
											<span className="hidden lg:inline max-w-32 truncate text-sm font-medium">
												{accountDisplayName}
											</span>
											<ChevronDown className="h-4 w-4 text-muted-foreground" />
										</Button>
									</PopoverTrigger>

									<PopoverContent align="end" className="w-72 p-0">
										<div className="p-4">
											<div className="flex items-center gap-3">
												<UserAvatar
													avatarUrl={accountAvatarUrl}
													displayName={accountDisplayName}
													email={accountEmail}
													alt={avatarAlt}
													sizeClassName="h-10 w-10"
													textClassName="text-sm"
												/>
												<div className="min-w-0">
													<p className="truncate text-sm font-semibold text-foreground">
														{accountDisplayName}
													</p>
													{accountEmail ? (
														<p
															className="truncate text-xs text-muted-foreground"
															data-testid="header-user-menu-email"
														>
															({accountEmail})
														</p>
													) : null}
												</div>
											</div>
										</div>

										<Separator />

										<div className="p-2 space-y-1">
											<Link
												href="/profile"
												className="block rounded-sm px-2 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground"
												data-testid="header-user-menu-profile"
											>
												{t("nav.profile")}
											</Link>
											<Link
												href="/my-events"
												className="block rounded-sm px-2 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground"
												data-testid="header-user-menu-my-events"
											>
												{t("nav.myEvents")}
											</Link>
											<Button
												type="button"
												variant="ghost"
												onClick={handleSignOut}
												className="w-full justify-start px-2"
												data-testid="header-user-menu-signout"
											>
												{t("userMenu.signOut")}
											</Button>
										</div>
									</PopoverContent>
								</Popover>
							</>
						) : (
							<>
								<Link href="/">
									<Button variant="ghost">{t("home")}</Button>
								</Link>
								<Link href="/login">
									<Button variant="outline">{t("userMenu.signIn")}</Button>
								</Link>
							</>
						)}
					</div>
				</div>
			</div>

			{/* Mobile Menu Dropdown */}
			{showMobileMenu && (
				<div className="md:hidden border-t border-border bg-card">
					<div className="px-4 py-3 space-y-2">
						<Link
							href="/events"
							className="block py-2 text-foreground hover:text-primary"
							onClick={() => setShowMobileMenu(false)}
						>
							{t("nav.events")}
						</Link>
						{user && (
							<Link
								href="/my-events"
								className="block py-2 text-foreground hover:text-primary"
								onClick={() => setShowMobileMenu(false)}
							>
								{t("nav.myEvents")}
							</Link>
						)}
						{user && (
							<Link
								href="/profile"
								className="block py-2 text-foreground hover:text-primary"
								onClick={() => setShowMobileMenu(false)}
							>
								{t("nav.profile")}
							</Link>
						)}
						<Link
							href="/my-agenda"
							className="block py-2 text-foreground hover:text-primary"
							onClick={() => setShowMobileMenu(false)}
						>
							{t("nav.myAgenda")}
						</Link>
						<div className="pt-2 border-t border-border">
							{user ? (
								<>
									<div className="mb-3 flex items-center gap-3">
										<UserAvatar
											avatarUrl={accountAvatarUrl}
											displayName={accountDisplayName}
											email={accountEmail}
											alt={avatarAlt}
										/>
										<div className="min-w-0">
											<p className="truncate text-sm font-semibold text-foreground">
												{accountDisplayName}
											</p>
											{accountEmail ? (
												<p className="truncate text-xs text-muted-foreground">({accountEmail})</p>
											) : null}
										</div>
									</div>
									<Button
										variant="ghost"
										size="sm"
										onClick={handleSignOut}
										className="w-full justify-start"
									>
										{t("userMenu.signOut")}
									</Button>
								</>
							) : (
								<>
									<Link
										href="/"
										className="block py-2 text-foreground hover:text-primary"
										onClick={() => setShowMobileMenu(false)}
									>
										{t("home")}
									</Link>
									<Link href="/login" onClick={() => setShowMobileMenu(false)}>
										<Button variant="outline" size="sm" className="w-full">
											{t("userMenu.signIn")}
										</Button>
									</Link>
								</>
							)}
						</div>
					</div>
				</div>
			)}
		</header>
	);
}
