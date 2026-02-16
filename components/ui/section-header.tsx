import { ReactNode } from "react";

interface SectionHeaderProps {
	readonly icon: ReactNode;
	readonly title: string;
}

export function SectionHeader({ icon, title }: SectionHeaderProps) {
	return (
		<div className="flex items-center gap-3 mb-4">
			<div className="p-2 bg-secondary rounded-lg">{icon}</div>
			<h2 className="text-2xl font-semibold text-foreground">{title}</h2>
		</div>
	);
}
