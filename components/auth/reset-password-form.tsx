"use client";

import { AlertCircle, Calendar, CheckCircle, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/lib/i18n/navigation";
import { toast } from "@/lib/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";

export function ResetPasswordForm() {
	const t = useTranslations("Auth.ResetPassword");
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
				title: t("validation.tooShort"),
				description: t("validation.tooShortDesc"),
			});
			return false;
		}

		if (password !== confirmPassword) {
			toast({
				variant: "destructive",
				title: t("validation.mismatch"),
				description: t("validation.mismatchDesc"),
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
					title: t("toast.errorTitle"),
					description: error.message || t("toast.errorDesc"),
				});
				return;
			}

			setPasswordReset(true);
			toast({
				variant: "success",
				title: t("toast.successTitle"),
				description: t("toast.successDesc"),
			});

			// Redirigir al login después de 3 segundos
			setTimeout(() => {
				router.push("/login");
			}, 3000);
		} catch (_error) {
			toast({
				variant: "destructive",
				title: t("toast.errorTitle"),
				description: t("toast.unexpectedError"),
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
					<p className="text-muted-foreground">{t("verifying")}</p>
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
						<h1 className="text-3xl font-bold text-foreground mb-2">{t("invalidLink.title")}</h1>
						<p className="text-muted-foreground">
							{t("invalidLink.description")}
						</p>
					</div>

					<Link href="/forgot-password" className="block">
						<Button className="w-full" size="lg">
							{t("invalidLink.requestNew")}
						</Button>
					</Link>

					<Link href="/login" className="block">
						<Button variant="ghost" className="w-full" size="lg">
							{t("invalidLink.backToLogin")}
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
						<div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
							<CheckCircle className="h-10 w-10 text-emerald-600" />
						</div>
					</div>

					<div>
						<h1 className="text-3xl font-bold text-foreground mb-2">{t("success.title")}</h1>
						<p className="text-muted-foreground">
							{t("success.description")}
						</p>
					</div>

					<Link href="/login" className="block">
						<Button className="w-full" size="lg">
							{t("success.goToLogin")}
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
				<h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
					{t("form.title")}
				</h1>
				<p className="text-muted-foreground">
					{t("form.subtitle")}
				</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="space-y-2">
					<Label htmlFor="password" className="text-foreground">
						{t("form.newPassword")}
					</Label>
					<div className="relative">
						<Input
							id="password"
							type={showPassword ? "text" : "password"}
							placeholder={t("form.newPasswordPlaceholder")}
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
							className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
							tabIndex={-1}
						>
							{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
						</button>
					</div>
					<p className="text-xs text-muted-foreground">{t("form.minChars")}</p>
				</div>

				<div className="space-y-2">
					<Label htmlFor="confirmPassword" className="text-foreground">
						{t("form.confirmPassword")}
					</Label>
					<div className="relative">
						<Input
							id="confirmPassword"
							type={showConfirmPassword ? "text" : "password"}
							placeholder={t("form.confirmPasswordPlaceholder")}
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
							className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
							tabIndex={-1}
						>
							{showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
						</button>
					</div>
				</div>

				<Button type="submit" className="w-full" size="lg" disabled={isLoading}>
					{isLoading ? t("form.submitting") : t("form.submit")}
				</Button>
			</form>
		</div>
	);
}
