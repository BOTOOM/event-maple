// Metadata type is used via generateMetadata return type inference
import { ArrowLeft, Code2, Coffee, Github, Globe, Mail } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { CopyEmailButton } from "@/components/contact/copy-email-button";
import { InfoCard, InfoCardGrid } from "@/components/ui/info-card";
import { Link } from "@/lib/i18n/navigation";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "Static.Contact.metadata" });
	return {
		title: t("title"),
		description: t("description"),
	};
}

export default function ContactPage() {
	const t = useTranslations("Static.Contact");

	return (
		<div className="min-h-screen bg-gradient-to-b from-surface to-card">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
				{/* Back Button */}
				<div className="mb-6">
					<Link
						href="/"
						className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
					>
						<ArrowLeft className="h-4 w-4" />
						<span className="text-sm font-medium">{t("back")}</span>
					</Link>
				</div>

				{/* Header */}
				<div className="text-center mb-12">
					<div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
						<Mail className="h-12 w-12 text-primary" />
					</div>
					<h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{t("header.title")}</h1>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t("header.subtitle")}</p>
				</div>

				{/* Developer Card */}
				<div className="bg-gradient-to-br from-card to-surface rounded-2xl shadow-xl border border-border overflow-hidden mb-8">
					{/* Header with gradient */}
					<div className="bg-gradient-to-r from-primary to-winter-700 px-8 py-12 text-white text-center">
						<div className="inline-block relative w-32 h-32 mb-4">
							<Image
								src="/avatar.png"
								alt="Edwar Díaz"
								width={128}
								height={128}
								className="rounded-full border-4 border-white/30 shadow-xl object-cover"
								priority
							/>
						</div>
						<h2 className="text-3xl font-bold mb-2">Edwar Díaz</h2>
						<div className="flex items-center justify-center gap-2 text-white/90">
							<Code2 className="h-5 w-5" />
							<p className="text-lg">{t("developer.role")}</p>
						</div>
					</div>

					{/* Content */}
					<div className="px-8 py-10">
						<div className="mb-8">
							<p className="text-foreground/80 text-center leading-relaxed text-lg">{t("intro")}</p>
						</div>

						{/* Contact Methods */}
						<div className="space-y-4">
							<h3 className="text-xl font-semibold text-foreground mb-6 text-center">
								{t("methods.title")}
							</h3>

							{/* Email */}
							<a
								href="mailto:contact@edwardiaz.dev"
								className="flex items-center gap-4 p-6 bg-card rounded-xl border-2 border-border hover:border-primary hover:shadow-lg transition-all group"
							>
								<div className="flex-shrink-0 w-14 h-14 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
									<Mail className="h-7 w-7 text-red-600" />
								</div>
								<div className="flex-1 min-w-0">
									<h4 className="text-lg font-semibold text-foreground mb-1">
										{t("methods.email.title")}
									</h4>
									<p className="text-primary font-medium group-hover:underline">
										contact@edwardiaz.dev
									</p>
									<p className="text-sm text-muted-foreground mt-1">{t("methods.email.desc")}</p>
								</div>
							</a>

							{/* GitHub */}
							<a
								href="https://github.com/BOTOOM"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-4 p-6 bg-card rounded-xl border-2 border-border hover:border-winter-800 hover:shadow-lg transition-all group"
							>
								<div className="flex-shrink-0 w-14 h-14 bg-winter-900 rounded-lg flex items-center justify-center group-hover:bg-winter-800 transition-colors">
									<Github className="h-7 w-7 text-white" />
								</div>
								<div className="flex-1 min-w-0">
									<h4 className="text-lg font-semibold text-foreground mb-1">
										{t("methods.github.title")}
									</h4>
									<p className="text-foreground/80 font-medium group-hover:text-foreground">@BOTOOM</p>
									<p className="text-sm text-muted-foreground mt-1">{t("methods.github.desc")}</p>
								</div>
							</a>

							{/* Portfolio */}
							<a
								href="https://edwardiaz.dev/"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-4 p-6 bg-card rounded-xl border-2 border-border hover:border-primary hover:shadow-lg transition-all group"
							>
								<div className="flex-shrink-0 w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
									<Globe className="h-7 w-7 text-primary" />
								</div>
								<div className="flex-1 min-w-0">
									<h4 className="text-lg font-semibold text-foreground mb-1">
										{t("methods.portfolio.title")}
									</h4>
									<p className="text-primary font-medium group-hover:underline">edwardiaz.dev</p>
									<p className="text-sm text-muted-foreground mt-1">{t("methods.portfolio.desc")}</p>
								</div>
							</a>
						</div>

						{/* Quick Copy Email */}
						<div className="mt-8 p-6 bg-gradient-to-r from-primary/5 to-winter-100 rounded-xl border border-primary/20">
							<div className="flex items-center gap-3 mb-3">
								<Coffee className="h-5 w-5 text-primary" />
								<h4 className="font-semibold text-foreground">{t("copyEmail.title")}</h4>
							</div>
							<div className="flex items-center gap-3">
								<code className="flex-1 px-4 py-3 bg-card rounded-lg text-foreground font-mono text-sm border border-border">
									contact@edwardiaz.dev
								</code>
								<CopyEmailButton
									email="contact@edwardiaz.dev"
									buttonText={t("copyEmail.button")}
									copiedText={t("copyEmail.copied")}
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Additional Info */}
				<div className="bg-card rounded-xl shadow-lg border border-border p-8 mb-8">
					<h3 className="text-2xl font-bold text-foreground mb-4 text-center">
						{t("aboutProject.title")}
					</h3>
					<div className="space-y-4 text-foreground/80 leading-relaxed">
						<p>{t("aboutProject.text")}</p>
						<InfoCardGrid columns={2} className="mt-6">
							<InfoCard
								title={t("aboutProject.idea.title")}
								description={t("aboutProject.idea.desc")}
							/>
							<InfoCard
								title={t("aboutProject.bug.title")}
								description={t("aboutProject.bug.desc")}
							/>
							<InfoCard
								title={t("aboutProject.collab.title")}
								description={t("aboutProject.collab.desc")}
							/>
							<InfoCard
								title={t("aboutProject.questions.title")}
								description={t("aboutProject.questions.desc")}
							/>
						</InfoCardGrid>
					</div>
				</div>

				{/* CTA */}
				<div className="text-center bg-gradient-to-r from-winter-900 to-winter-800 text-white rounded-xl p-8 shadow-xl">
					<h3 className="text-2xl font-bold mb-3">{t("cta.title")}</h3>
					<p className="text-winter-200 mb-6">{t("cta.text")}</p>
					<Link
						href="/about"
						className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
					>
						{t("cta.button")}
					</Link>
				</div>

				{/* Back to Home */}
				<div className="text-center mt-8">
					<Link href="/" className="text-muted-foreground hover:text-foreground text-sm font-medium">
						← {t("back")}
					</Link>
				</div>
			</div>
		</div>
	);
}
