import { IsInt, IsString, IsEnum, IsOptional } from 'class-validator';

export class CreateDocumentoEmpleadoDto {
  @IsInt()
  empleado_id: number;

  @IsInt()
  requisito_id: number;

  @IsString()
  archivo_pdf: string;

  @IsEnum(['pdf', 'img'])
  tipo_archivo: 'pdf' | 'img';

  @IsEnum(['pendiente', 'completo', 'observado'])
  estado: 'pendiente' | 'completo' | 'observado';

  @IsOptional()
  @IsString()
  observacion_texto?: string;

  @IsOptional()
  @IsInt()
  revisado_por?: number;

  @IsOptional()
  fecha_revision?: Date;
}
