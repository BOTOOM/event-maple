# Guía de Configuración - EventPlanner

Esta guía te ayudará a configurar el proyecto desde cero.

## 📋 Prerrequisitos

- Node.js 18+ instalado
- pnpm instalado (`npm install -g pnpm`)
- Una cuenta de Supabase (gratis en [supabase.com](https://supabase.com))

## 🚀 Instalación

### 1. Instalar Dependencias

```bash
cd /home/botom/Projects/Personal/event-planner
pnpm install
```

### 2. Configurar Supabase

#### a) Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Espera a que el proyecto se inicialice (toma ~2 minutos)

#### b) Obtener credenciales

1. En tu proyecto de Supabase, ve a **Settings** > **API**
2. Copia:
   - **Project URL** (ejemplo: `https://xxxxx.supabase.co`)
   - **Project API Key** (anon, public)

#### c) Configurar variables de entorno

```bash
# Copia el archivo de ejemplo
cp .env.example .env.local

# Edita .env.local con tus credenciales
nano .env.local
```

Reemplaza con tus valores:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-api-key-aqui
```

#### d) Crear las tablas en Supabase

1. En tu proyecto de Supabase, ve a **SQL Editor**
2. Crea una nueva query
3. Copia todo el contenido del archivo `supabase/schema.sql`
4. Pega en el editor y haz click en **Run**

Esto creará todas las tablas, índices, políticas RLS y datos de ejemplo.

### 3. Configurar Email Authentication en Supabase

1. Ve a **Authentication** > **Providers** en Supabase
2. Asegúrate de que **Email** esté habilitado
3. (Opcional) Configura **Email Templates** para personalizar los correos de confirmación

### 4. Verificar Configuración

```bash
# Ejecutar en modo desarrollo
pnpm dev
```

La aplicación debería estar corriendo en `http://localhost:3000`

## 🧪 Probar la Aplicación

1. **Landing Page**: Abre `http://localhost:3000`
   - Deberías ver la página principal con el hero, beneficios y características

2. **Registro**: Ve a `http://localhost:3000/register`
   - Regístrate con un email de prueba
   - Recibirás un email de confirmación de Supabase

3. **Login**: Ve a `http://localhost:3000/login`
   - Inicia sesión con las credenciales creadas

## 📁 Estructura del Proyecto

```
event-planner/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Rutas de autenticación
│   ├── page.tsx                # Landing page
│   └── layout.tsx              # Layout raíz
├── components/                 # Componentes React
│   ├── ui/                     # Componentes shadcn/ui
│   ├── landing/                # Componentes del landing
│   └── auth/                   # Componentes de autenticación
├── lib/                        # Utilidades
│   ├── supabase/               # Configuración de Supabase
│   └── types/                  # TypeScript types
├── supabase/                   # Scripts de base de datos
│   └── schema.sql              # Schema de la BD
└── middleware.ts               # Middleware de Next.js
```

## 🔐 Seguridad

- Las credenciales están en `.env.local` (no se suben a Git)
- Row Level Security (RLS) está habilitado en todas las tablas
- Las rutas protegidas requieren autenticación (ver `middleware.ts`)

## 🐛 Troubleshooting

### Error: "Supabase URL is undefined"

- Verifica que `.env.local` existe y tiene las variables correctas
- Reinicia el servidor de desarrollo (`pnpm dev`)

### Error al crear tablas en Supabase

- Asegúrate de ejecutar TODO el script `schema.sql`
- Si hay errores, elimina las tablas y vuelve a ejecutar

### Emails de confirmación no llegan

- Revisa la carpeta de spam
- En desarrollo, Supabase envía emails reales, puede tomar unos minutos

## 📝 Próximos Pasos

Una vez configurado:

- [ ] Crear las páginas de eventos (`/events`)
- [ ] Implementar la vista de detalle de evento
- [ ] Crear la agenda personalizada
- [ ] Implementar el sistema de favoritos
- [ ] Agregar el panel de administración

## 🆘 Soporte

Si tienes problemas:
1. Revisa los logs de Supabase en **Logs** > **Postgres Logs**
2. Revisa la consola del navegador (F12)
3. Verifica que todas las dependencias estén instaladas
