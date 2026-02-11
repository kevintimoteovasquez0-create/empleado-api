import { PartialType } from '@nestjs/mapped-types';
import { CreateDocumentoEmpleadoDto } from './create-documento-empleado.dto';

export class UpdateDocumentoEmpleadoDto extends PartialType(
  CreateDocumentoEmpleadoDto,
) {}
