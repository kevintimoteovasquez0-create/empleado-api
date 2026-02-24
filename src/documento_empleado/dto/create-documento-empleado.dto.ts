import { ApiProperty} from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsPositive
} from 'class-validator';

export enum TipoArchivoEnumDto {
  PDF = 'pdf',
  IMG = 'img',
}

export class CreateDocumentoEmpleadoDto {
  @ApiProperty({
    description: 'ID del empleado',
    example: 1,
    type: Number,
  })
  @IsNotEmpty({ message: 'El ID del empleado es obligatorio.' })
  @IsInt({ message: 'El ID del empleado debe ser un número entero.' })
  @IsPositive({ message: 'El ID del empleado debe ser mayor que cero.' })
  empleado_id: number;

  @ApiProperty({
    description: 'ID del requisito de documento',
    example: 1,
    type: Number,
  })
  @IsNotEmpty({ message: 'El ID del requisito es obligatorio.' })
  @IsInt({ message: 'El ID del requisito debe ser un número entero.' })
  @IsPositive({ message: 'El ID del requisito debe ser mayor que cero.' })
  requisito_id: number;
}
