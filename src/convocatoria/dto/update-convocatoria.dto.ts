import { PartialType } from "@nestjs/mapped-types";
import { CreateConvocatoriaDto } from "./create-convocatoria.dto";

export class UpdateConvocatoriaDto extends PartialType(CreateConvocatoriaDto){}