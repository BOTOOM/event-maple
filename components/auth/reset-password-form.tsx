"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/hooks/use-toast";

export function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Verificar si hay una sesión de recuperación válida
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      
      // Verificar si la sesión existe y es de tipo recovery
      if (data.session) {
        setIsValidSession(true);
      } else {
        setIsValidSession(false);
      }
    };

    checkSession();
  }, [supabase.auth]);

  const validatePassword = () => {
    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Contraseña muy corta",
        description: "La contraseña debe tener al menos 6 caracteres.",
      });
      return false;
    }

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Las contraseñas no coinciden",
        description: "Por favor verifica que ambas contraseñas sean iguales.",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "No se pudo restablecer la contraseña.",
        });
        return;
      }

      setPasswordReset(true);
      toast({
        variant: "success",
        title: "¡Contraseña restablecida!",
        description: "Tu contraseña ha sido actualizada correctamente.",
      });

      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        router.push("/login");
      }, 3000);
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

  // Mientras se verifica la sesión
  if (isValidSession === null) {
    return (
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8 md:hidden">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <Calendar className="h-8 w-8 text-white" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-gray-600">Verificando enlace...</p>
        </div>
      </div>
    );
  }

  // Si no hay sesión válida
  if (isValidSession === false) {
    return (
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8 md:hidden">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <Calendar className="h-8 w-8 text-white" />
          </div>
        </div>

        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="h-10 w-10 text-red-600" />
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Enlace Inválido o Expirado
            </h1>
            <p className="text-gray-600">
              El enlace de recuperación no es válido o ha expirado. Por favor,
              solicita un nuevo enlace de recuperación.
            </p>
          </div>

          <Link href="/forgot-password" className="block">
            <Button className="w-full" size="lg">
              Solicitar Nuevo Enlace
            </Button>
          </Link>

          <Link href="/login" className="block">
            <Button variant="ghost" className="w-full" size="lg">
              Volver a iniciar sesión
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Success state después de resetear
  if (passwordReset) {
    return (
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8 md:hidden">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <Calendar className="h-8 w-8 text-white" />
          </div>
        </div>

        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ¡Contraseña Actualizada!
            </h1>
            <p className="text-gray-600">
              Tu contraseña ha sido restablecida correctamente. Serás redirigido al
              inicio de sesión en unos momentos.
            </p>
          </div>

          <Link href="/login" className="block">
            <Button className="w-full" size="lg">
              Ir a Iniciar Sesión
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Formulario de reset
  return (
    <div className="w-full max-w-md">
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
          Ingresa tu nueva contraseña para restablecer el acceso a tu cuenta.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-900">
            Nueva Contraseña
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Introduce tu nueva contraseña"
              required
              disabled={isLoading}
              className="pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Mínimo 6 caracteres
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-gray-900">
            Confirmar Contraseña
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirma tu nueva contraseña"
              required
              disabled={isLoading}
              className="pr-10"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showConfirmPassword ? (
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
          {isLoading ? "Restableciendo..." : "Restablecer Contraseña"}
        </Button>
      </form>
    </div>
  );
}
