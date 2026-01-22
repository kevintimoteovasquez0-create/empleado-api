import { IsBoolean, IsDate, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min, MinDate, ValidateIf } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { TipoEmpleadoList } from "../enum/convocatoria.enum";
import type { TipoEmpleadoType } from "../enum/convocatoria.enum";
import { ModalidadEmpleadoList } from "../enum/modalidad.enum";
import type { ModalidadEmpleadoType } from "../enum/modalidad.enum";

export class CreateConvocatoriaDto {

    @ApiProperty({
        description: 'Cargo al que se quiere postular en la convocatoria',
        example: 'Ingeniero frontend Senior',
        type: String
    })
    @IsNotEmpty({ message: 'Cargo de la convocatoria es requerido.' })
    @IsString()
    cargo: string;
    
    @ApiProperty({
        description: 'ID del usuario que crea la convocatoria',
        example: 5,
        type: Number
    })
    @IsInt()
    usuario_id: number;

    @ApiProperty({
        description: 'ID del área a la que pertenece la convocatoria',
        example: 3,
        type: Number
    })
    @IsInt()
    area_id: number;

    @ApiProperty({
        description: 'Tipo de empleado para la convocatoria',
        enum: TipoEmpleadoList,
        example: TipoEmpleadoList[0],
        enumName: 'TipoEmpleado'
    })
    @IsNotEmpty({ message: "El tipo de documento es obligatorio." })
    @IsEnum(TipoEmpleadoList, {
        message: `Solamente estan permitidos los siguientes tipos de documento ${TipoEmpleadoList}`
    })
    tipo_empleado: TipoEmpleadoType;

    @ApiProperty({
        description: 'Modalidad de trabajo del empleado',
        enum: ModalidadEmpleadoList,
        example: ModalidadEmpleadoList[0],
        enumName: 'ModalidadEmpleado'
    })
    @IsNotEmpty()
    @IsEnum(ModalidadEmpleadoList, {
        message: `Solamente estan permitidos las siguiente modalidades ${ModalidadEmpleadoList}`
    })
    modalidad: ModalidadEmpleadoType;

    @ApiProperty({
        description: 'Descripción detallada de la convocatoria',
        example: 'Se busca desarrollador backend con experiencia en NestJS y PostgreSQL',
        type: String
    })
    @IsNotEmpty({ message: 'Descripcion de la convocatoria es requerido.' })
    @IsString()
    descripcion: string;

    @ApiProperty({
        description: 'Remuneración ofrecida para el cargo',
        example: 3500.50,
        type: Number
    })
    @ValidateIf(o => o.es_a_convenir === false || o.es_a_convenir === undefined)
    @IsNotEmpty({ message: 'La remuneración es obligatoria cuando no es a convenir' })
    @IsNumber({}, { message: 'El campo remuneración solo debe tener números' })
    @Min(0, { message: 'La remuneración debe ser mayor o igual a 0' })
    remuneracion?: number;
    
    @ApiPropertyOptional({
        description: 'Indica si la remuneración es a convenir',
        example: false,
        type: Boolean,
        default: false
    })
    @IsOptional()
    @IsBoolean()
    es_a_convenir?: boolean;

    @ApiProperty({
        description: 'ID del responsable de la convocatoria',
        example: 2,
        type: Number
    })
    @IsInt()
    responsable_id: number;

    @ApiProperty({
        description: 'Fecha de finalización de la convocatoria',
        example: '2025-12-31T23:59:59.000Z',
        type: Date
    })
    @Type(() => Date)
    @IsDate({ message: "La fecha de finalización debe ser una fecha válida." })
    @IsNotEmpty({ message: "La fecha de finalización es obligatoria." })
    fecha_finalizacion: Date;

}