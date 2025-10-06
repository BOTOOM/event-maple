# EventMaple

Aplicación web responsiva para gestionar agendas de eventos con autenticación mediante Supabase.

## Stack Tecnológico

- **Next.js 15.5.4** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utility-first
- **shadcn/ui** - Componentes UI
- **Supabase** - Autenticación y base de datos
- **Lucide React** - Iconos
- **date-fns** - Manejo de fechas
- **Zustand** - Estado global

## Instalación

```bash
# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de Supabase

# Modo desarrollo
pnpm dev

# Build de producción
pnpm build
pnpm start
```

## Estructura del Proyecto

```
event-planner/
├── app/                      # App Router de Next.js
│   ├── (auth)/              # Grupo de rutas de autenticación
│   ├── (dashboard)/         # Grupo de rutas protegidas
│   ├── page.tsx             # Landing page
│   └── layout.tsx           # Layout raíz
├── components/              # Componentes React
│   ├── ui/                  # Componentes shadcn
│   ├── landing/             # Componentes del landing
│   ├── auth/                # Componentes de autenticación
│   └── shared/              # Componentes compartidos
├── lib/                     # Utilidades y configuración
│   ├── supabase/            # Cliente Supabase
│   └── utils.ts             # Helpers
└── public/                  # Archivos estáticos
```

## Características

- ✅ Server-Side Rendering (SSR)
- ✅ Autenticación con Supabase
- ✅ Gestión de eventos y charlas
- ✅ Agenda personalizada tipo calendario
- ✅ Sistema de favoritos
- ✅ Diseño responsive
- ✅ Modo oscuro (opcional)

## Scripts

- `pnpm dev` - Servidor de desarrollo
- `pnpm build` - Build de producción
- `pnpm start` - Servidor de producción
- `pnpm lint` - Linter ESLint
