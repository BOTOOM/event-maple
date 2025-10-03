# Próximos Pasos - EventPlanner

## ✅ Completado (Fase 1)

- [x] Proyecto Next.js 15.5.4 inicializado
- [x] Configuración de TypeScript
- [x] Tailwind CSS y shadcn/ui configurados
- [x] Landing page completa con diseño moderno
- [x] Sistema de autenticación (UI)
- [x] Configuración de Supabase (cliente, servidor, middleware)
- [x] Schema de base de datos completo
- [x] Route groups para organización
- [x] Componentes UI base (Button, Input, Label, Tabs, Card)

## 🔄 Pendiente - Fase 2: Conectar Autenticación

### Tareas:

1. **Implementar lógica de Login en `components/auth/auth-form.tsx`**
   ```typescript
   // En handleLogin
   const { data, error } = await supabase.auth.signInWithPassword({
     email,
     password,
   });
   ```

2. **Implementar lógica de Registro**
   ```typescript
   // En handleRegister
   const { data, error } = await supabase.auth.signUp({
     email,
     password,
     options: {
       data: {
         name: fullName,
       },
     },
   });
   ```

3. **Crear hook de autenticación `lib/hooks/useAuth.ts`**
   - useUser()
   - useSession()
   - signOut()

4. **Agregar manejo de errores y mensajes de éxito**
   - Toast notifications (agregar shadcn/ui toast)

## 📋 Pendiente - Fase 3: Listado de Eventos

### Tareas:

1. **Crear página `/app/(dashboard)/events/page.tsx`**
   - Server Component que fetch eventos desde Supabase
   - Mostrar grid de EventCard

2. **Componente `EventCard`**
   - Título, fecha, ubicación
   - Imagen del evento
   - Botón "Ver detalles"
   - Botón de favorito (corazón)

3. **Implementar sistema de favoritos para eventos**
   - Server Action para agregar/quitar favoritos
   - Actualizar UI optimistically

## 📋 Pendiente - Fase 4: Detalle de Evento y Charlas

### Tareas:

1. **Página `/app/(dashboard)/events/[eventId]/page.tsx`**
   - Información completa del evento
   - Lista de charlas/talleres
   - Botón de favorito del evento

2. **Componente `TalkCard`**
   - Título, descripción corta
   - Horario (start_time - end_time)
   - Botón de favorito

3. **Vista detallada de charla (Modal o página)**
   - Descripción completa
   - Sala y piso
   - Horario detallado

## 📅 Pendiente - Fase 5: Agenda Personal

### Tareas:

1. **Página `/app/(dashboard)/my-agenda/page.tsx`**
   - Vista de calendario de un día
   - Mostrar charlas favoritas del usuario
   - Indicar charlas fijas del admin

2. **Componente `CalendarView`**
   - Timeline vertical por horas
   - Slots de tiempo
   - Manejo de conflictos (charlas en paralelo)

3. **Lógica de charlas fijas**
   - Auto-añadir charlas con `is_fixed: true` a la agenda
   - No permitir quitar favoritos de charlas fijas

## 🔧 Pendiente - Fase 6: Panel de Administración

### Tareas:

1. **Crear role-based access**
   - Agregar campo `role` a tabla users
   - Política RLS para admins

2. **CRUD de Eventos**
   - `/app/(admin)/admin/events/page.tsx`
   - Formulario crear/editar evento
   - Subida de imágenes (Supabase Storage)

3. **CRUD de Charlas**
   - Crear charlas asociadas a eventos
   - Marcar charlas como fijas
   - Gestión de horarios

## 🎨 Mejoras Futuras

- [ ] Modo oscuro
- [ ] Notificaciones push (PWA)
- [ ] Mapas del evento (Mapbox/Google Maps)
- [ ] Compartir agenda por email
- [ ] Exportar agenda a Google Calendar
- [ ] Búsqueda y filtros avanzados
- [ ] Versión móvil nativa (React Native/Capacitor)
- [ ] Sistema de ratings para charlas
- [ ] Chat entre asistentes
- [ ] QR codes para check-in

## 🚀 Para Empezar Ahora

```bash
# 1. Instalar dependencias
pnpm install

# 2. Configurar Supabase (ver SETUP.md)
cp .env.example .env.local
# Editar .env.local con tus credenciales

# 3. Crear tablas en Supabase
# Ejecutar supabase/schema.sql en Supabase SQL Editor

# 4. Iniciar servidor de desarrollo
pnpm dev
```

## 📚 Recursos

- [Next.js 15 Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev)
