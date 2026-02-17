"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
	readonly backHref: string;
	readonly backText: string;
	readonly mobileTitle: string;
	readonly rightContent?: ReactNode;
}

export function PageHeader({ backHref, backText, mobileTitle, rightContent }: PageHeaderProps) {
	return (
		<>
			{/* Mobile Header */}
			<div className="md:hidden sticky top-0 z-40 bg-card border-b border-border">
				<div className="flex items-center justify-between px-4 h-14">
					<Link href={backHref}>
						<Button variant="ghost" size="icon">
							<ArrowLeft className="h-5 w-5" />
						</Button>
					</Link>
					<span className="font-semibold text-foreground">{mobileTitle}</span>
					{rightContent || <div className="w-10" />}
				</div>
			</div>

			{/* Desktop Header */}
			<div className="hidden md:block sticky top-0 z-40 bg-card border-b border-border">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16">
						<Link href={backHref}>
							<Button variant="ghost">
								<ArrowLeft className="h-4 w-4 mr-2" />
								{backText}
							</Button>
						</Link>
						{rightContent}
					</div>
				</div>
			</div>
		</>
	);
}
