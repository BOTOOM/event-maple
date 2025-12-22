import { Calendar, Clock } from "lucide-react";
import { useTranslations } from "next-intl";

export function Benefits() {
	const t = useTranslations("Landing.Benefits");

	const benefits = [
		{
			icon: Clock,
			title: t("items.time.title"),
			description: t("items.time.description"),
		},
		{
			icon: Calendar,
			title: t("items.organized.title"),
			description: t("items.organized.description"),
		},
	];

	return (
		<section id="benefits" className="py-20 sm:py-28 bg-white">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{t("title")}</h2>
					<p className="text-lg text-gray-600 max-w-2xl mx-auto">{t("subtitle")}</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">
					{benefits.map((benefit, index) => {
						const Icon = benefit.icon;
						return (
							<div
								key={index}
								className="flex flex-col items-center text-center p-8 rounded-lg hover:shadow-lg transition-shadow"
							>
								<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
									<Icon className="h-8 w-8 text-primary" />
								</div>
								<h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
								<p className="text-gray-600 leading-relaxed">{benefit.description}</p>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
