import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageSquareOff } from "lucide-react";

export default function TalkNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <MessageSquareOff className="h-12 w-12 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Charla no encontrada
        </h1>
        <p className="text-gray-600 mb-8 max-w-md">
          La charla que buscas no existe o ha sido eliminada.
        </p>
        <Link href="/events">
          <Button size="lg">Volver a Eventos</Button>
        </Link>
      </div>
    </div>
  );
}
