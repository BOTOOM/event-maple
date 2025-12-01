"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, ArrowLeft, Calendar } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/hooks/use-toast";
import { useTranslations } from "next-intl";

export function RegisterForm() {
  const t = useTranslations("Auth.Register");
  const tCommon = useTranslations("Auth.common");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const router = useRouter();
  const supabase = createClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: t("errors.passwordMismatch"),
      });
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast({
        variant: "destructive",
        title: "Error",
        description: t("errors.passwordTooShort"),
      });
      setIsLoading(false);
      return;
    }

    // Validar que se aceptaron los términos (obligatorio)
    if (!formData.acceptTerms) {
      toast({
        variant: "destructive",
        title: "Error",
        description: t("errors.termsRequired"),
      });
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
          },
        },
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message === "User already registered"
            ? t("errors.userAlreadyRegistered")
            : error.message,
        });
        return;
      }

      // Toast más explícito y con mayor duración
      toast({
        variant: "success",
        title: t("success.title"),
        description: (
          <div className="space-y-2">
            <p className="font-semibold text-base">
              {t("success.important")}
            </p>
            <p className="text-sm">
              {t.rich("success.message", {
                email: formData.email,
                strong: (chunks) => <strong>{chunks}</strong>
              })}
            </p>
            <p className="text-sm">
              {t("success.spam")}
            </p>
          </div>
        ),
        duration: 15000, // 15 segundos para que el usuario pueda leer
      });

      // Redirect to login after showing the toast
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: tCommon("errors.generic"),
      });
    } finally {
      setIsLoading(false);
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
          <span className="hidden md:inline">{t("title")}</span>
          <span className="md:hidden">{t("titleMobile")}</span>
        </h1>
        <p className="text-gray-600">
          <span className="hidden md:inline">
            {t("subtitle")}
          </span>
          <span className="md:hidden">
            {t("subtitleMobile")}
          </span>
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-gray-900">
            <span className="hidden md:inline">{t("name")}</span>
            <span className="md:hidden">{t("nameMobile")}</span>
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder={t("namePlaceholder")}
            required
            disabled={isLoading}
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-900">
            {tCommon("email")}
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder={t("emailPlaceholder")}
            required
            disabled={isLoading}
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-900">
            {tCommon("password")}
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder={t("passwordPlaceholder")}
              required
              disabled={isLoading}
              className="pr-10"
              value={formData.password}
              onChange={handleChange}
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
        </div>

        {/* Confirmar contraseña */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-gray-900">
            {tCommon("confirmPassword")}
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder={t("confirmPlaceholder")}
              required
              disabled={isLoading}
              className="pr-10"
              value={formData.confirmPassword}
              onChange={handleChange}
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

        {/* Checkbox de términos - Obligatorio para todos */}
        <div className="flex items-start gap-2">
          <Checkbox
            id="terms"
            name="acceptTerms"
            checked={formData.acceptTerms}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, acceptTerms: checked as boolean }))
            }
            required
          />
          <label htmlFor="terms" className="text-sm text-gray-600 leading-tight cursor-pointer">
            {t.rich("terms", {
              terms: (chunks) => (
                <Link href="/terms" className="text-primary hover:underline font-medium" target="_blank">
                  {chunks}
                </Link>
              ),
              privacy: (chunks) => (
                <Link href="/privacy" className="text-primary hover:underline font-medium" target="_blank">
                  {chunks}
                </Link>
              )
            })}
            <span className="text-red-500"> *</span>
          </label>
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? (
            t("submitting")
          ) : (
            <>
              <span className="hidden md:inline">{t("submit")}</span>
              <span className="md:hidden">{t("submitMobile")}</span>
            </>
          )}
        </Button>

        <div className="text-center text-sm text-gray-600">
          {t("alreadyAccount")}{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            <span className="hidden md:inline">{t("loginLink")}</span>
            <span className="md:hidden">{t("loginLinkMobile")}</span>
          </Link>
        </div>
      </form>
    </div>
  );
}
