import { Benefits } from "@/components/landing/benefits";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { Navbar } from "@/components/landing/navbar";

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
