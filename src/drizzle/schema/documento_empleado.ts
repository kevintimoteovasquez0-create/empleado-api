import { pgTable, integer, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const tipoArchivoEnum = pgEnum('tipo_archivo', ['pdf', 'img']);
export const estadoDocumentoEnum = pgEnum('estado_documento', [
  'pendiente',
  'completo',
  'observado',
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
