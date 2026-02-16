interface FeatureItemProps {
	readonly title: string;
	readonly description: string;
}

function FeatureItem({ title, description }: FeatureItemProps) {
	return (
		<div className="flex items-start gap-3">
			<div className="mt-1 p-1.5 bg-green-100 rounded">
				<div className="w-2 h-2 bg-green-600 rounded-full"></div>
			</div>
			<div>
				<h4 className="font-semibold text-gray-900">{title}</h4>
				<p className="text-sm">{description}</p>
			</div>
		</div>
	);
}

interface FeatureListProps {
	readonly items: readonly {
		readonly title: string;
		readonly description: string;
	}[];
	readonly className?: string;
}

export function FeatureList({ items, className = "" }: FeatureListProps) {
	return (
		<div className={`space-y-3 ${className}`}>
			{items.map((item) => (
				<FeatureItem key={item.title} title={item.title} description={item.description} />
			))}
		</div>
	);
}
