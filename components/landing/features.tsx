import { MapPin } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export function Features() {
  const t = useTranslations("Landing.Features");

  const features = [
    {
      title: t("items.agenda.title"),
      description: t("items.agenda.description"),
      badge: null,
      image: "https://tfpdrgwwxdexsflpxmce.supabase.co/storage/v1/object/sign/event-images/banners/task.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wODc1NTFjNy05YzA1LTQ2ZWQtOTAzNC04NmI1ZWFiNTUzNTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJldmVudC1pbWFnZXMvYmFubmVycy90YXNrLmpwZyIsImlhdCI6MTc1OTc3MTc4OSwiZXhwIjoxNzkxMzA3Nzg5fQ.iByl0xSfKRnxn106h5oFAquGlwfHEa4Ej_v_hSn3gJk",
      alt: t("items.agenda.alt"),
    },
    {
      title: t("items.notifications.title"),
      description: t("items.notifications.description"),
      badge: t("badges.comingSoon"),
      image: "https://tfpdrgwwxdexsflpxmce.supabase.co/storage/v1/object/sign/event-images/banners/notify.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wODc1NTFjNy05YzA1LTQ2ZWQtOTAzNC04NmI1ZWFiNTUzNTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJldmVudC1pbWFnZXMvYmFubmVycy9ub3RpZnkuanBnIiwiaWF0IjoxNzU5NzcxODE2LCJleHAiOjE3OTEzMDc4MTZ9.mrnCK8gjwBvLCbkMkvV7XzooJThEA9pzYnYsFb6nRBc",
      alt: t("items.notifications.alt"),
    },
    {
      title: t("items.maps.title"),
      description: t("items.maps.description"),
      badge: t("badges.comingSoon"),
      image: "https://tfpdrgwwxdexsflpxmce.supabase.co/storage/v1/object/sign/event-images/banners/map.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wODc1NTFjNy05YzA1LTQ2ZWQtOTAzNC04NmI1ZWFiNTUzNTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJldmVudC1pbWFnZXMvYmFubmVycy9tYXAuanBnIiwiaWF0IjoxNzU5NzcxNTEwLCJleHAiOjE3OTEzMDc1MTB9.N8wtTKwx4W-OIleN_p6IAykASg6ayMwFENd4HK9tG-A",
      alt: t("items.maps.alt"),
    },
  ];

  return (
    <section id="features" className="py-20 sm:py-28 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t("title")}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
            >
              {/* Image */}
              <div className="relative h-48 bg-gray-200">
                <Image
                  src={feature.image}
                  alt={feature.alt}
                  fill
                  className="object-cover"
                />
                {feature.badge && (
                  <div className="absolute top-4 right-4 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {feature.badge}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
