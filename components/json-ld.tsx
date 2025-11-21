export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "EventMaple",
          "applicationCategory": "EventManagementApplication",
          "operatingSystem": "Web",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
          },
          "description": "Plataforma gratuita para la gestión integral de eventos y agendas comunitarias.",
          "url": "https://event-maple.edwardiaz.dev",
          "author": {
            "@type": "Person",
            "name": "Edward Díaz",
          },
        }),
      }}
    />
  );
}
