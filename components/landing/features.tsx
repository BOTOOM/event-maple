import Image from "next/image";
import { useTranslations } from "next-intl";

export function Features() {
	const t = useTranslations("Landing.Features");

	const features = [
		{
			id: "agenda",
			title: t("items.agenda.title"),
			description: t("items.agenda.description"),
			badge: null,
			image: "https://res.cloudinary.com/dultmjgbm/image/upload/v1764632379/task_mr4lqp.jpg",
			alt: t("items.agenda.alt"),
		},
		{
			id: "notifications",
			title: t("items.notifications.title"),
			description: t("items.notifications.description"),
			badge: t("badges.comingSoon"),
			image: "https://res.cloudinary.com/dultmjgbm/image/upload/v1764632375/notify_tzkrtq.jpg",
			alt: t("items.notifications.alt"),
		},
		{
			id: "maps",
			title: t("items.maps.title"),
			description: t("items.maps.description"),
			badge: t("badges.comingSoon"),
			image:
				"https://res.cloudinary.com/dultmjgbm/image/upload/v1764632382/Google_AI_Studio_2025-10-06T17_23_36.754Z_eikmui.jpg",
			alt: t("items.maps.alt"),
		},
	];

	return (
		<section id="features" className="py-20 sm:py-28 bg-surface">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{t("title")}</h2>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("subtitle")}</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{features.map((feature) => (
						<div
							key={feature.id}
							className="bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
						>
							{/* Image */}
							<div className="relative h-48 bg-winter-100">
								<Image
									src={feature.image}
									alt={feature.alt}
									fill
									sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
									className="object-cover"
								/>
								{feature.badge && (
									<div className="absolute top-4 right-4 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
										{feature.badge}
									</div>
								)}
							</div>

							{/* Content */}
							<div className="p-6">
								<h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
								<p className="text-muted-foreground leading-relaxed">{feature.description}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
