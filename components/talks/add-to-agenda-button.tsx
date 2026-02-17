"use client";

import { Heart } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface AddToAgendaButtonProps {
	talkId: number;
	eventId: number;
	initialIsInAgenda: boolean;
	className?: string;
	variant?: "icon" | "button";
}

export function AddToAgendaButton({
	talkId,
	eventId,
	initialIsInAgenda,
	className,
	variant = "icon",
}: AddToAgendaButtonProps) {
	const [isInAgenda, setIsInAgenda] = useState(initialIsInAgenda);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const pathname = usePathname();
	const supabase = createClient();
	const t = useTranslations("Events.AgendaButton");

	const handleToggle = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		setIsLoading(true);

		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) {
				// Redirigir al login con returnUrl
				const returnUrl = encodeURIComponent(pathname);
				router.push(`/login?returnUrl=${returnUrl}`);
				return;
			}

			if (isInAgenda) {
				// Remove from agenda
				const { error } = await supabase
					.from("personal_agenda")
					.delete()
					.eq("user_id", user.id)
					.eq("talk_id", talkId);

				if (error) throw error;

				setIsInAgenda(false);
				toast({
					variant: "default",
					title: t("toast.removedTitle"),
					description: t("toast.removedDesc"),
				});
			} else {
				// Add to agenda
				const { error } = await supabase.from("personal_agenda").insert({
					user_id: user.id,
					talk_id: talkId,
					event_id: eventId,
				});

				if (error) throw error;

				setIsInAgenda(true);
				toast({
					variant: "success",
					title: t("toast.addedTitle"),
					description: t("toast.addedDesc"),
				});
			}

			router.refresh();
		} catch (error) {
			console.error("Error toggling agenda:", error);
			toast({
				variant: "destructive",
				title: t("toast.errorTitle"),
				description: t("toast.errorDesc"),
			});
		} finally {
			setIsLoading(false);
		}
	};

	if (variant === "button") {
		return (
			<Button
				onClick={handleToggle}
				disabled={isLoading}
				variant={isInAgenda ? "default" : "outline"}
				className={cn("w-full sm:w-auto", isInAgenda && "bg-primary hover:bg-primary/90", className)}
			>
				<Heart className={cn("h-4 w-4 mr-2", isInAgenda && "fill-white")} />
				{isInAgenda ? t("inAgenda") : t("add")}
			</Button>
		);
	}

	return (
		<button
			type="button"
			onClick={handleToggle}
			disabled={isLoading}
			className={cn(
				"p-2 rounded-full hover:bg-secondary transition-colors flex-shrink-0",
				className,
			)}
			aria-label={isInAgenda ? t("removeAriaLabel") : t("addAriaLabel")}
		>
			<Heart
				className={cn(
					"h-5 w-5 transition-colors",
					isInAgenda ? "fill-red-500 text-red-500" : "text-muted-foreground hover:text-red-500",
				)}
			/>
		</button>
	);
}
