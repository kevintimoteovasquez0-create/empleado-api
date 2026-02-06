import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty, IsPositive, IsString, MaxLength } from "class-validator";

export class CreateAreaDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty({ message: 'El nombre del área es obligatorio.' })
  @IsString({ message: 'El nombre debe ser texto.' })
  @MaxLength(50, { message: 'El nombre no puede superar los 50 caracteres.' })
  nombre: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty({ message: 'La descripción es obligatoria.' })
  @IsString({ message: 'La descripción debe ser texto.' })
  @MaxLength(150, { message: 'La descripción no puede superar los 150 caracteres.' })
  descripcion: string;

  @IsNotEmpty({ message: 'El responsable es obligatorio.' })
  @IsInt({ message: 'El ID del responsable debe ser un número entero.' })
  @IsPositive({ message: 'El ID del responsable debe ser mayor que cero.' })
  responsable_id: number;
}