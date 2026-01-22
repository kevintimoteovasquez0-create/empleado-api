import { pgTable, integer, varchar, pgEnum, timestamp } from "drizzle-orm/pg-core";
import { ConvocatoriaTable } from "./convocatoria";
import { TipoDocumentoUsuario } from "./usuario";

export const EstadoConvocatoria = pgEnum('estado_convocatoria', [
    'PENDIENTE',
    'ENREVISION',
    'PRESELECCIONADO',
    'RECHAZADO',
    'ACEPTADO'
])

export const HistorialConvocatoria = pgTable('historial_convocatoria', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    convocatoria_id: integer('convocatoria_id').references(() => ConvocatoriaTable.id).notNull(),
    tipo_documento: TipoDocumentoUsuario('tipo_documento').notNull(),
    numero_documento: varchar('numero_documento', { length: 20 }).notNull().unique(),
    telefono: varchar('telefono', { length: 9 }).notNull(),
    nombre: varchar('nombre', { length: 50 }).notNull(),
    apellido: varchar('apellido', { length: 50 }).notNull(),
    email: varchar('email', { length: 50 }).notNull(),
    link_cv: varchar('link_cv', {length: 100}).notNull(),
    estado_convocatoria: EstadoConvocatoria('estado_convocatoria').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull()
})