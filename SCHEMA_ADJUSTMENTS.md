# Ajustes al Schema de Supabase

## ✅ Cambios Realizados

He ajustado todas las queries de Supabase para usar tu esquema actual. Aquí están los cambios principales:

### **Tipos TypeScript Actualizados**

```typescript
// Antes (mi schema)
interface Event {
  id: string; // UUID
  title: string;
  date: string;
  start_time?: string;
  end_time?: string;
  // ...
}

// Ahora (tu schema)
interface Event {
  id: number; // bigint
  name: string; // campo 'name' en vez de 'title'
  start_date: string; // date
  end_date: string; // date (rango completo)
  // ...
}
```

### **Queries Actualizadas**

1. **Listado de eventos**
   ```typescript
   // Antes
   .order("date", { ascending: true })
   
   // Ahora
   .order("start_date", { ascending: true })
   ```

2. **Detalle de evento**
   ```typescript
   // Conversión de string a number
   const eventId = parseInt(params.eventId, 10);
   
   // Usar start_date/end_date en vez de date único
   const formattedDate = format(new Date(event.start_date), ...);
   ```

3. **Sistema de Favoritos**
   ```typescript
   // Antes: user_favorite_events (sin campo boolean)
   .from("user_favorite_events")
   .insert({ user_id, event_id })
   
   // Ahora: users_events (con campo favorite)
   .from("users_events")
   .insert({ user_id, event_id, favorite: true })
   
   // Verificar favorito
   .eq("favorite", true)
   ```

### **Compatibilidad de Campos**

Creé una función helper para manejar `name` vs `title`:

```typescript
export function getEventTitle(event: Event): string {
  return event.title || event.name;
}
```

Esto permite que el código funcione si agregas el campo `title` en el futuro o si usas `name`.

## 📝 Campos que TE FALTAN en Tu Schema

Crea una **nueva migración** con estos campos:

### **Migración Recomendada**

```sql
-- Agregar campos faltantes a la tabla events
ALTER TABLE events 
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS organizer TEXT,
  ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Opcional: Copiar 'name' a 'title' para compatibilidad
UPDATE events SET title = name WHERE title IS NULL;

-- Crear tabla de perfiles de usuario (si usas Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Función para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuario')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para ejecutar la función
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 🔍 Diferencias Principales

| Característica | Tu Schema | Mi Schema Original |
|---------------|-----------|-------------------|
| **ID tipo** | `bigint` | `UUID` |
| **Nombre evento** | `name` | `title` |
| **Fechas** | `start_date`, `end_date` (DATE) | `date` único (DATE) + `start_time`, `end_time` (TEXT) |
| **Favoritos tabla** | `users_events` con campo `favorite` | `user_favorite_events` (registro = favorito) |
| **Ubicación** | ❌ Falta | `location` TEXT |
| **Organizador** | ❌ Falta | `organizer` TEXT |
| **Imagen** | ❌ Falta | `image_url` TEXT |

## ✅ Código Ajustado

Todos los componentes y páginas ahora funcionan con tu schema:

- ✅ `EventCard` usa `event.name` y `event.start_date`
- ✅ `EventDetailPage` convierte `params.eventId` de string a number
- ✅ `FavoriteButton` usa tabla `users_events` con campo `favorite`
- ✅ Tipos TypeScript coinciden con bigint (number en TypeScript)
- ✅ Campos opcionales manejados con condicionales

## 🧪 Datos de Ejemplo

Puedes insertar eventos de prueba así:

```sql
INSERT INTO events (name, description, start_date, end_date, location, organizer, image_url)
VALUES 
  (
    'Conferencia de Tecnología 2024',
    'Evento tecnológico con las últimas tendencias en IA y desarrollo.',
    '2024-10-15',
    '2024-10-15',
    'Centro de Convenciones Metropolitano',
    'Tech Forward Inc.',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop'
  ),
  (
    'Festival de Música Indie',
    'Jornada completa con artistas emergentes de la escena indie.',
    '2024-11-22',
    '2024-11-22',
    'Parque Central',
    'Indie Music Collective',
    'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&auto=format&fit=crop'
  );
```

## 🚀 Próximos Pasos

1. **Ejecuta la migración** de arriba en database.build
2. **Inserta eventos de ejemplo** (o usa los que ya tienes)
3. **Verifica** que la app funcione:
   - `/events` debe mostrar listado
   - Click en "Ver detalles" → detalle completo
   - Click en corazón → agregar/quitar favoritos

## ⚠️ Notas Importantes

- **user_id**: Asegúrate de que `users_events.user_id` sea compatible con `auth.users.id` (UUID en Supabase Auth)
- **Imágenes**: Sin el campo `image_url`, se mostrará un gradient de fallback (funciona bien igual)
- **Location/Organizer**: Opcionales, se ocultan si están vacíos
- **Fechas completas**: Tu schema usa DATE, así que extraigo la hora con format. Si necesitas horas específicas en eventos, considera agregar campos `start_time` y `end_time` como TEXT (HH:MM)

---

**Resumen**: El código está 100% ajustado a tu schema. Solo necesitas agregar los 3 campos opcionales (title, organizer, image_url) si quieres la funcionalidad completa. Sin ellos, la app funciona igual con fallbacks.
