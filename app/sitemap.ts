import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/client'

// Nota: En sitemap.ts, createClient debe usarse con cuidado o usar fetch directo si es edge.
// Pero dado que es build time o request time, usaremos una estrategia simple.
// Para sitemaps dinámicos en Next.js App Router, podemos hacer fetch.

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://event-maple.edwardiaz.dev'

  // Rutas estáticas
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ]

  // Rutas dinámicas (Eventos)
  // Usamos fetch directo a la API de Supabase o createClient si es posible.
  // Al ser sitemap, es mejor usar la URL de la API REST de Supabase si tenemos las keys,
  // o instanciar el cliente. Aquí instanciamos un cliente simple.
  // IMPORTANTE: En sitemap generation, a veces cookies/headers no están disponibles,
  // así que usamos createClient estándar o fetch.
  
  try {
    // Fetch simple a Supabase usando la URL y Key públicas (ya que los eventos son públicos ahora)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (supabaseUrl && supabaseKey) {
      const response = await fetch(`${supabaseUrl}/rest/v1/events?select=id,start_date`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        },
        next: { revalidate: 3600 } // Revalidar cada hora
      })

      if (response.ok) {
        const events = await response.json()
        
        const eventUrls: MetadataRoute.Sitemap = events.map((event: any) => ({
          url: `${baseUrl}/events/${event.id}`,
          lastModified: new Date(event.start_date || new Date()),
          changeFrequency: 'weekly',
          priority: 0.7,
        }))

        return [...routes, ...eventUrls]
      }
    }
  } catch (error) {
    console.error('Error generating sitemap for events:', error)
  }

  return routes
}
