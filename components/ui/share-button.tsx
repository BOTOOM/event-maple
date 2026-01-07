"use client";

import { Share2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
	readonly url: string;
	readonly title: string;
	readonly description?: string;
	readonly variant?: "default" | "ghost" | "outline";
	readonly size?: "default" | "sm" | "lg" | "icon";
	readonly className?: string;
}

export function ShareButton({
	url,
	title,
	description,
	variant = "ghost",
	size = "icon",
	className,
}: ShareButtonProps) {
	const t = useTranslations("Common.share");
	const { toast } = useToast();
	const [isSharing, setIsSharing] = useState(false);

	const handleShare = useCallback(async () => {
		setIsSharing(true);

		const origin = globalThis.window?.location?.origin ?? "";
		const fullUrl = origin ? `${origin}${url}` : url;

		try {
			// Check if Web Share API is available (mobile devices)
			if (navigator.share && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
				await navigator.share({
					title,
					text: description || title,
					url: fullUrl,
				});
			} else {
				// Desktop: copy to clipboard
				await navigator.clipboard.writeText(fullUrl);
				toast({
					title: t("linkCopied"),
					description: t("linkCopiedDescription"),
				});
			}
		} catch (error) {
			// User cancelled share or error occurred
			if ((error as Error).name !== "AbortError") {
				// Fallback to clipboard
				try {
					await navigator.clipboard.writeText(fullUrl);
					toast({
						title: t("linkCopied"),
						description: t("linkCopiedDescription"),
					});
				} catch {
					toast({
						title: t("error"),
						description: t("errorDescription"),
						variant: "destructive",
					});
				}
			}
		} finally {
			setIsSharing(false);
		}
	}, [url, title, description, toast, t]);

	return (
		<Button
			variant={variant}
			size={size}
			onClick={handleShare}
			disabled={isSharing}
			className={cn("", className)}
			aria-label={t("shareEvent")}
		>
			<Share2 className="h-4 w-4" />
		</Button>
	);
}
