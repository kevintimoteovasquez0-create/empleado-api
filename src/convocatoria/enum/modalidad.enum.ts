import { ModalidadEmpleado } from "src/drizzle/schema/convocatoria";

export const ModalidadEmpleadoList = ModalidadEmpleado.enumValues;
export type ModalidadEmpleadoType = (typeof ModalidadEmpleado.enumValues)[number];