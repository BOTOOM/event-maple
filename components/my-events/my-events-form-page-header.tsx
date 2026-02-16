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
			<nav className="text-sm text-muted-foreground mb-4">
				<span>{myEventsLabel}</span>
				<span className="mx-2">›</span>
				<span className="text-foreground">{breadcrumbAction}</span>
			</nav>

			<div className="mb-8">
				<h1 className="text-3xl font-bold text-foreground">{title}</h1>
				<p className="text-muted-foreground mt-1">{subtitle}</p>
			</div>
		</>
	);
}
