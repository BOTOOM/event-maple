"use client";

import { useState, Suspense } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { Calendar, ArrowLeft } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/lib/hooks/use-toast";
import { useTranslations } from "next-intl";

function LoginFormContent() {
  const t = useTranslations("Auth.Login");
  const tCommon = useTranslations("Auth.common");
  
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const returnUrl = searchParams.get("returnUrl");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        const errorMessage = authError.message === "Invalid login credentials"
          ? tCommon("errors.invalidCredentials")
          : authError.message;
        
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: t("errorTitle"),
          description: errorMessage,
        });
        return;
      }

      toast({
        variant: "success",
        title: t("successTitle"),
        description: t("successDesc"),
      });

      // Validate returnUrl to prevent open redirect vulnerability
      const isValidReturnUrl = returnUrl && returnUrl.startsWith("/") && !returnUrl.startsWith("//");
      const destination = isValidReturnUrl ? returnUrl : "/events";

      router.push(destination);
      router.refresh();
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: tCommon("errors.generic"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Google login handler - currently disabled but kept for future use
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${globalThis.location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo iniciar sesión con Google.",
      });
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">{tCommon("backToHome")}</span>
        </Link>
      </div>

      {/* Logo - Solo en mobile */}
      <div className="flex justify-center mb-8 md:hidden">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
          <Calendar className="h-8 w-8 text-white" />
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          {t("title")}
        </h1>
        <p className="text-gray-600">
          {t("subtitle")}
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-900">
            {tCommon("email")}
          </Label>
          <Input
            id="email"
            type="email"
            placeholder={t("emailPlaceholder")}
            required
            disabled={isLoading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-gray-900">
              {tCommon("password")}
            </Label>
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              {t("forgotPassword")}
            </Link>
          </div>
          <PasswordInput
            id="password"
            placeholder={t("passwordPlaceholder")}
            required
            disabled={isLoading}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <div 
            data-testid="login-error"
            className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm"
            role="alert"
          >
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? t("submitting") : t("submit")}
        </Button>

        <div className="text-center text-sm text-gray-600">
          {t("noAccount")}{" "}
          <Link href="/register" className="text-primary hover:underline font-medium">
            {t("registerLink")}
          </Link>
        </div>

      </form>
    </div>
  );
}

export function LoginForm() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-[400px]">Cargando...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
