"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/lib/hooks/use-toast";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

interface FavoriteButtonProps {
  eventId: number; // bigint en tu schema
  initialIsFavorite: boolean;
  className?: string;
  variant?: "icon" | "button";
}

export function FavoriteButton({
  eventId,
  initialIsFavorite,
  className,
  variant = "icon",
}: FavoriteButtonProps) {
  const t = useTranslations("Events.Favorite");
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();

  const toggleFavorite = async () => {
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

      if (isFavorite) {
        // Remove from favorites - usando tu tabla users_events
        const { error } = await supabase
          .from("users_events")
          .delete()
          .eq("user_id", user.id)
          .eq("event_id", eventId);

        if (error) throw error;

        setIsFavorite(false);
        toast({
          variant: "default",
          title: t("toast.removedTitle"),
          description: t("toast.removedDesc"),
        });
      } else {
        // Add to favorites - usando tu tabla users_events
        const { error } = await supabase
          .from("users_events")
          .insert({
            user_id: user.id,
            event_id: eventId,
            favorite: true,
          });

        if (error) throw error;

        setIsFavorite(true);
        toast({
          variant: "success",
          title: t("toast.addedTitle"),
          description: t("toast.addedDesc"),
        });
      }

      router.refresh();
    } catch (error) {
      console.error("Error toggling favorite:", error);
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
      <button
        onClick={toggleFavorite}
        disabled={isLoading}
        className={cn(
          "flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors",
          isLoading && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        <Heart
          className={cn(
            "h-5 w-5",
            isFavorite && "fill-red-500 text-red-500"
          )}
        />
        <span>{isFavorite ? t("added") : t("add")}</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      className={cn(
        "p-2 rounded-full hover:bg-gray-100 transition-colors",
        isLoading && "opacity-50 cursor-not-allowed",
        className
      )}
      aria-label={isFavorite ? t("remove") : t("add")}
    >
      <Heart
        className={cn(
          "h-6 w-6",
          isFavorite ? "fill-red-500 text-red-500" : "text-gray-700"
        )}
      />
    </button>
  );
}
