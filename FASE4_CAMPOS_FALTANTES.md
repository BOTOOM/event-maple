# 📋 Fase 4 - Campos Faltantes en Schema

## ❌ Campos que FALTAN en la tabla `talks`

Basándome en los diseños de UI proporcionados, estos campos son **necesarios**:

### 1. **speaker_name** (TEXT, nullable)
- **Por qué:** El diseño muestra "Dr. Elara Vance" como ponente
- **Uso:** Mostrar quién da la charla
- **Recomendación:** TEXT porque puede haber múltiples ponentes separados por coma

### 2. **date** (DATE, nullable o NOT NULL)
- **Por qué:** El diseño muestra "15 de Octubre" - fecha específica
- **Problema actual:** Solo tienes `start_time` y `end_time` que son TIME (hora sin fecha)
- **Uso:** Las charlas necesitan una fecha completa para ordenar por día
- **Recomendación:** DATE NOT NULL (cada charla debe tener una fecha)

### 3. **speaker_bio** (TEXT, nullable) - OPCIONAL
- **Por qué:** Para mostrar información del ponente en el detalle
- **Uso:** Biografía breve del speaker
- **Prioridad:** Media (nice to have)

### 4. **speaker_photo** (TEXT, nullable) - OPCIONAL
- **Por qué:** URL de la foto del ponente
- **Uso:** Avatar del speaker en la UI
- **Prioridad:** Baja (puede usarse un avatar genérico)

## 🤔 Campos que PODRÍAN ser útiles (Opcionales)

### 5. **tags** (TEXT[] o JSONB, nullable)
- **Por qué:** Permitir filtrar charlas por temas (Backend, Frontend, DevOps, etc.)
- **Uso:** Filtros en la UI
- **Ejemplo:** `['Backend', 'Node.js', 'APIs']`

### 6. **capacity** (INTEGER, nullable)
- **Por qué:** Límite de asistentes para talleres
- **Uso:** Mostrar "20/50 asistentes" y deshabilitar registro cuando esté lleno

### 7. **registration_required** (BOOLEAN, default false)
- **Por qué:** Algunas charlas requieren registro previo, otras son libres
- **Uso:** Mostrar si necesita inscripción

### 8. **level** (TEXT, nullable)
- **Por qué:** Nivel de dificultad (Principiante, Intermedio, Avanzado)
- **Uso:** Filtrar charlas por nivel
- **Ejemplo:** `'Intermedio'`

## 📝 Migración Recomendada (MÍNIMO NECESARIO)

```sql
-- Migration: Add required fields to talks table

-- Campo CRÍTICO: fecha de la charla
ALTER TABLE talks
  ADD COLUMN IF NOT EXISTS date DATE;

-- Actualizar charlas existentes con la fecha del evento padre (si aplica)
UPDATE talks 
SET date = (SELECT start_date FROM events WHERE events.id = talks.event_id)
WHERE date IS NULL;

-- Hacer el campo NOT NULL después de poblarlo
ALTER TABLE talks
  ALTER COLUMN date SET NOT NULL;

-- Campo IMPORTANTE: nombre del ponente
ALTER TABLE talks
  ADD COLUMN IF NOT EXISTS speaker_name TEXT;

-- Campos OPCIONALES: info adicional del speaker
ALTER TABLE talks
  ADD COLUMN IF NOT EXISTS speaker_bio TEXT,
  ADD COLUMN IF NOT EXISTS speaker_photo TEXT;
```

## 📝 Migración COMPLETA (Con campos opcionales)

```sql
-- Migration: Add all recommended fields to talks table

-- Campos críticos
ALTER TABLE talks
  ADD COLUMN IF NOT EXISTS date DATE,
  ADD COLUMN IF NOT EXISTS speaker_name TEXT;

-- Campos de speaker
ALTER TABLE talks
  ADD COLUMN IF NOT EXISTS speaker_bio TEXT,
  ADD COLUMN IF NOT EXISTS speaker_photo TEXT;

-- Campos de organización
ALTER TABLE talks
  ADD COLUMN IF NOT EXISTS tags TEXT[], -- Array de strings
  ADD COLUMN IF NOT EXISTS level TEXT, -- 'Principiante', 'Intermedio', 'Avanzado'
  ADD COLUMN IF NOT EXISTS capacity INTEGER,
  ADD COLUMN IF NOT EXISTS registration_required BOOLEAN DEFAULT false;

-- Poblar fecha desde evento padre
UPDATE talks 
SET date = (SELECT start_date FROM events WHERE events.id = talks.event_id)
WHERE date IS NULL;

-- Hacer fecha NOT NULL
ALTER TABLE talks
  ALTER COLUMN date SET NOT NULL;

-- Crear índice para búsquedas por fecha
CREATE INDEX IF NOT EXISTS idx_talks_date ON talks(date);

-- Crear índice para búsquedas por evento
CREATE INDEX IF NOT EXISTS idx_talks_event_id ON talks(event_id);
```

## ✅ Campos que YA TIENES y están bien

- ✅ `title` - Título de la charla
- ✅ `short_description` - Descripción corta para el listado
- ✅ `detailed_description` - Descripción completa para el detalle
- ✅ `start_time` - Hora de inicio (TIME)
- ✅ `end_time` - Hora de fin (TIME)
- ✅ `room` - Sala donde se realiza
- ✅ `floor` - Piso donde está la sala
- ✅ `is_fixed` - Si la charla está fija en el horario

## 🎯 Recomendación Final

**Migración MÍNIMA (solo lo esencial):**
- `date` (DATE, NOT NULL)
- `speaker_name` (TEXT, nullable)

**Migración RECOMENDADA (mejor UX):**
- `date` (DATE, NOT NULL)
- `speaker_name` (TEXT, nullable)
- `speaker_bio` (TEXT, nullable)
- `speaker_photo` (TEXT, nullable)
- `tags` (TEXT[], nullable)
- `level` (TEXT, nullable)

**Decisión:** Tú decides cuáles agregar. El código funcionará con ambos casos, simplemente ocultará secciones si faltan datos.

---

**Siguiente paso:** Créame las migraciones que prefieras y yo adapto el código para usar los campos disponibles.
