import { getTranslations } from "next-intl/server";
import { Benefits } from "@/components/landing/benefits";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { Navbar } from "@/components/landing/navbar";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "Metadata" });

	return {
		...buildPageMetadata({
			locale,
			title: t("title"),
			description: t("description"),
		}),
		title: {
			absolute: t("title"),
		},
	};
}

export default function HomePage() {
	return (
		<main id="main-content" className="min-h-screen">
			<Navbar />
			<Hero />
			<Benefits />
			<Features />
			<Footer />
		</main>
	);
}
