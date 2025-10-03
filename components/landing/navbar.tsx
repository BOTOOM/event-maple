"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-primary">
            <div className="w-8 h-8 sm:w-auto sm:h-auto bg-primary rounded-lg sm:rounded-none flex items-center justify-center sm:bg-transparent">
              <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-white sm:text-primary" />
            </div>
            <span className="font-bold text-lg sm:text-xl">
              <span className="hidden sm:inline">EventPlanner</span>
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
            <Link
              href="#pricing"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Precios
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="ghost" asChild className="text-sm sm:text-base px-3 sm:px-4">
              <Link href="/login">
                <span className="hidden sm:inline">Iniciar Sesión</span>
                <span className="sm:hidden">Iniciar Sesión</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
