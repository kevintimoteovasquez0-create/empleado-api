# PLAN DE ESTUDIO COMPLETO - Backend EMPRESOFT PERU

> **Para quién es esto:** Para alguien que sabe HTML, CSS, JS básico y un poquito de TypeScript y SQL.
> **Objetivo:** Que entiendas TODO lo que pasa en este backend, de inicio a fin, sin morir en el intento.
> **Cómo usarlo:** Ve tema por tema, en orden. No te saltes nada. Cada tema tiene subtemas que van de lo más fácil a lo más difícil.

---

## TABLA DE CONTENIDOS

- [NIVEL 0 - Antes de todo](#nivel-0---antes-de-todo)
- [NIVEL 1 - TypeScript (lo que te falta)](#nivel-1---typescript-lo-que-te-falta)
- [NIVEL 2 - Node.js básico](#nivel-2---nodejs-básico)
- [NIVEL 3 - SQL y PostgreSQL](#nivel-3---sql-y-postgresql)
- [NIVEL 4 - NestJS (el framework del proyecto)](#nivel-4---nestjs-el-framework-del-proyecto)
- [NIVEL 5 - Drizzle ORM (cómo se habla con la base de datos)](#nivel-5---drizzle-orm-cómo-se-habla-con-la-base-de-datos)
- [NIVEL 6 - Autenticación y Seguridad](#nivel-6---autenticación-y-seguridad)
- [NIVEL 7 - Funcionalidades específicas del proyecto](#nivel-7---funcionalidades-específicas-del-proyecto)
- [NIVEL 8 - Herramientas del día a día](#nivel-8---herramientas-del-día-a-día)
- [MAPA DEL PROYECTO - Qué hace cada archivo](#mapa-del-proyecto---qué-hace-cada-archivo)

---

## NIVEL 0 - Antes de todo

> Cosas que deberías tener claras antes de empezar. Si ya las sabes, pasa al Nivel 1.

### 0.1 ¿Qué es un backend?

- Es el "cerebro" de una aplicación web
- Recibe peticiones del frontend (o de Postman), las procesa y devuelve respuestas
- Ejemplo: el frontend manda "dame la lista de empleados" → el backend busca en la base de datos → devuelve la lista

### 0.2 ¿Qué es una API REST?

- Es una forma de comunicar frontend con backend usando URLs
- Usa **métodos HTTP**:
  - `GET` → obtener datos ("dame algo")
  - `POST` → crear datos ("guarda esto")
  - `PUT` / `PATCH` → actualizar datos ("cambia esto")
  - `DELETE` → eliminar datos ("borra esto")
- Ejemplo: `GET /sistema/api/v1/usuarios` → te devuelve todos los usuarios

### 0.3 ¿Qué es JSON?

- Es el formato en que viajan los datos entre frontend y backend
- Parece un objeto de JavaScript:

```json
{
  "nombre": "Juan",
  "edad": 25,
  "activo": true
}
```

### 0.4 ¿Qué es un servidor?

- Es un programa que está "escuchando" peticiones todo el rato
- Este proyecto escucha en el puerto **3002**
- Cuando prendes el backend con `pnpm run start:dev`, estás prendiendo el servidor

### 0.5 ¿Qué es una base de datos?

- Es donde se guardan los datos de forma permanente (usuarios, empleados, contratos, etc.)
- Este proyecto usa **PostgreSQL** (una base de datos relacional, o sea con tablas)
- Las tablas son como hojas de Excel: filas y columnas

---

## NIVEL 1 - TypeScript (lo que te falta)

> TypeScript es JavaScript pero con **tipos**. Este proyecto está 100% en TypeScript. Si no lo entiendes, no vas a entender nada.

### 1.1 Tipos básicos (repaso rápido)

- `string` → texto: `"hola"`
- `number` → números: `42`, `3.14`
- `boolean` → verdadero/falso: `true`, `false`
- `null` y `undefined` → vacío / no definido
- `any` → cualquier cosa (evitar usarlo)

```typescript
let nombre: string = 'Juan';
let edad: number = 25;
let activo: boolean = true;
```

### 1.2 Arrays y objetos tipados

```typescript
// Array de strings
let frutas: string[] = ['manzana', 'pera'];

// Objeto con tipos
let usuario: { nombre: string; edad: number } = {
  nombre: 'Juan',
  edad: 25,
};
```

### 1.3 Interfaces

> **En el proyecto se usan en:** auth/interfaces/, config/env/, guards

- Son como "moldes" que dicen qué forma debe tener un objeto

```typescript
interface Usuario {
  id: number;
  nombre: string;
  email: string;
  activo: boolean;
}

// Ahora TypeScript te obliga a respetar la forma
let user: Usuario = {
  id: 1,
  nombre: 'Juan',
  email: 'juan@mail.com',
  activo: true,
};
```

### 1.4 Types vs Interfaces

```typescript
// Type - más flexible, puede ser unión de tipos
type Documento = 'DNI' | 'CE';

// Interface - para objetos, se puede extender
interface Persona {
  nombre: string;
}
interface Empleado extends Persona {
  cargo: string;
}
```

### 1.5 Enums (enumeraciones)

> **En el proyecto:** Se usan enums de PostgreSQL (pgEnum), pero el concepto es el mismo

```typescript
enum EstadoContrato {
  ACTIVO = 'ACTIVO',
  VENCIDO = 'VENCIDO',
  TERMINADO = 'TERMINADO',
}

let estado: EstadoContrato = EstadoContrato.ACTIVO;
```

### 1.6 Funciones tipadas

```typescript
// Función que recibe un string y devuelve un number
function contarLetras(texto: string): number {
  return texto.length;
}

// Función con parámetro opcional (el ? lo hace opcional)
function saludar(nombre: string, apellido?: string): string {
  return `Hola ${nombre} ${apellido ?? ''}`;
}
```

### 1.7 Async / Await y Promesas

> **CRÍTICO:** Todo el proyecto usa async/await. Sin esto estás perdido.

```typescript
// Una Promesa es algo que "promete" darte un valor en el futuro
// async/await es la forma bonita de manejar promesas

async function obtenerUsuario(id: number): Promise<Usuario> {
  // await = "espera a que esto termine"
  const usuario = await baseDeDatos.buscar(id);
  return usuario;
}

// SIN async/await (feo, pero para que entiendas qué pasa por detrás):
function obtenerUsuario(id: number): Promise<Usuario> {
  return baseDeDatos.buscar(id).then((usuario) => usuario);
}
```

### 1.8 Destructuring (desestructuración)

> **En el proyecto:** Se usa MUCHO, especialmente en los services

```typescript
// Extraer propiedades de un objeto
const usuario = { nombre: 'Juan', edad: 25, email: 'j@mail.com' };
const { nombre, email } = usuario;
// nombre = "Juan", email = "j@mail.com"

// Rest operator (...) - "dame el resto"
const { edad, ...restoDelUsuario } = usuario;
// edad = 25
// restoDelUsuario = { nombre: "Juan", email: "j@mail.com" }

// En el proyecto se ve así:
// const { empleado_id, ...restoCampos } = getTableColumns(contrato);
```

### 1.9 Spread operator (...)

```typescript
// Copiar y agregar cosas a un objeto
const base = { nombre: 'Juan', edad: 25 };
const completo = { ...base, email: 'j@mail.com' };
// completo = { nombre: "Juan", edad: 25, email: "j@mail.com" }
```

### 1.10 Operador ?? (nullish coalescing)

> **En el proyecto:** `page ?? 1`, `limit ?? 10`, `envs.port ?? 3002`

```typescript
// Si el valor de la izquierda es null o undefined, usa el de la derecha
const puerto = envs.port ?? 3002;
// Si envs.port es null o undefined → puerto = 3002
// Si envs.port es 4000 → puerto = 4000
```

### 1.11 Operador ?. (optional chaining)

```typescript
const usuario = { nombre: 'Juan', direccion: null };
const ciudad = usuario.direccion?.ciudad;
// No explota, simplemente devuelve undefined
```

### 1.12 Generics (genéricos)

> **En el proyecto:** `Promise<Usuario>`, `NodePgDatabase<typeof schema>`

```typescript
// Los generics son como "huecos" que llenas con un tipo
// Promise<string> = una promesa que devuelve un string
// Promise<number> = una promesa que devuelve un number
// Array<string> = un array de strings (igual que string[])

// Función genérica
function primero<T>(lista: T[]): T {
  return lista[0];
}

primero<string>(['a', 'b']); // devuelve "a" (string)
primero<number>([1, 2]); // devuelve 1 (number)
```

### 1.13 Decoradores (@)

> **IMPORTANTÍSIMO:** NestJS usa decoradores para TODO. Si no entiendes esto, NestJS no va a tener sentido.

```typescript
// Un decorador es una función que "decora" (agrega comportamiento) a una clase, método o propiedad
// Se escriben con @ arriba de lo que decoran

@Controller('usuarios') // ← decorador: "esta clase maneja la ruta /usuarios"
class UsuarioController {
  @Get() // ← decorador: "este método responde a peticiones GET"
  obtenerTodos() {
    return 'lista de usuarios';
  }

  @Post() // ← decorador: "este método responde a peticiones POST"
  crear(@Body() datos) {
    // ← @Body() = "saca los datos del cuerpo de la petición"
    return datos;
  }
}
```

### 1.14 Modificadores de acceso (private, public, readonly)

> **En el proyecto:** Todos los services usan `private readonly`

```typescript
class MiServicio {
  // private = solo se puede usar DENTRO de esta clase
  // readonly = no se puede cambiar después de asignarlo
  constructor(private readonly drizzleService: DrizzleService) {}

  // Esto es un ATAJO de TypeScript. Es lo mismo que:
  // private readonly drizzleService: DrizzleService;
  // constructor(drizzle: DrizzleService) {
  //   this.drizzleService = drizzle;
  // }
}
```

### 1.15 Getters (propiedades computadas)

> **En el proyecto:** `private get db() { return this.drizzleService.getDb(); }`

```typescript
class ContratoService {
  // Un getter parece una propiedad pero ejecuta código
  private get db() {
    return this.drizzleService.getDb();
  }

  // Luego lo usas como si fuera una propiedad normal:
  // this.db.select()...
}
```

---

## NIVEL 2 - Node.js básico

> El backend corre sobre Node.js. No necesitas ser experto, pero necesitas entender estos conceptos.

### 2.1 ¿Qué es Node.js?

- Es JavaScript/TypeScript corriendo FUERA del navegador
- Permite crear servidores, leer archivos, conectarse a bases de datos, etc.
- Este proyecto usa Node.js como base, con NestJS encima

### 2.2 Módulos (import / export)

```typescript
// Exportar (archivo: mi-servicio.ts)
export class MiServicio {}
export const MI_CONSTANTE = 'valor';

// Importar (otro archivo)
import { MiServicio, MI_CONSTANTE } from './mi-servicio';

// Export default
export default class MiClase {}
import MiClase from './mi-clase';
```

### 2.3 Barrel exports (archivos index.ts)

> **En el proyecto:** `src/config/index.ts`, `src/common/index.ts`

```typescript
// src/config/index.ts
export { envs } from './env/envs';

// Ahora en vez de importar así:
import { envs } from './config/env/envs';
// Puedes importar así (más limpio):
import { envs } from './config';
```

### 2.4 File System (fs)

> **En el proyecto:** Se usa para guardar fotos y PDFs en disco

```typescript
import * as fs from 'fs';

// Crear carpeta
fs.mkdirSync('./uploads', { recursive: true });

// Guardar archivo
fs.writeFileSync('./uploads/foto.jpg', bufferDelArchivo);

// Verificar si existe
fs.existsSync('./uploads/foto.jpg'); // true o false

// Borrar archivo
fs.unlinkSync('./uploads/foto.jpg');
```

### 2.5 Variables de entorno (.env)

> **En el proyecto:** Todo está en el archivo `.env`

```bash
# .env (archivo en la raíz del proyecto)
DATABASE_URL=postgresql://user:pass@localhost:5432/midb
PORT=3002
JWT_SECRET=mi_secreto_super_seguro
```

```typescript
// En código se accede así:
process.env.DATABASE_URL; // "postgresql://user:pass@localhost:5432/midb"
process.env.PORT; // "3002" (siempre es string)
```

### 2.6 package.json y scripts

> **En el proyecto:** `pnpm run start:dev` ejecuta `nest start --watch`

```json
{
  "scripts": {
    "start:dev": "nest start --watch", // Prende el server en modo desarrollo
    "build": "nest build", // Compila el proyecto
    "start:prod": "node dist/main", // Prende en producción
    "seed": "ts-node src/drizzle/seeds/seed.ts" // Llena la BD con datos iniciales
  }
}
```

---

## NIVEL 3 - SQL y PostgreSQL

> Este proyecto usa PostgreSQL. Los datos se guardan en tablas. Drizzle ORM traduce TypeScript a SQL, pero NECESITAS entender SQL para saber qué está pasando.

### 3.1 Tablas (CREATE TABLE)

```sql
-- Una tabla es como una hoja de Excel
CREATE TABLE usuario (
  id INTEGER PRIMARY KEY,      -- columna de ID único
  nombre VARCHAR(50) NOT NULL, -- texto de máximo 50 caracteres, obligatorio
  email VARCHAR(100) UNIQUE,   -- texto único (no se puede repetir)
  activo BOOLEAN DEFAULT true  -- verdadero/falso, por defecto true
);
```

### 3.2 Tipos de datos en PostgreSQL

| Tipo            | Qué es                        | Ejemplo en el proyecto         |
| --------------- | ----------------------------- | ------------------------------ |
| `INTEGER`       | Número entero                 | `id`, `empleado_id`            |
| `VARCHAR(n)`    | Texto con máximo n caracteres | `nombre VARCHAR(50)`           |
| `TEXT`          | Texto sin límite              | `observaciones`, `archivo_pdf` |
| `BOOLEAN`       | true/false                    | `estado_registro`              |
| `TIMESTAMP`     | Fecha y hora                  | `created_at`, `updated_at`     |
| `DATE`          | Solo fecha                    | `fecha_inicio`, `fecha_fin`    |
| `DECIMAL(10,2)` | Número decimal                | `sueldo_bruto`, `remuneracion` |

### 3.3 Constraints (restricciones)

```sql
-- NOT NULL = obligatorio, no puede estar vacío
nombre VARCHAR(50) NOT NULL

-- UNIQUE = no se puede repetir
email VARCHAR(100) UNIQUE

-- DEFAULT = valor por defecto si no le mandas nada
activo BOOLEAN DEFAULT true

-- PRIMARY KEY = identificador único de cada fila
id INTEGER PRIMARY KEY

-- CHECK = validación personalizada
auditoria_progreso INTEGER CHECK (auditoria_progreso >= 1 AND auditoria_progreso <= 100)
```

### 3.4 SELECT (obtener datos)

```sql
-- Todos los usuarios
SELECT * FROM usuario;

-- Solo nombre y email
SELECT nombre, email FROM usuario;

-- Con filtro
SELECT * FROM usuario WHERE activo = true;

-- Con múltiples filtros
SELECT * FROM usuario WHERE activo = true AND rol_id = 1;

-- Ordenado
SELECT * FROM usuario ORDER BY nombre ASC;

-- Con límite y paginación
SELECT * FROM usuario LIMIT 10 OFFSET 0;  -- primeros 10
SELECT * FROM usuario LIMIT 10 OFFSET 10; -- siguientes 10
```

### 3.5 INSERT (crear datos)

```sql
INSERT INTO usuario (nombre, email, password)
VALUES ('Juan', 'juan@mail.com', '123456');
```

### 3.6 UPDATE (actualizar datos)

```sql
UPDATE usuario SET nombre = 'Pedro' WHERE id = 1;

-- Soft delete (lo que hace el proyecto, NO borra de verdad)
UPDATE usuario SET estado_registro = false WHERE id = 1;
```

### 3.7 DELETE (borrar datos)

```sql
-- El proyecto NO usa DELETE real, usa soft delete (ver UPDATE arriba)
DELETE FROM usuario WHERE id = 1;
```

### 3.8 Foreign Keys (claves foráneas)

> **CRÍTICO:** El proyecto tiene muchas relaciones entre tablas

```sql
-- El empleado PERTENECE a un usuario y a un área
CREATE TABLE empleado (
  id INTEGER PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuario(id),  -- FK → tabla usuario
  area_id INTEGER REFERENCES area(id),         -- FK → tabla area
  nombres VARCHAR(100)
);

-- Esto significa:
-- empleado.usuario_id DEBE ser un id que exista en la tabla usuario
-- empleado.area_id DEBE ser un id que exista en la tabla area
```

### 3.9 Relaciones entre tablas del proyecto

```
┌─────────┐     ┌──────────┐     ┌──────────────┐
│   rol   │────<│ usuario  │────<│   empleado   │
└─────────┘     └──────────┘     └──────────────┘
     │               │                  │
     │               │                  ├───< contrato
     │               │                  │
     │               │                  └───< licencia_medica
     │               │
     ├───< rol_acceso │───< convocatoria ───< postulacion
     │               │                    ├──< historial_convocatoria
┌─────────┐          │
│ acceso  │────< rol_acceso    ┌──────────┐
└─────────┘                    │ empresa  │───< usuario
                               └──────────┘

   ──< significa "tiene muchos"
   Ejemplo: un rol TIENE MUCHOS usuarios
            un empleado TIENE MUCHOS contratos
```

### 3.10 ENUMs en PostgreSQL

> **En el proyecto:** Hay 11 enums definidos

```sql
-- Un enum es un tipo de dato con valores fijos
CREATE TYPE estado_contrato AS ENUM ('ACTIVO', 'VENCIDO', 'RENOVADO', 'TERMINADO');

-- Se usa así:
CREATE TABLE contrato (
  estado estado_contrato DEFAULT 'ACTIVO'
);

-- Solo puedes poner valores del enum, nada más
```

### 3.11 ENUMs del proyecto (referencia completa)

| Enum                     | Valores                                                     | Se usa en              |
| ------------------------ | ----------------------------------------------------------- | ---------------------- |
| `modalidad_contrato`     | CONVENIO_PRACTICAS, PLAZO_FIJO, INDETERMINADO               | contrato               |
| `moneda`                 | PEN, USD                                                    | contrato               |
| `estado_contrato`        | ACTIVO, VENCIDO, RENOVADO, TERMINADO                        | contrato               |
| `tipoEmpleado`           | PROF, PRAT                                                  | convocatoria           |
| `modalidad`              | REMOTO, PRESENCIAL, SEMIPRESENCIAL                          | convocatoria           |
| `tipo_documento`         | dni, carnet_extranjeria                                     | empleado               |
| `tipo_personal`          | planilla, practicante                                       | empleado               |
| `estado_legajo`          | al_dia, pendiente, observado                                | empleado               |
| `tipo_licencia`          | descanso_medico, licencia_maternidad, licencia_paternidad   | licencia_medica        |
| `estado_licencia`        | pendiente, aprobado, rechazado                              | licencia_medica        |
| `estado_postulacion`     | PENDIENTE, REVISADO, PRESELECCIONADO, NO_APTO, APROBADO     | postulacion            |
| `estado_convocatoria`    | PENDIENTE, ENREVISION, PRESELECCIONADO, RECHAZADO, ACEPTADO | historial_convocatoria |
| `tipo_documento_usuario` | DNI, CE                                                     | usuario                |

### 3.12 JOINs (unir tablas)

```sql
-- Obtener empleados con el nombre de su área
SELECT empleado.nombres, area.nombre as area
FROM empleado
JOIN area ON empleado.area_id = area.id;

-- Esto "une" la tabla empleado con la tabla area
-- usando la columna area_id como enlace
```

### 3.13 COUNT y funciones de agregación

```sql
-- Contar cuántos usuarios hay
SELECT COUNT(*) FROM usuario;

-- Contar usuarios activos
SELECT COUNT(*) FROM usuario WHERE estado_registro = true;
```

---

## NIVEL 4 - NestJS (el framework del proyecto)

> NestJS es el framework que organiza todo el backend. Piensa en él como el "esqueleto" del proyecto. TODO pasa por NestJS.

### 4.1 ¿Qué es NestJS?

- Framework de Node.js para crear backends
- Usa TypeScript obligatoriamente
- Organiza el código en **módulos**, **controladores** y **servicios**
- Usa **decoradores** (@) para todo
- Es como Angular pero para backend

### 4.2 La estructura Module → Controller → Service

> **ESTO ES LO MÁS IMPORTANTE DE NESTJS.** Entiende esto y entiendes el 50% del proyecto.

```
PETICIÓN DEL FRONTEND
        │
        ▼
   CONTROLLER (recibe la petición)
        │
        ▼
    SERVICE (procesa la lógica del negocio)
        │
        ▼
   BASE DE DATOS (Drizzle ORM)
        │
        ▼
    SERVICE (recibe los datos)
        │
        ▼
   CONTROLLER (devuelve la respuesta al frontend)
```

**Analogía:** Imagina un restaurante:

- **Controller** = el mesero (recibe el pedido del cliente y le lleva la comida)
- **Service** = el chef (cocina la comida, hace todo el trabajo)
- **Module** = el restaurante en sí (junta al mesero con el chef)

### 4.3 Module (@Module)

> **En el proyecto:** Cada carpeta tiene su `.module.ts`

```typescript
// Un módulo AGRUPA todo lo relacionado a una funcionalidad
@Module({
  imports: [DrizzleModule], // Otros módulos que necesita
  controllers: [UsuarioController], // Controladores que tiene
  providers: [UsuarioService], // Servicios que tiene
  exports: [UsuarioService], // Lo que comparte con otros módulos
})
export class UsuarioModule {}
```

**Módulos del proyecto:**
| Módulo | Qué hace |
|---|---|
| `AppModule` | El módulo raíz, importa todos los demás |
| `DrizzleModule` | Conexión a base de datos (es `@Global`) |
| `AuthModule` | Login, logout, 2FA |
| `UsuarioModule` | CRUD de usuarios |
| `EmpleadoModule` | CRUD de empleados |
| `ContratoModule` | CRUD de contratos |
| `ConvocatoriaModule` | CRUD de convocatorias |
| `PostulacionModule` | CRUD de postulaciones |
| `LicenciaMedicaModule` | CRUD de licencias médicas |
| `AreaModule` | CRUD de áreas |
| `RolModule` | CRUD de roles |
| `AccesoModule` | CRUD de accesos/permisos |
| `EmpresaModule` | CRUD de empresa |
| `EmailModule` | Envío de correos |
| `ReniecModule` | Consulta DNI en RENIEC |
| `FotoModule` | Subida de fotos |
| `HistorialConvocatoriaModule` | Historial de convocatorias |

### 4.4 Controller (@Controller)

> **En el proyecto:** Cada carpeta tiene su `.controller.ts`

```typescript
@Controller('usuarios') // Todas las rutas empiezan con /usuarios
export class UsuarioController {
  // Inyección de dependencias (NestJS le pasa el servicio automáticamente)
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get() // GET /usuarios
  obtenerTodos() {
    return this.usuarioService.findAll();
  }

  @Get(':id') // GET /usuarios/5
  obtenerUno(@Param('id') id: string) {
    return this.usuarioService.findOne(+id); // +id convierte string a number
  }

  @Post() // POST /usuarios
  crear(@Body() datos: CreateUsuarioDto) {
    return this.usuarioService.create(datos);
  }

  @Patch(':id') // PATCH /usuarios/5
  actualizar(@Param('id') id: string, @Body() datos: UpdateUsuarioDto) {
    return this.usuarioService.update(+id, datos);
  }
}
```

### 4.5 Service (@Injectable)

> **En el proyecto:** Cada carpeta tiene su `.service.ts`

```typescript
@Injectable() // Le dice a NestJS: "este servicio se puede inyectar en otros lados"
export class UsuarioService {
  constructor(private readonly drizzleService: DrizzleService) {}

  // Getter para acceder a la base de datos fácilmente
  private get db() {
    return this.drizzleService.getDb();
  }

  // Obtener todos los usuarios
  async findAll() {
    return await this.db.select().from(usuario);
  }

  // Crear un usuario
  async create(datos: CreateUsuarioDto) {
    const [nuevoUsuario] = await this.db
      .insert(usuario)
      .values(datos)
      .returning();
    return nuevoUsuario;
  }
}
```

### 4.6 Decoradores de parámetros

> Son las formas de SACAR datos de la petición HTTP

```typescript
@Post()
crearUsuario(
  @Body() datos,           // El cuerpo de la petición (lo que manda el frontend como JSON)
  @Param('id') id,         // Un parámetro de la URL: /usuarios/:id
  @Query('page') page,     // Un query parameter: /usuarios?page=2
  @Req() request,          // El objeto request completo (toda la petición)
  @Res() response,         // El objeto response (para enviar respuesta manual)
  @UploadedFile() archivo, // Un archivo subido (foto, PDF)
) {}
```

### 4.7 DTOs (Data Transfer Objects)

> **En el proyecto:** Cada módulo tiene su carpeta `dto/` con archivos como `create-*.dto.ts` y `update-*.dto.ts`

```typescript
// ¿Qué es un DTO?
// Es una clase que define QUÉ DATOS se esperan recibir y LOS VALIDA

import { IsString, IsNotEmpty, IsEmail, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUsuarioDto {
  @ApiProperty({ description: 'Nombre del usuario' }) // Para la documentación Swagger
  @IsString({ message: 'El nombre debe ser texto' }) // Validación: debe ser string
  @IsNotEmpty({ message: 'El nombre es obligatorio' }) // Validación: no puede estar vacío
  @Length(2, 50) // Validación: entre 2 y 50 caracteres
  nombre: string;

  @ApiProperty()
  @IsEmail({}, { message: 'Email no válido' }) // Validación: formato email
  email: string;
}

// Si el frontend manda datos que no cumplen → NestJS devuelve error 400 automáticamente
// Si manda campos extra que no están en el DTO → NestJS los ignora (por whitelist: true)
```

### 4.8 Decoradores de validación más usados en el proyecto

| Decorador           | Qué valida                | Ejemplo                  |
| ------------------- | ------------------------- | ------------------------ |
| `@IsString()`       | Que sea texto             | nombre, email            |
| `@IsNotEmpty()`     | Que no esté vacío         | casi todos los campos    |
| `@IsEmail()`        | Formato de email          | email                    |
| `@IsNumber()`       | Que sea número            | empleado_id              |
| `@IsOptional()`     | Puede no venir            | campos opcionales        |
| `@IsEnum(MiEnum)`   | Que sea un valor del enum | estado, modalidad        |
| `@IsBoolean()`      | Que sea true/false        | estado_registro          |
| `@Length(min, max)` | Largo del texto           | nombre (2-50)            |
| `@MaxLength(n)`     | Largo máximo              | descripcion (150)        |
| `@Matches(regex)`   | Que coincida con patrón   | recovery code (hex)      |
| `@Transform()`      | Transforma el valor       | trim, toLowerCase        |
| `@ApiProperty()`    | Documentación Swagger     | todos los campos del DTO |

### 4.9 ValidationPipe (validación global)

> **En el proyecto:** Configurado en `src/main.ts`

```typescript
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,    // Elimina campos que NO están en el DTO
  transform: true,    // Transforma tipos automáticamente (string "5" → number 5)
  exceptionFactory: (errors) => { ... }  // Personaliza el formato de errores
}));
```

Esto significa que TODAS las peticiones se validan automáticamente con los DTOs.

### 4.10 Guards (guardianes)

> **En el proyecto:** `src/auth/guards/auth.guard.ts`

```typescript
// Un Guard decide si una petición PUEDE o NO PUEDE pasar
// Es como el guardia de seguridad de una discoteca

@Injectable()
export class AuthGuard implements CanActivate {
  // canActivate devuelve true (pasa) o false (rechazado)
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // 1. Sacar el token JWT de las cookies
    const token = request.cookies['token'];
    if (!token) return false;  // No hay token → rechazado

    // 2. Verificar que el token sea válido
    const payload = this.jwtService.verify(token);

    // 3. Verificar permisos de acceso (RBAC)
    // ... lógica de permisos ...

    return true;  // Todo ok → puede pasar
  }
}

// Se usa así en los controllers:
@UseGuards(AuthGuard)  // ← Protege este endpoint
@Get('me')
obtenerMiPerfil(@Req() req) {
  return req.user;
}
```

### 4.11 Decoradores personalizados

> **En el proyecto:** `src/auth/decorators/acceso.decorator.ts`

```typescript
// Crea un decorador personalizado para marcar qué accesos necesita un endpoint
export const AccesoRequerido = (...accesos: string[]) =>
  SetMetadata('accesos', accesos);

// Se usa así:
@UseGuards(AuthGuard)
@AccesoRequerido('empleado', 'contrato')  // Solo usuarios con estos accesos pueden entrar
@Get()
listarEmpleados() { ... }
```

### 4.12 Inyección de dependencias (DI)

> **Concepto clave:** NestJS crea los objetos por ti y los "inyecta" donde los necesitas

```typescript
// NO haces esto (manual):
const drizzle = new DrizzleService();
const usuario = new UsuarioService(drizzle);

// NestJS lo hace SOLO. Tú solo dices qué necesitas en el constructor:
@Injectable()
export class UsuarioService {
  constructor(
    private readonly drizzleService: DrizzleService, // NestJS te lo da
    private readonly emailService: EmailService, // NestJS te lo da
  ) {}
}
```

### 4.13 @Global() modules

> **En el proyecto:** `DrizzleModule` es global

```typescript
@Global() // ← Disponible en TODOS los módulos sin importarlo
@Module({
  providers: [DrizzleService],
  exports: [DrizzleService],
})
export class DrizzleModule {}

// Gracias a @Global(), cualquier módulo puede usar DrizzleService
// sin necesidad de poner DrizzleModule en sus imports
```

### 4.14 forwardRef (dependencias circulares)

> **En el proyecto:** `UsuarioModule` ↔ `FotoModule`

```typescript
// Problema: UsuarioModule necesita FotoModule Y FotoModule necesita UsuarioModule
// Solución: forwardRef

@Module({
  imports: [forwardRef(() => FotoModule)], // "Importa FotoModule, pero más tarde"
})
export class UsuarioModule {}
```

### 4.15 Swagger / OpenAPI

> **En el proyecto:** Configurado en `main.ts`, documentado en todos los controllers

```typescript
// En main.ts - Configura Swagger
const config = new DocumentBuilder()
  .setTitle('EMPRESOFT PERU SAC')
  .setDescription('APIs para EMPRESOFT PERU SAC')
  .setVersion('1.0')
  .build();
SwaggerModule.setup('docs', app, documentFactory);

// Ahora puedes ver la documentación en: http://localhost:3002/docs

// En los controllers se documenta así:
@ApiTags('Usuarios')                              // Agrupa endpoints
@ApiOperation({ summary: 'Crear usuario' })       // Describe qué hace
@ApiResponse({ status: 201, description: 'OK' })  // Documenta respuestas
@ApiBody({ type: CreateUsuarioDto })               // Documenta el body esperado
```

### 4.16 CORS (Cross-Origin Resource Sharing)

> **En el proyecto:** Configurado en `main.ts`

```typescript
app.enableCors({
  origin: [envs.baseFrontendUrl], // Solo permite peticiones desde esta URL
  credentials: true, // Permite enviar cookies
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

// ¿Por qué? El frontend (React/Angular) corre en otro puerto/dominio
// Sin CORS, el navegador bloquea las peticiones por seguridad
```

### 4.17 Global Prefix

> **En el proyecto:** `app.setGlobalPrefix('sistema/api/v1')`

```
Todas las rutas empiezan con /sistema/api/v1
Ejemplo:
  @Controller('usuarios') → GET /sistema/api/v1/usuarios
  @Controller('auth')     → POST /sistema/api/v1/auth/login
```

### 4.18 File Upload con Multer

> **En el proyecto:** Para subir fotos de perfil

```typescript
@Post('subir-foto/:id')
@UseInterceptors(FileInterceptor('foto', {
  limits: { fileSize: 5 * 1024 * 1024 },  // Máximo 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      cb(new BadRequestException('Solo imágenes'), false);
    }
    cb(null, true);
  }
}))
async subirFoto(
  @Param('id') id: string,
  @UploadedFile() archivo: Express.Multer.File
) {
  return this.fotoService.guardar(+id, archivo);
}
```

### 4.19 HttpException (manejo de errores)

> **En el proyecto:** Se usa en todos los services

```typescript
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

// Cuando algo sale mal, lanzas una excepción:
throw new NotFoundException('Usuario no encontrado'); // 404
throw new BadRequestException('Datos inválidos'); // 400
throw new UnauthorizedException('No tienes permisos'); // 401

// NestJS automáticamente devuelve la respuesta con el código de estado correcto
```

---

## NIVEL 5 - Drizzle ORM (cómo se habla con la base de datos)

> Drizzle es el ORM del proyecto. Un ORM traduce código TypeScript a consultas SQL. En vez de escribir SQL a mano, escribes TypeScript.

### 5.1 ¿Qué es un ORM?

```
SIN ORM (SQL puro):
  "SELECT * FROM usuario WHERE id = 1"

CON ORM (Drizzle):
  db.select().from(usuario).where(eq(usuario.id, 1))

Ambos hacen lo mismo, pero Drizzle te da:
  ✓ Autocompletado en VS Code
  ✓ Errores si te equivocas en un nombre de columna
  ✓ No escribes SQL a mano
```

### 5.2 Definir una tabla (Schema)

> **En el proyecto:** `src/drizzle/schema/`

```typescript
import {
  pgTable,
  integer,
  varchar,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core';

// Esto es equivalente a CREATE TABLE en SQL
export const usuario = pgTable('usuario', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  nombre: varchar('nombre', { length: 50 }).notNull(),
  email: varchar('email', { length: 100 }).unique().notNull(),
  activo: boolean('estado_registro').default(true),
  created_at: timestamp('created_at').defaultNow(),
});
```

### 5.3 Definir un ENUM

> **En el proyecto:** Hay 11 enums

```typescript
import { pgEnum } from 'drizzle-orm/pg-core';

export const estadoContratoEnum = pgEnum('estado_contrato', [
  'ACTIVO',
  'VENCIDO',
  'RENOVADO',
  'TERMINADO',
]);

// Se usa en la tabla así:
export const contrato = pgTable('contrato', {
  estado: estadoContratoEnum('estado').default('ACTIVO'),
});
```

### 5.4 Foreign Keys (claves foráneas)

```typescript
export const empleado = pgTable('empleado', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  usuario_id: integer('usuario_id')
    .references(() => usuario.id)
    .notNull(),
  area_id: integer('area_id')
    .references(() => area.id)
    .notNull(),
});

// .references(() => usuario.id) = "este campo apunta a la tabla usuario"
```

### 5.5 SELECT (obtener datos)

```typescript
// Todos los usuarios
const usuarios = await this.db.select().from(usuario);

// Un usuario por ID
const [unUsuario] = await this.db
  .select()
  .from(usuario)
  .where(eq(usuario.id, 1));

// Con múltiples filtros
const resultados = await this.db
  .select()
  .from(usuario)
  .where(and(eq(usuario.activo, true), eq(usuario.rol_id, 2)));

// Solo algunas columnas
const nombres = await this.db
  .select({
    nombre: usuario.nombre,
    email: usuario.email,
  })
  .from(usuario);

// Con paginación
const pagina = await this.db.select().from(usuario).limit(10).offset(0);
```

### 5.6 INSERT (crear datos)

```typescript
// Crear un registro y devolver lo creado
const [nuevoUsuario] = await this.db
  .insert(usuario)
  .values({
    nombre: 'Juan',
    email: 'juan@mail.com',
    password: hashDelPassword,
  })
  .returning(); // ← Devuelve el registro creado (con el id generado)
```

### 5.7 UPDATE (actualizar datos)

```typescript
// Actualizar un registro
const [actualizado] = await this.db
  .update(usuario)
  .set({ nombre: 'Pedro' })
  .where(eq(usuario.id, 1))
  .returning();

// Soft delete (marcar como inactivo)
await this.db
  .update(usuario)
  .set({ estado_registro: false })
  .where(eq(usuario.id, 1));
```

### 5.8 DELETE (borrar datos)

```typescript
// El proyecto casi NO usa delete real, usa soft delete
// Pero si fuera necesario:
await this.db.delete(usuario).where(eq(usuario.id, 1));
```

### 5.9 Operadores de filtro

```typescript
import { eq, ne, and, or, gte, lte, count } from 'drizzle-orm';

eq(campo, valor); // = igual
ne(campo, valor); // != distinto
and(cond1, cond2); // AND (ambas deben cumplirse)
or(cond1, cond2); // OR (al menos una debe cumplirse)
gte(campo, valor); // >= mayor o igual
lte(campo, valor); // <= menor o igual
```

### 5.10 COUNT (contar registros)

```typescript
const [resultado] = await this.db
  .select({ total: count() })
  .from(usuario)
  .where(eq(usuario.estado_registro, true));

console.log(resultado.total); // 42
```

### 5.11 getTableColumns (obtener columnas)

> **En el proyecto:** Se usa para excluir columnas sensibles

```typescript
import { getTableColumns } from 'drizzle-orm';

// Obtener todas las columnas MENOS el password
const { password, ...columnasSeguras } = getTableColumns(usuario);

const usuarios = await this.db.select(columnasSeguras).from(usuario);
```

### 5.12 Migraciones (drizzle-kit)

```bash
# Generar migración (detecta cambios en los schemas)
pnpm drizzle-kit generate

# Aplicar migraciones a la base de datos
pnpm drizzle-kit migrate

# Ver la base de datos en un editor visual
pnpm drizzle-kit studio
```

### 5.13 Configuración de Drizzle

> **En el proyecto:** `drizzle.config.ts`

```typescript
export default defineConfig({
  schema: './src/drizzle/schema/**/*.ts', // Dónde están los schemas
  out: './drizzle/migrations', // Dónde se guardan las migraciones
  dialect: 'postgresql', // Qué base de datos usas
  dbCredentials: {
    url: process.env.DATABASE_URL!, // La URL de conexión
  },
});
```

### 5.14 DrizzleService (conexión a la BD)

> **En el proyecto:** `src/drizzle/drizzle.service.ts`

```typescript
@Global()
@Injectable()
export class DrizzleService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;
  private db: NodePgDatabase;

  constructor() {
    this.pool = new Pool({ connectionString: envs.databaseUrl });
    this.db = drizzle(this.pool, { schema });
  }

  getDb() {
    return this.db;
  }

  // Se conecta cuando el módulo inicia
  async onModuleInit() {
    /* ... */
  }

  // Se desconecta cuando el módulo se destruye
  async onModuleDestroy() {
    await this.pool.end();
  }
}
```

---

## NIVEL 6 - Autenticación y Seguridad

> El proyecto usa un sistema de autenticación completo con JWT, 2FA y RBAC.

### 6.1 ¿Qué es JWT (JSON Web Token)?

```
1. Usuario manda email + password al backend
2. Backend verifica que sean correctos
3. Backend genera un TOKEN (un texto largo cifrado)
4. Lo guarda en una COOKIE del navegador
5. En cada petición siguiente, el navegador manda la cookie automáticamente
6. El backend lee la cookie, verifica el token, y sabe quién es el usuario

El token contiene: { id: 1, email: "juan@mail.com", rol_id: 2 }
Pero está CIFRADO, nadie puede leerlo sin el JWT_SECRET
```

### 6.2 Flujo de login en el proyecto

```
1. POST /auth/login → { email, password }
2. Backend busca el usuario por email
3. Compara el password con bcrypt
4. Si tiene 2FA activado:
   a. Genera un tempToken (token temporal)
   b. Devuelve { requiere2FA: true, tempToken }
   c. Frontend muestra input para código 2FA
   d. POST /auth/verify-2fa → { tempToken, code }
   e. Backend verifica el código TOTP
5. Genera JWT con los datos del usuario
6. Guarda el JWT en una cookie httpOnly
7. Devuelve los datos del usuario
```

### 6.3 bcryptjs (hasheo de contraseñas)

```typescript
import { hash, compare } from 'bcryptjs';

// GUARDAR contraseña (al crear usuario)
const passwordHasheado = await hash('Prueb@123', 10);
// passwordHasheado = "$2a$10$xK4j..." (irreversible)

// VERIFICAR contraseña (al hacer login)
const esCorrecta = await compare('Prueb@123', passwordHasheado);
// esCorrecta = true o false
```

### 6.4 Cookies httpOnly

> **En el proyecto:** El JWT se guarda en cookies, NO en localStorage

```typescript
// Guardar token en cookie
response.cookie('token', jwtToken, {
  httpOnly: true, // JavaScript del frontend NO puede leerla (seguridad)
  secure: true, // Solo se envía por HTTPS
  sameSite: 'strict', // Solo se envía al mismo dominio
  maxAge: 86400000, // Expira en 24 horas
});

// Leer token de cookie (en el Guard)
const token = request.cookies['token'];
```

### 6.5 2FA (Autenticación de dos factores)

```
1. Usuario activa 2FA → POST /auth/enable-2fa
2. Backend genera un secreto con speakeasy
3. Genera un QR code con qrcode
4. Usuario escanea el QR con Google Authenticator
5. El app genera códigos de 6 dígitos que cambian cada 30 segundos
6. Al hacer login, además del password, necesita el código del app
```

### 6.6 RBAC (Control de acceso basado en roles)

```
El proyecto tiene:
- ROLES (ej: Gerente, Empleado, Admin)
- ACCESOS (ej: empleado, contrato, convocatoria)
- ROL_ACCESO (tabla que une roles con accesos)

Flujo:
1. El controller tiene @AccesoRequerido('empleado')
2. El AuthGuard lee esa metadata
3. Busca en la BD qué accesos tiene el rol del usuario
4. Si el rol tiene el acceso 'empleado' → puede pasar
5. Si no → error 403 Forbidden
```

---

## NIVEL 7 - Funcionalidades específicas del proyecto

### 7.1 Servicio de Email (Brevo/Sendinblue)

> **En el proyecto:** `src/email/email.service.ts`

- Usa la API de Brevo para enviar correos transaccionales
- Envía: verificación de email, recuperación de contraseña
- Los templates HTML están inline en el código

### 7.2 Servicio RENIEC

> **En el proyecto:** `src/reniec/reniec.service.ts`

- Consulta la API externa de RENIEC para validar DNIs peruanos
- Usa `@nestjs/axios` (HttpService) para hacer peticiones HTTP
- `firstValueFrom()` convierte el Observable de axios a una Promesa

### 7.3 Servicio de Fotos

> **En el proyecto:** `src/foto/foto.service.ts`

- Guarda imágenes de perfil en la carpeta `uploads/`
- Nombra los archivos con timestamp (moment-timezone, zona Lima)
- Usa Node.js `fs` para escribir/leer/borrar archivos

### 7.4 Servicio de PDF

> **En el proyecto:** `src/common/pdf.service.ts`

- Genera documentos PDF para contratos
- Guarda los PDFs en el sistema de archivos

### 7.5 Seed (datos iniciales)

> **En el proyecto:** `src/drizzle/seeds/seed.ts`

- Se ejecuta con `pnpm run seed`
- Crea datos iniciales: roles, empresa, área, accesos, usuarios de prueba, empleado
- Password de prueba: `Prueb@123`

### 7.6 Soft Delete (borrado lógico)

```
En TODO el proyecto, cuando "borras" algo, NO se elimina de la base de datos.
Se cambia estado_registro de true a false.

¿Por qué? Para no perder datos. Un empleado "borrado" sigue en la BD por si se necesita restaurar.

Ejemplo en código:
  // "Borrar" (en realidad desactivar)
  await this.db.update(usuario).set({ estado_registro: false }).where(eq(usuario.id, 1));

  // "Restaurar"
  await this.db.update(usuario).set({ estado_registro: true }).where(eq(usuario.id, 1));
```

### 7.7 Paginación

```typescript
// El proyecto pagina resultados así:
async findAll(page: number = 1, limit: number = 10) {
  const offset = (page - 1) * limit;

  const datos = await this.db.select().from(usuario).limit(limit).offset(offset);
  const [{ total }] = await this.db.select({ total: count() }).from(usuario);

  return {
    data: datos,
    total: total,
    page: page,
    limit: limit,
    totalPages: Math.ceil(total / limit)
  };
}
```

---

## NIVEL 8 - Herramientas del día a día

### 8.1 Git (control de versiones)

```bash
# Los comandos que vas a usar el 90% del tiempo:
git status                 # Ver qué archivos cambiaste
git add .                  # Preparar todos los cambios para commit
git commit -m "mensaje"    # Guardar los cambios con un mensaje
git push origin mi-rama    # Subir cambios al repositorio remoto
git pull origin main       # Jalar cambios de main
git checkout mi-rama       # Cambiarte a otra rama
git checkout -b nueva-rama # Crear una rama nueva y cambiarte a ella
git stash                  # Guardar cambios temporalmente
git stash pop              # Recuperar cambios guardados
git merge main             # Traer cambios de main a tu rama actual
git log --oneline -10      # Ver últimos 10 commits
```

### 8.2 pnpm (manejador de paquetes)

```bash
pnpm install               # Instalar todas las dependencias del proyecto
pnpm add nombre-paquete    # Agregar un paquete nuevo
pnpm add -D nombre-paquete # Agregar paquete de desarrollo
pnpm remove nombre-paquete # Quitar un paquete
pnpm run start:dev         # Ejecutar el backend en modo desarrollo
pnpm run build             # Compilar el proyecto
pnpm run seed              # Llenar la BD con datos iniciales
```

### 8.3 Postman / Thunder Client

- Herramienta para probar las APIs sin necesitar el frontend
- Puedes hacer peticiones GET, POST, PUT, DELETE
- Ver las respuestas del backend

### 8.4 Swagger (documentación automática)

- Con el backend prendido, ve a: `http://localhost:3002/docs`
- Ahí puedes ver TODOS los endpoints del proyecto
- Puedes probarlos directo desde el navegador

### 8.5 Cloudflare Tunnel

```bash
# Para compartir tu backend local con otros:
cloudflared tunnel --url http://localhost:3002
# Te genera un enlace público tipo: https://xxxxx.trycloudflare.com
```

---

## MAPA DEL PROYECTO - Qué hace cada archivo

### Raíz del proyecto

| Archivo             | Qué hace                                                     |
| ------------------- | ------------------------------------------------------------ |
| `package.json`      | Lista de dependencias y scripts                              |
| `tsconfig.json`     | Configuración de TypeScript                                  |
| `drizzle.config.ts` | Configuración de Drizzle (conexión BD, schemas, migraciones) |
| `nest-cli.json`     | Configuración del CLI de NestJS                              |
| `.env`              | Variables de entorno (secretos, URLs, etc.)                  |
| `pnpm-lock.yaml`    | Versiones exactas de los paquetes instalados                 |

### src/ (código fuente)

| Archivo         | Qué hace                                                           |
| --------------- | ------------------------------------------------------------------ |
| `main.ts`       | Punto de entrada. Configura el servidor, CORS, Swagger, Validation |
| `app.module.ts` | Módulo raíz. Importa TODOS los demás módulos                       |

### src/config/

| Archivo       | Qué hace                                                             |
| ------------- | -------------------------------------------------------------------- |
| `env/envs.ts` | Lee las variables de .env, las valida con Joi, y las exporta tipadas |
| `index.ts`    | Re-exporta envs para import más limpio                               |

### src/drizzle/ (base de datos)

| Archivo              | Qué hace                                    |
| -------------------- | ------------------------------------------- |
| `drizzle.module.ts`  | Módulo global de base de datos              |
| `drizzle.service.ts` | Crea la conexión a PostgreSQL y la comparte |
| `schema/*.ts`        | Define las tablas (12 tablas)               |
| `seeds/seed.ts`      | Crea datos iniciales de prueba              |

### src/auth/ (autenticación)

| Archivo                          | Qué hace                                                   |
| -------------------------------- | ---------------------------------------------------------- |
| `auth.controller.ts`             | Endpoints: login, logout, me, 2FA                          |
| `auth.service.ts`                | Lógica: verificar password, generar JWT, 2FA con speakeasy |
| `auth.module.ts`                 | Conecta controller + service + JWT                         |
| `guards/auth.guard.ts`           | Protege endpoints: verifica JWT + permisos RBAC            |
| `decorators/acceso.decorator.ts` | Decorador custom @AccesoRequerido()                        |
| `constants/jwt.constant.ts`      | Constante del nombre de la cookie                          |
| `dto/*.ts`                       | Validación de datos de login, 2FA, etc.                    |

### src/usuario/ (usuarios)

| Archivo                 | Qué hace                                                |
| ----------------------- | ------------------------------------------------------- |
| `usuario.controller.ts` | CRUD de usuarios + subida de foto                       |
| `usuario.service.ts`    | Lógica: crear, buscar, actualizar, soft-delete usuarios |
| `usuario.module.ts`     | Conecta todo                                            |
| `dto/*.ts`              | Validación de datos de usuario                          |

### src/empleado/ (empleados)

| Archivo                  | Qué hace            |
| ------------------------ | ------------------- |
| `empleado.controller.ts` | CRUD de empleados   |
| `empleado.service.ts`    | Lógica de empleados |
| `dto/*.ts`               | Validación          |

### src/contrato/ (contratos)

| Archivo                  | Qué hace                              |
| ------------------------ | ------------------------------------- |
| `contrato.controller.ts` | CRUD de contratos + generación de PDF |
| `contrato.service.ts`    | Lógica de contratos                   |
| `dto/*.ts`               | Validación                            |

### src/convocatoria/ (convocatorias de trabajo)

| Archivo                      | Qué hace                |
| ---------------------------- | ----------------------- |
| `convocatoria.controller.ts` | CRUD de convocatorias   |
| `convocatoria.service.ts`    | Lógica de convocatorias |
| `dto/*.ts`                   | Validación              |

### src/postulacion/ (postulaciones a convocatorias)

| Archivo                     | Qué hace                |
| --------------------------- | ----------------------- |
| `postulacion.controller.ts` | CRUD de postulaciones   |
| `postulacion.service.ts`    | Lógica de postulaciones |
| `dto/*.ts`                  | Validación              |

### src/licencia_medica/ (licencias médicas)

| Archivo                         | Qué hace                  |
| ------------------------------- | ------------------------- |
| `licencia_medica.controller.ts` | CRUD de licencias médicas |
| `licencia_medica.service.ts`    | Lógica de licencias       |
| `dto/*.ts`                      | Validación                |

### src/area/ (áreas de la empresa)

| Archivo              | Qué hace        |
| -------------------- | --------------- |
| `area.controller.ts` | CRUD de áreas   |
| `area.service.ts`    | Lógica de áreas |

### src/rol/ (roles de usuario)

| Archivo             | Qué hace        |
| ------------------- | --------------- |
| `rol.controller.ts` | CRUD de roles   |
| `rol.service.ts`    | Lógica de roles |

### src/acceso/ (permisos)

| Archivo                | Qué hace                 |
| ---------------------- | ------------------------ |
| `acceso.controller.ts` | CRUD de accesos/permisos |
| `acceso.service.ts`    | Lógica de accesos        |

### src/empresa/ (datos de la empresa)

| Archivo                 | Qué hace          |
| ----------------------- | ----------------- |
| `empresa.controller.ts` | CRUD de empresa   |
| `empresa.service.ts`    | Lógica de empresa |

### src/email/ (correos)

| Archivo            | Qué hace                                         |
| ------------------ | ------------------------------------------------ |
| `email.service.ts` | Envía correos con Brevo (verificación, recovery) |

### src/reniec/ (consulta DNI)

| Archivo             | Qué hace                                    |
| ------------------- | ------------------------------------------- |
| `reniec.service.ts` | Consulta la API de RENIEC para validar DNIs |

### src/foto/ (fotos de perfil)

| Archivo           | Qué hace                              |
| ----------------- | ------------------------------------- |
| `foto.service.ts` | Guarda/borra fotos de perfil en disco |

### src/common/ (compartido)

| Archivo          | Qué hace                      |
| ---------------- | ----------------------------- |
| `pdf.service.ts` | Genera PDFs (contratos)       |
| `dto/`           | DTOs compartidos (paginación) |
| `index.ts`       | Re-exporta lo compartido      |

### drizzle/migrations/ (migraciones de BD)

| Archivo                    | Qué hace                                            |
| -------------------------- | --------------------------------------------------- |
| `0000_silent_runaways.sql` | SQL de la primera migración (crea todas las tablas) |
| `meta/_journal.json`       | Registro de qué migraciones se han aplicado         |

---

## RECURSOS RECOMENDADOS (gratis)

| Tema        | Recurso                           | Link                                          |
| ----------- | --------------------------------- | --------------------------------------------- |
| TypeScript  | TypeScript Handbook (oficial)     | https://www.typescriptlang.org/docs/handbook/ |
| SQL         | SQLBolt (interactivo)             | https://sqlbolt.com                           |
| NestJS      | Documentación oficial             | https://docs.nestjs.com                       |
| NestJS      | Curso NestJS - YouTube            | Buscar "NestJS crash course"                  |
| Drizzle ORM | Documentación oficial             | https://orm.drizzle.team                      |
| Git         | Learn Git Branching (interactivo) | https://learngitbranching.js.org              |
| JWT         | jwt.io (para entender tokens)     | https://jwt.io                                |

---

> **Nota final:** No intentes aprender todo de golpe. Ve nivel por nivel. Cuando entiendas el Nivel 4 (NestJS), ya vas a poder leer el 80% del código del proyecto sin perderte. El resto va a ir cayendo solo con la práctica.
