import { ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsInt, IsNotEmpty, IsPositive, IsString, MaxLength } from "class-validator";
import { CreateDocumentoEmpleadoDto } from "./create-documento-empleado.dto";

export enum EstadoDocumentoEnumDto {
  PENDIENTE = 'PENDIENTE',
  APROBADO = 'APROBADO',
  RECHAZADO = 'RECHAZADO',
  OBSERVADO = 'OBSERVADO',
}

export class UpdateDocumentoEmpleadoDto extends PartialType(CreateDocumentoEmpleadoDto){

  @ApiPropertyOptional({
    description: 'Estado del documento',
    enum: EstadoDocumentoEnumDto,
    example: EstadoDocumentoEnumDto.PENDIENTE,
    default: EstadoDocumentoEnumDto.PENDIENTE,
  })
  @IsNotEmpty({message: "Seleccione el estado del documento"})
  @IsEnum(EstadoDocumentoEnumDto, {
    message: 'El estado debe ser: PENDIENTE, APROBADO, RECHAZADO, OBSERVADO.',
  })
  estado: EstadoDocumentoEnumDto;

  @ApiPropertyOptional({
    description: 'Texto de observación sobre el documento',
    example: 'Documento borroso, debe subir una versión más clara',
    type: String,
  })
  @IsNotEmpty({message: 'La observación es obligatoria'})
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'La observación debe ser texto.' })
  @MaxLength(500, {
    message: 'La observación no puede superar los 500 caracteres.',
  })
  observacion_texto: string;

  @ApiPropertyOptional({
    description: 'ID del usuario que revisó el documento',
    example: 5,
    type: Number,
  })
  @IsNotEmpty({message: "El ID del revisor es obligatorio"})
  @IsInt({ message: 'El ID del revisor debe ser un número entero.' })
  @IsPositive({ message: 'El ID del revisor debe ser mayor que cero.' })
  revisado_por: number;

}
