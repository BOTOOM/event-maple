"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
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
            <span className="font-bold text-lg sm:text-xl text-gray-900">
              <span className="hidden sm:inline">EventMaple</span>
              <span className="sm:hidden">EventApp</span>
            </span>
          </Link>

          {/* Navigation Links - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#benefits"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Beneficios
            </Link>
            <Link
              href="#features"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Características
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
            <Link href="/login">
              <Button
                variant="ghost"
                asChild
                className="text-sm sm:text-base px-3 sm:px-4"
              >
                <span className="hidden sm:inline">Iniciar Sesión</span>
                <span className="sm:hidden">Iniciar Sesión</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
