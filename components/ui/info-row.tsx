import { ReactNode } from "react";

interface InfoRowProps {
	readonly icon: ReactNode;
	readonly label: string;
	readonly value: ReactNode;
}

export function InfoRow({ icon, label, value }: InfoRowProps) {
	return (
		<div className="flex items-start gap-3">
			<div className="p-2 bg-secondary rounded-lg">{icon}</div>
			<div>
				<p className="text-sm text-muted-foreground">{label}</p>
				<p className="text-base font-medium text-foreground">{value}</p>
			</div>
		</div>
	);
}
