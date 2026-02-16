"use client";

import { ArrowLeft, Calendar, CheckCircle, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/lib/hooks/use-toast";
import { Link } from "@/lib/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

export function ForgotPasswordForm() {
	const t = useTranslations("Auth.ForgotPassword");
	const tCommon = useTranslations("Auth.common");

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
				title: t("success.title"),
				description: t("success.checkInbox"),
			});
		} catch (_error) {
			toast({
				variant: "destructive",
				title: "Error",
				description: tCommon("errors.generic"),
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
						<h1 className="text-3xl font-bold text-gray-900 mb-2">{t("success.title")}</h1>
						<p className="text-gray-600">{t("success.message")}</p>
						<p className="text-primary font-medium mt-2">{email}</p>
					</div>

					<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
						<div className="flex gap-3">
							<Mail className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
							<div className="text-sm text-gray-700">
								<p className="font-medium mb-1">{t("success.checkInbox")}</p>
								<p>{t("success.validity")}</p>
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
							{t("success.resend")}
						</Button>

						<Link href="/login" className="block">
							<Button variant="ghost" className="w-full" size="lg">
								<ArrowLeft className="h-4 w-4 mr-2" />
								{t("success.backToLogin")}
							</Button>
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full max-w-md">
			{/* Back Button */}
			<div className="mb-6">
				<Link
					href="/login"
					className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
				>
					<ArrowLeft className="h-4 w-4" />
					<span className="text-sm font-medium">{t("backToLogin")}</span>
				</Link>
			</div>

			{/* Logo - Solo en mobile */}
			<div className="flex justify-center mb-8 md:hidden">
				<div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
					<Calendar className="h-8 w-8 text-white" />
				</div>
			</div>

			<div className="text-center mb-8">
				<h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{t("title")}</h1>
				<p className="text-gray-600">{t("subtitle")}</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
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
						autoFocus
					/>
				</div>

				<Button type="submit" className="w-full" size="lg" disabled={isLoading}>
					{isLoading ? t("submitting") : t("submit")}
				</Button>

				<div className="text-center text-sm">
					<Link
						href="/login"
						className="text-primary hover:underline font-medium inline-flex items-center gap-1"
					>
						<ArrowLeft className="h-4 w-4" />
						{t("rememberPassword")}
					</Link>
				</div>
			</form>
		</div>
	);
}
