interface MyEventsFormPageHeaderProps {
	readonly breadcrumbAction: string;
	readonly title: string;
	readonly subtitle: string;
	readonly myEventsLabel: string;
}

export function MyEventsFormPageHeader({
	breadcrumbAction,
	title,
	subtitle,
	myEventsLabel,
}: MyEventsFormPageHeaderProps) {
	return (
		<>
			<nav className="text-sm text-gray-500 mb-4">
				<span>{myEventsLabel}</span>
				<span className="mx-2">›</span>
				<span className="text-gray-900">{breadcrumbAction}</span>
			</nav>

			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900">{title}</h1>
				<p className="text-gray-600 mt-1">{subtitle}</p>
			</div>
		</>
	);
}
