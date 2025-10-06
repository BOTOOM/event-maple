"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft, Mail, CheckCircle } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/lib/hooks/use-toast";

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "No se pudo enviar el correo de recuperación.",
        });
        return;
      }

      setEmailSent(true);
      toast({
        variant: "success",
        title: "¡Correo enviado!",
        description: "Revisa tu bandeja de entrada para restablecer tu contraseña.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error inesperado. Intenta nuevamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="w-full max-w-md">
        {/* Logo - Solo en mobile */}
        <div className="flex justify-center mb-8 md:hidden">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <Calendar className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* Success State */}
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ¡Correo Enviado!
            </h1>
            <p className="text-gray-600">
              Hemos enviado un enlace de recuperación a:
            </p>
            <p className="text-primary font-medium mt-2">{email}</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
            <div className="flex gap-3">
              <Mail className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <p className="font-medium mb-1">Revisa tu bandeja de entrada</p>
                <p>
                  El enlace de recuperación es válido por 1 hora. Si no encuentras
                  el correo, verifica tu carpeta de spam.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => setEmailSent(false)}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Volver a enviar correo
            </Button>

            <Link href="/login" className="block">
              <Button variant="ghost" className="w-full" size="lg">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a iniciar sesión
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      {/* Logo - Solo en mobile */}
      <div className="flex justify-center mb-8 md:hidden">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
          <Calendar className="h-8 w-8 text-white" />
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          Recupera tu Contraseña
        </h1>
        <p className="text-gray-600">
          Ingresa tu correo electrónico y te enviaremos un enlace para
          restablecer tu contraseña.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-900">
            Correo electrónico
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="tu.correo@ejemplo.com"
            required
            disabled={isLoading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? "Enviando..." : "Enviar Enlace"}
        </Button>

        <div className="text-center text-sm">
          <Link
            href="/login"
            className="text-primary hover:underline font-medium inline-flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            ¿Recuerdas tu contraseña? Inicia sesión
          </Link>
        </div>
      </form>
    </div>
  );
}
