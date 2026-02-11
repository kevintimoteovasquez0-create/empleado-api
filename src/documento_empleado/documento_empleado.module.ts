import { Module } from '@nestjs/common';
import { DocumentoEmpleadoService } from './documento_empleado.service';
import { DocumentoEmpleadoController } from './documento_empleado.controller';

@Module({
  controllers: [DocumentoEmpleadoController],
  providers: [DocumentoEmpleadoService],
})
export class DocumentoEmpleadoModule {}
