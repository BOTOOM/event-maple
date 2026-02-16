import { ReactNode } from "react";

interface InfoCardProps {
	readonly title: string;
	readonly description: string;
	readonly className?: string;
}

export function InfoCard({ title, description, className = "" }: InfoCardProps) {
	return (
		<div className={`p-4 bg-surface rounded-lg border border-border ${className}`}>
			<h4 className="font-semibold text-foreground mb-2">{title}</h4>
			<p className="text-sm text-muted-foreground">{description}</p>
		</div>
	);
}

interface InfoCardGridProps {
	readonly children: ReactNode;
	readonly columns?: 1 | 2 | 3 | 4;
	readonly className?: string;
}

export function InfoCardGrid({ children, columns = 2, className = "" }: InfoCardGridProps) {
	const gridCols = {
		1: "grid-cols-1",
		2: "md:grid-cols-2",
		3: "md:grid-cols-3",
		4: "md:grid-cols-2 lg:grid-cols-4",
	};

	return <div className={`grid ${gridCols[columns]} gap-4 ${className}`}>{children}</div>;
}
