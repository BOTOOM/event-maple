"use client";

import { Calendar, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/use-auth";
import { useState } from "react";

export function EventsHeader() {
  const { user, signOut } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center md:hidden">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg sm:text-xl text-gray-900">
              <span className="hidden md:inline">Gestor de Eventos</span>
              <span className="md:hidden">Eventos</span>
            </span>
          </Link>

          {/* Desktop: Search (optional for future) */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            {/* Search can be added here */}
          </div>

          {/* Mobile: Search Icon */}
          <button className="md:hidden p-2 -mr-2">
            <Search className="h-5 w-5 text-gray-700" />
          </button>

          {/* Desktop: User Menu */}
          <div className="hidden md:flex items-center gap-3">
            <span className="text-sm text-gray-600">
              {user?.email}
            </span>
            <Button variant="outline" onClick={signOut}>
              Cerrar Sesión
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
              Eventos
            </Link>
            <Link
              href="/my-agenda"
              className="block py-2 text-gray-700 hover:text-primary"
              onClick={() => setShowMobileMenu(false)}
            >
              Mi Agenda
            </Link>
            <div className="pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">{user?.email}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="w-full justify-start"
              >
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
