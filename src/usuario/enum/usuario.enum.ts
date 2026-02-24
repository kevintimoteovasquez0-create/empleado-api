import { TipoDocumentoUsuarioEnum } from "src/drizzle/schema/usuario"

export const TipoDocumentoUsuarioList = TipoDocumentoUsuarioEnum.enumValues;
export type TipoDocumentoUsuarioType = (typeof TipoDocumentoUsuarioEnum.enumValues)[number];