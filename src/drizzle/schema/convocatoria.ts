import { decimal, pgEnum, boolean, integer, timestamp, pgTable, text } from "drizzle-orm/pg-core";
import { AreaTrabajoTable } from "./areaTrabajo";
import { UsuarioTable } from "./usuario";
import { varchar } from "drizzle-orm/pg-core";

export const TipoEmpleado = pgEnum('tipoEmpleado', [
    'PROF',
    'PRAT'
]);

export const ModalidadEmpleado = pgEnum('modalidad', [
    'REMOTO',
    'PRESENCIAL',
    'SEMIPRESENCIAL'
])

export const ConvocatoriaTable = pgTable("convocatoria", {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    cargo: varchar('cargo', {length: 50}),
    usuario_id: integer('usuario_id').references(() => UsuarioTable.id).notNull(),
    area_id: integer('area_id').references(() => AreaTrabajoTable.id).notNull(),
    tipo_empleado: TipoEmpleado('tipo_empleado').notNull(),
    modalidad: ModalidadEmpleado('modalidad').notNull(),
    descripcion: text('descripcion').notNull(),
    remuneracion: decimal('remuneracion', { precision: 10, scale: 2 }),
    es_a_convenir: boolean('es_a_convenir').default(false).notNull(),
    responsable_id: integer('responsable_id').references(() => UsuarioTable.id).notNull(),
    fecha_finalizacion: timestamp('fecha_finalizacion').notNull(),
    estado_registro: boolean('estado_registro').default(true).notNull(),
    created_at: timestamp('createdAt').defaultNow().notNull(),
    updated_at: timestamp('updatedAt').defaultNow().$onUpdate(() => new Date()).notNull()
})