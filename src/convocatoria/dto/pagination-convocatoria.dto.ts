import { PartialType } from "@nestjs/swagger";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { PaginationDto } from "src/common";
import { TipoEmpleadoList } from "../enum/convocatoria.enum";
import type { TipoEmpleadoType } from "../enum/convocatoria.enum";

export class PaginationConvocatoriaDto extends PartialType(PaginationDto){

    @ApiPropertyOptional({
        description: 'Filtrar convocatorias por tipo de empleado',
        enum: TipoEmpleadoList,
        example: TipoEmpleadoList[0],
        enumName: 'TipoEmpleado'
    })
    @IsOptional()
    @IsString()
    @IsEnum(TipoEmpleadoList, {
        message: `Solamente estan permitidos los siguientes tipos de documento ${TipoEmpleadoList}`
    })
    tipo_empleado?: TipoEmpleadoType;

}