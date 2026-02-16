import { ReactNode } from "react";

interface LegalSectionProps {
	readonly title: string;
	readonly children: ReactNode;
	readonly className?: string;
}

export function LegalSection({ title, children, className = "" }: LegalSectionProps) {
	return (
		<section className={className}>
			<h2 className="text-2xl font-semibold text-foreground mb-4">{title}</h2>
			<div className="space-y-3 text-foreground/80 leading-relaxed">{children}</div>
		</section>
	);
}

interface LegalTwoParagraphSectionProps {
	readonly title: string;
	readonly firstParagraph: string;
	readonly secondParagraph: string;
	readonly className?: string;
}

export function LegalTwoParagraphSection({
	title,
	firstParagraph,
	secondParagraph,
	className,
}: LegalTwoParagraphSectionProps) {
	return (
		<LegalSection title={title} className={className}>
			<p>{firstParagraph}</p>
			<p>{secondParagraph}</p>
		</LegalSection>
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
	blue: "bg-winter-100 border-border text-foreground",
	yellow: "bg-yellow-50 border-yellow-200 text-yellow-900",
	red: "bg-red-50 border-red-200 text-red-900",
	gray: "bg-surface border-border text-foreground",
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
			? "bg-gradient-to-br from-primary/10 to-winter-100 border-primary/20"
			: "bg-surface border-border";

	return (
		<div className={`border rounded-lg p-4 mt-4 ${boxClass}`}>
			<p className="font-medium text-foreground">{title}</p>
			{extraContent}
			<p className="text-foreground/80 mt-2">
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
	return <section className="border-t border-border pt-6">{children}</section>;
}
