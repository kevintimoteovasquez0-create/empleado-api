import { TipoEmpleado } from "src/drizzle/schema/convocatoria";

export const TipoEmpleadoList = TipoEmpleado.enumValues;
export type TipoEmpleadoType = (typeof TipoEmpleado.enumValues)[number];