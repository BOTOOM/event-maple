"use client";

import { ArrowLeft, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { toast } from "@/lib/hooks/use-toast";
import { Link } from "@/lib/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

// Render functions for t.rich() - extracted to avoid inline component definitions
const StrongText = (chunks: React.ReactNode) => <strong>{chunks}</strong>;
const TermsLink = (chunks: React.ReactNode) => (
	<Link href="/terms" className="text-primary hover:underline font-medium" target="_blank">
		{chunks}
	</Link>
);
const PrivacyLink = (chunks: React.ReactNode) => (
	<Link href="/privacy" className="text-primary hover:underline font-medium" target="_blank">
		{chunks}
	</Link>
);

export function RegisterForm() {
	const t = useTranslations("Auth.Register");
	const tCommon = useTranslations("Auth.common");

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
			const { error } = await supabase.auth.signUp({
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
					description:
						error.message === "User already registered"
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
						<p className="font-semibold text-base">{t("success.important")}</p>
						<p className="text-sm">
							{t.rich("success.message", {
								email: formData.email,
								strong: StrongText,
							})}
						</p>
						<p className="text-sm">{t("success.spam")}</p>
					</div>
				),
				duration: 15000, // 15 segundos para que el usuario pueda leer
			});

			// Redirect to login after showing the toast
			setTimeout(() => {
				router.push("/login");
			}, 1000);
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

	return (
		<div className="w-full max-w-md">
			{/* Back Button */}
			<div className="mb-6">
				<Link
					href="/"
					className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
				>
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
				<h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
					<span className="hidden md:inline">{t("title")}</span>
					<span className="md:hidden">{t("titleMobile")}</span>
				</h1>
				<p className="text-muted-foreground">
					<span className="hidden md:inline">{t("subtitle")}</span>
					<span className="md:hidden">{t("subtitleMobile")}</span>
				</p>
			</div>

			<form onSubmit={handleRegister} className="space-y-5">
				<div className="space-y-2">
					<Label htmlFor="name" className="text-foreground">
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
					<Label htmlFor="email" className="text-foreground">
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
					<Label htmlFor="password" className="text-foreground">
						{tCommon("password")}
					</Label>
					<PasswordInput
						id="password"
						name="password"
						placeholder={t("passwordPlaceholder")}
						required
						disabled={isLoading}
						value={formData.password}
						onChange={handleChange}
					/>
				</div>

				{/* Confirmar contraseña */}
				<div className="space-y-2">
					<Label htmlFor="confirmPassword" className="text-foreground">
						{tCommon("confirmPassword")}
					</Label>
					<PasswordInput
						id="confirmPassword"
						name="confirmPassword"
						placeholder={t("confirmPlaceholder")}
						required
						disabled={isLoading}
						value={formData.confirmPassword}
						onChange={handleChange}
					/>
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
					<label htmlFor="terms" className="text-sm text-muted-foreground leading-tight cursor-pointer">
						{t.rich("terms", {
							terms: TermsLink,
							privacy: PrivacyLink,
						})}
						<span className="text-red-500"> *</span>
					</label>
				</div>

				<Button type="submit" className="w-full" size="lg" disabled={isLoading}>
					{isLoading ? (
						t("submitting")
					) : (
						<>
							<span className="hidden md:inline">{t("submit")}</span>
							<span className="md:hidden">{t("submitMobile")}</span>
						</>
					)}
				</Button>

				<div className="text-center text-sm text-muted-foreground">
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
