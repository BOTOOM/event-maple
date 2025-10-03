"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export function AuthForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Implementar lógica de login con Supabase
    console.log("Login form submitted");
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Implementar lógica de registro con Supabase
    console.log("Register form submitted");
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          Bienvenido a Gestor de Eventos
        </h1>
        <p className="text-gray-600">
          Inicia sesión o regístrate para continuar
        </p>
      </div>

      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
          <TabsTrigger value="register">Registrarse</TabsTrigger>
        </TabsList>

        {/* Login Tab */}
        <TabsContent value="login">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="login-email">Correo Electrónico</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="tu@email.com"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="login-password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Introduce tu contraseña"
                  required
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="text-left">
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>

            <div className="text-center text-sm text-gray-600">
              ¿No tienes cuenta?{" "}
              <button
                type="button"
                onClick={() => {
                  const registerTab = document.querySelector('[value="register"]') as HTMLButtonElement;
                  registerTab?.click();
                }}
                className="text-primary hover:underline font-medium"
              >
                Regístrate
              </button>
            </div>
          </form>
        </TabsContent>

        {/* Register Tab */}
        <TabsContent value="register">
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="register-name">Nombre Completo</Label>
              <Input
                id="register-name"
                type="text"
                placeholder="Juan Pérez"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-email">Correo Electrónico</Label>
              <Input
                id="register-email"
                type="email"
                placeholder="tu@email.com"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Crea una contraseña segura"
                  required
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
            </Button>

            <div className="text-center text-sm text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <button
                type="button"
                onClick={() => {
                  const loginTab = document.querySelector('[value="login"]') as HTMLButtonElement;
                  loginTab?.click();
                }}
                className="text-primary hover:underline font-medium"
              >
                Inicia sesión
              </button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
