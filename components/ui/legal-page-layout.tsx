import { ArrowLeft, LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import { Link } from "@/lib/i18n/navigation";

interface LegalPageLayoutProps {
	readonly backHref: string;
	readonly backText: string;
	readonly title: string;
	readonly lastUpdateText: string;
	readonly lastUpdateDate: string;
	readonly headerIcon?: LucideIcon;
	readonly headerAlert?: string;
	readonly children: ReactNode;
	readonly footer: {
		readonly backText: string;
		readonly extraContent?: ReactNode;
	};
}

export function LegalPageLayout({
	backHref,
	backText,
	title,
	lastUpdateText,
	lastUpdateDate,
	headerIcon: HeaderIcon,
	headerAlert,
	children,
	footer,
}: LegalPageLayoutProps) {
	return (
		<div className="min-h-screen bg-gray-50">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
				{/* Back Button */}
				<div className="mb-6">
					<Link
						href={backHref}
						className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
					>
						<ArrowLeft className="h-4 w-4" />
						<span className="text-sm font-medium">{backText}</span>
					</Link>
				</div>

				{/* Header */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
					<div className="flex items-center gap-3 mb-4">
						{HeaderIcon && (
							<div className="p-3 bg-primary/10 rounded-lg">
								<HeaderIcon className="h-8 w-8 text-primary" />
							</div>
						)}
						<h1 className="text-4xl font-bold text-gray-900">{title}</h1>
					</div>
					<p className="text-gray-600">
						{lastUpdateText}: {lastUpdateDate}
					</p>
					{headerAlert && (
						<div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
							<p className="text-sm text-blue-900">{headerAlert}</p>
						</div>
					)}
				</div>

				{/* Content */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-8">
					{children}
				</div>

				{/* Footer Actions */}
				<div className="mt-8 text-center space-y-4">
					<Link
						href={backHref}
						className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
					>
						{footer.backText}
					</Link>
					{footer.extraContent}
				</div>
			</div>
		</div>
	);
}
