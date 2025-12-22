import { ReactNode } from "react";

interface LegalSectionProps {
	readonly title: string;
	readonly children: ReactNode;
	readonly className?: string;
}

export function LegalSection({ title, children, className = "" }: LegalSectionProps) {
	return (
		<section className={className}>
			<h2 className="text-2xl font-semibold text-gray-900 mb-4">{title}</h2>
			<div className="space-y-3 text-gray-700 leading-relaxed">{children}</div>
		</section>
	);
}

interface LegalListProps {
	readonly items: readonly string[];
	readonly useHtml?: boolean;
}

export function LegalList({ items, useHtml = false }: LegalListProps) {
	return (
		<ul className="list-disc pl-6 space-y-2">
			{items.map((item) =>
				useHtml ? (
					<li key={item} dangerouslySetInnerHTML={{ __html: item }} />
				) : (
					<li key={item}>{item}</li>
				),
			)}
		</ul>
	);
}

interface LegalAlertProps {
	readonly children: ReactNode;
	readonly variant?: "blue" | "yellow" | "red" | "gray";
}

const alertVariants = {
	blue: "bg-blue-50 border-blue-200 text-blue-900",
	yellow: "bg-yellow-50 border-yellow-200 text-yellow-900",
	red: "bg-red-50 border-red-200 text-red-900",
	gray: "bg-gray-50 border-gray-200 text-gray-900",
};

export function LegalAlert({ children, variant = "blue" }: LegalAlertProps) {
	return (
		<div className={`border rounded-lg p-4 mt-4 ${alertVariants[variant]}`}>
			<p className="text-sm">{children}</p>
		</div>
	);
}

interface LegalContactBoxProps {
	readonly title: string;
	readonly email: string;
	readonly emailLabel?: string;
	readonly extraContent?: ReactNode;
	readonly variant?: "simple" | "gradient";
}

export function LegalContactBox({
	title,
	email,
	emailLabel = "Email:",
	extraContent,
	variant = "simple",
}: LegalContactBoxProps) {
	const boxClass =
		variant === "gradient"
			? "bg-gradient-to-br from-primary/10 to-blue-50 border-primary/20"
			: "bg-gray-50 border-gray-200";

	return (
		<div className={`border rounded-lg p-4 mt-4 ${boxClass}`}>
			<p className="font-medium text-gray-900">{title}</p>
			{extraContent}
			<p className="text-gray-700 mt-2">
				{emailLabel}{" "}
				<a href={`mailto:${email}`} className="text-primary hover:underline">
					{email}
				</a>
			</p>
		</div>
	);
}

interface LegalFooterSectionProps {
	readonly children: ReactNode;
}

export function LegalFooterSection({ children }: LegalFooterSectionProps) {
	return <section className="border-t border-gray-200 pt-6">{children}</section>;
}
