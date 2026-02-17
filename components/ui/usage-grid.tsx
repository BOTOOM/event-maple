interface UsageGridItemProps {
	readonly title: string;
	readonly items: readonly string[];
}

function UsageGridItem({ title, items }: UsageGridItemProps) {
	return (
		<div className="bg-surface border border-border rounded-lg p-4">
			<h4 className="font-semibold text-foreground mb-2">{title}</h4>
			<ul className="text-sm space-y-1">
				{items.map((item) => (
					<li key={item}>• {item}</li>
				))}
			</ul>
		</div>
	);
}

interface UsageGridProps {
	readonly items: readonly {
		readonly title: string;
		readonly items: readonly string[];
	}[];
	readonly columns?: 2 | 3 | 4;
	readonly className?: string;
}

export function UsageGrid({ items, columns = 2, className = "" }: UsageGridProps) {
	const gridCols = {
		2: "md:grid-cols-2",
		3: "md:grid-cols-3",
		4: "md:grid-cols-2 lg:grid-cols-4",
	};

	return (
		<div className={`grid ${gridCols[columns]} gap-4 ${className}`}>
			{items.map((item) => (
				<UsageGridItem key={item.title} title={item.title} items={item.items} />
			))}
		</div>
	);
}

interface RightsGridItemProps {
	readonly title: string;
	readonly description: string;
}

function RightsGridItem({ title, description }: RightsGridItemProps) {
	return (
		<div className="border border-border rounded-lg p-4">
			<h4 className="font-semibold text-foreground mb-2">{title}</h4>
			<p className="text-sm">{description}</p>
		</div>
	);
}

interface RightsGridProps {
	readonly items: readonly {
		readonly title: string;
		readonly description: string;
	}[];
	readonly columns?: 2 | 3 | 4;
	readonly className?: string;
}

export function RightsGrid({ items, columns = 2, className = "" }: RightsGridProps) {
	const gridCols = {
		2: "md:grid-cols-2",
		3: "md:grid-cols-3",
		4: "md:grid-cols-2 lg:grid-cols-4",
	};

	return (
		<div className={`grid ${gridCols[columns]} gap-3 ${className}`}>
			{items.map((item) => (
				<RightsGridItem key={item.title} title={item.title} description={item.description} />
			))}
		</div>
	);
}
