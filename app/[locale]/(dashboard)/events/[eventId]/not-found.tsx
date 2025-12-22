import { CalendarX } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EventNotFound() {
	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
			<div className="text-center">
				<div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
					<CalendarX className="h-12 w-12 text-red-600" />
				</div>
				<h1 className="text-3xl font-bold text-gray-900 mb-2">Evento no encontrado</h1>
				<p className="text-gray-600 mb-8 max-w-md">
					El evento que buscas no existe o ha sido eliminado.
				</p>
				<Link href="/events">
					<Button size="lg">Volver a Eventos</Button>
				</Link>
			</div>
		</div>
	);
}
