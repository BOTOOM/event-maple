import { Calendar } from "lucide-react";

export function EmptyTalks() {
  return (
    <div className="text-center py-12 px-4">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Calendar className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No hay charlas programadas
      </h3>
      <p className="text-gray-600 max-w-md mx-auto">
        La agenda de este evento aún no está disponible. Vuelve pronto para ver
        las charlas y talleres programados.
      </p>
    </div>
  );
}
