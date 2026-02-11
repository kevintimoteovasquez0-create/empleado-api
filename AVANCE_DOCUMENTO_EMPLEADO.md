# Avance inicial - DOCUMENTO_EMPLEADO

> **Nota:** Este archivo documenta todo lo que se puede avanzar en la implementación de la tabla `DOCUMENTO_EMPLEADO` sin tocar atributos existentes ni correr migraciones, mientras se espera la tabla `REQUISITO_DOCUMENTO`.

---

## 1. Estructura de carpetas y archivos

- `src/documento_empleado/`
  - `documento_empleado.module.ts`
  - `documento_empleado.controller.ts`
  - `documento_empleado.service.ts`
  - `dto/`
    - `create-documento-empleado.dto.ts`
    - `update-documento-empleado.dto.ts`
  - `schema/`
    - `documento_empleado.ts` (Drizzle schema, FK a requisito_documento pendiente)

---

## 2. Drizzle Schema (sin FK a requisito_documento)

Archivo: `src/documento_empleado/schema/documento_empleado.ts`

```typescript
import {
  pgTable,
  integer,
  text,
  varchar,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const tipoArchivoEnum = pgEnum('tipo_archivo', ['pdf', 'img']);
export const estadoDocumentoEnum = pgEnum('estado_documento', [
  'PENDIENTE',
  'COMPLETO',
  'OBSERVADO',
]);

export const documentoEmpleado = pgTable('documento_empleado', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  empleado_id: integer('empleado_id').notNull(), // FK pendiente
  requisito_id: integer('requisito_id'), // FK pendiente
  archivo_pdf: text('archivo_pdf').notNull(),
  tipo_archivo: tipoArchivoEnum('tipo_archivo').notNull(),
  estado: estadoDocumentoEnum('estado').notNull(),
  observacion_texto: text('observacion_texto'),
  fecha_subida: timestamp('fecha_subida').defaultNow(),
  revisado_por: integer('revisado_por'), // FK pendiente
  fecha_revision: timestamp('fecha_revision'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});
```

> **Nota:** Los FK a `empleado`, `usuario` y `requisito_documento` se agregan cuando tu compañero termine.

---

## 3. DTOs (Data Transfer Objects)

### create-documento-empleado.dto.ts

```typescript
import { IsInt, IsString, IsEnum, IsOptional } from 'class-validator';

export class CreateDocumentoEmpleadoDto {
  @IsInt()
  empleado_id: number;

  @IsInt()
  requisito_id: number;

  @IsString()
  archivo_pdf: string;

  @IsEnum(['pdf', 'img'])
  tipo_archivo: 'pdf' | 'img';

  @IsEnum(['PENDIENTE', 'COMPLETO', 'OBSERVADO'])
  estado: 'PENDIENTE' | 'COMPLETO' | 'OBSERVADO';

  @IsOptional()
  @IsString()
  observacion_texto?: string;

  @IsOptional()
  @IsInt()
  revisado_por?: number;

  @IsOptional()
  fecha_revision?: Date;
}
```

### update-documento-empleado.dto.ts

```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateDocumentoEmpleadoDto } from './create-documento-empleado.dto';

export class UpdateDocumentoEmpleadoDto extends PartialType(
  CreateDocumentoEmpleadoDto,
) {}
```

---

## 4. Módulo, Controller y Service (estructura vacía)

### documento_empleado.module.ts

```typescript
import { Module } from '@nestjs/common';
import { DocumentoEmpleadoService } from './documento_empleado.service';
import { DocumentoEmpleadoController } from './documento_empleado.controller';

@Module({
  controllers: [DocumentoEmpleadoController],
  providers: [DocumentoEmpleadoService],
})
export class DocumentoEmpleadoModule {}
```

### documento_empleado.controller.ts

```typescript
import { Controller } from '@nestjs/common';

@Controller('documento-empleado')
export class DocumentoEmpleadoController {}
```

### documento_empleado.service.ts

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class DocumentoEmpleadoService {}
```

---

## 5. ¿Qué falta por hacer?

- Agregar los FK reales cuando tu compañero termine la tabla `REQUISITO_DOCUMENTO`.
- Implementar la lógica CRUD en el service y controller.
- Registrar el módulo en `app.module.ts` (cuando esté listo).
- Correr migraciones cuando los FK estén definidos.

---

## 6. Recomendaciones

- No correr migraciones hasta que los FK estén listos.
- No modificar atributos de tablas existentes.
- Documenta todo lo que hagas y coordina con tu compañero.

---

## Cambios realizados para adaptarse al patrón de la empresa

- El schema de la tabla `documento_empleado` fue movido a `src/drizzle/schema/documento_empleado.ts`.
- Se mantiene la estructura modular en `src/documento_empleado/` (controller, service, DTOs).
- No se modificó ningún atributo ni archivo existente.
- No se corrieron migraciones.

---

## Cómo estudiar el código

### 1. Modularidad en NestJS

- Cada módulo tiene su propia carpeta con controller, service, DTOs.
- Los schemas de las tablas están centralizados en `src/drizzle/schema/`.
- Los DTOs validan los datos que entran y salen del backend.

### 2. Estructura de `documento_empleado`

- `documento_empleado.module.ts`: Registra el módulo.
- `documento_empleado.controller.ts`: Define los endpoints (vacío por ahora).
- `documento_empleado.service.ts`: Lógica de negocio (vacío por ahora).
- `dto/create-documento-empleado.dto.ts`: Validación para crear.
- `dto/update-documento-empleado.dto.ts`: Validación para actualizar.
- `drizzle/schema/documento_empleado.ts`: Define la tabla en la base de datos.

### 3. Temas a estudiar

- ¿Qué es un módulo en NestJS?
- ¿Qué es un controller y un service?
- ¿Qué es un DTO y cómo se usa?
- ¿Qué es un schema de Drizzle?
- ¿Qué es un FK (foreign key)?
- ¿Qué es un ENUM en la base de datos?
- ¿Por qué centralizar los schemas?
- ¿Cómo se organiza el código para equipos grandes?

---

## Guía para estudiar DOCUMENTO_EMPLEADO

### 1. ¿Qué debes entender?

- Cómo se define un schema en Drizzle (estructura, enums, FK pendientes).
- Cómo se crean y usan DTOs en NestJS para validar datos.
- Cómo funciona la modularidad en NestJS (controller, service, module).
- Por qué los schemas van centralizados en `src/drizzle/schema`.
- Qué significa tener FK pendientes y cómo se conectan cuando estén listos.

### 2. Recomendaciones prácticas

- Lee el schema en `src/drizzle/schema/documento_empleado.ts` y compáralo con la definición SQL que te mandaron.
- Revisa los DTOs y busca cómo se valida cada campo.
- Observa la estructura vacía del controller y service: así se prepara el backend para el CRUD.
- Busca ejemplos en otros módulos para ver cómo se implementa el CRUD y cómo se conectan los FK.

### 3. Preguntas clave para tu estudio

- ¿Cómo se define un enum en Drizzle y cómo se usa en el schema?
- ¿Cómo se valida un campo opcional en un DTO?
- ¿Cómo se conecta un FK en Drizzle y cómo se refleja en el DTO?
- ¿Qué pasos debes seguir para agregar un FK cuando tu compañero termine?
- ¿Cómo se documenta cada avance para que el equipo lo entienda?

### 4. Ejemplo de conexión FK (cuando esté listo)

```typescript
// Ejemplo (no implementes hasta que tu compañero termine)
import { empleado } from './empleado';
import { requisitoDocumento } from './requisito_documento';

export const documentoEmpleado = pgTable('documento_empleado', {
  // ...existing code...
  empleado_id: integer('empleado_id').references(() => empleado.id),
  requisito_id: integer('requisito_id').references(() => requisitoDocumento.id),
  // ...existing code...
});
```

### 5. Cómo avanzar sin romper nada

- No corras migraciones hasta que los FK estén definidos.
- No modifiques atributos de tablas existentes.
- Documenta cada cambio y coordina con tu compañero.
- Si tienes dudas, revisa otros módulos y pregunta.

---

**Esta guía te ayuda a estudiar todo lo realizado y prepararte para terminar el módulo cuando los FK estén listos. Si necesitas ejemplos prácticos o ejercicios, pídelo.**

---

# Resumen de lo que se hizo

- Se creó la estructura inicial del módulo `documento_empleado`.
- Se crearon los DTOs para validación.
- Se creó el schema de la tabla (sin FK a requisito_documento).
- No se tocó ningún atributo ni archivo existente.
- No se corrieron migraciones.
- Todo está documentado en este archivo.
