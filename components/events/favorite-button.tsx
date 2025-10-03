"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/lib/hooks/use-toast";
import { useRouter } from "next/navigation";

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
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const toggleFavorite = async () => {
    setIsLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Debes iniciar sesión para agregar favoritos.",
        });
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
          title: "Eliminado de favoritos",
          description: "El evento fue removido de tus favoritos.",
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
          title: "Añadido a favoritos",
          description: "El evento fue agregado a tus favoritos.",
        });
      }

      router.refresh();
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar los favoritos.",
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
        <span>{isFavorite ? "En favoritos" : "Añadir a favoritos"}</span>
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
      aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
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
