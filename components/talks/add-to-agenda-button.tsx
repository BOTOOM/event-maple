"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/lib/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

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
  const supabase = createClient();

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Debes iniciar sesión para agregar charlas a tu agenda.",
        });
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
          title: "Eliminado de tu agenda",
          description: "La charla fue removida de tu agenda personal.",
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
          title: "Añadido a tu agenda",
          description: "La charla fue agregada a tu agenda personal.",
        });
      }

      router.refresh();
    } catch (error) {
      console.error("Error toggling agenda:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar tu agenda. Intenta de nuevo.",
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
        className={cn(
          "w-full sm:w-auto",
          isInAgenda && "bg-blue-600 hover:bg-blue-700",
          className
        )}
      >
        <Heart
          className={cn(
            "h-4 w-4 mr-2",
            isInAgenda && "fill-white"
          )}
        />
        {isInAgenda ? "En mi agenda" : "Añadir a mi agenda"}
      </Button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={cn(
        "p-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0",
        className
      )}
      aria-label={isInAgenda ? "Quitar de agenda" : "Añadir a agenda"}
    >
      <Heart
        className={cn(
          "h-5 w-5 transition-colors",
          isInAgenda
            ? "fill-red-500 text-red-500"
            : "text-gray-400 hover:text-red-500"
        )}
      />
    </button>
  );
}
