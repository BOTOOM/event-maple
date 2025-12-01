"use client";

import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/lib/i18n/navigation";
import Image from "next/image";
import { useAuth } from "@/lib/hooks/use-auth";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/language-switcher";

export function EventsHeader() {
  const { user, signOut } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const t = useTranslations("Events.Header");

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Mobile: Hamburger */}
          <button
            className="md:hidden p-2 -ml-2"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <Menu className="h-6 w-6 text-gray-700" />
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
            <span className="font-bold text-lg sm:text-xl text-gray-900">
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
            <button className="p-2 -mr-2">
              <Search className="h-5 w-5 text-gray-700" />
            </button>
          </div>

          {/* Desktop: User Menu */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <span className="text-sm text-gray-600">
              {user?.email}
            </span>
            <Button variant="outline" onClick={signOut}>
              {t("userMenu.signOut")}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-2">
            <Link
              href="/events"
              className="block py-2 text-gray-700 hover:text-primary"
              onClick={() => setShowMobileMenu(false)}
            >
              {t("nav.events")}
            </Link>
            <Link
              href="/my-agenda"
              className="block py-2 text-gray-700 hover:text-primary"
              onClick={() => setShowMobileMenu(false)}
            >
              {t("nav.myAgenda")}
            </Link>
            <div className="pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">{user?.email}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="w-full justify-start"
              >
                {t("userMenu.signOut")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
