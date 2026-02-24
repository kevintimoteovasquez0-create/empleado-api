import { Module } from '@nestjs/common';
import { DocumentoEmpleadoService } from './documento_empleado.service';
import { DocumentoEmpleadoController } from './documento_empleado.controller';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { RequisitoDocumentoModule } from 'src/requisito_documento/requisito_documento.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { EmpleadoModule } from 'src/empleado/empleado.module';

@Module({
  imports: [DrizzleModule, CloudinaryModule, RequisitoDocumentoModule, EmpleadoModule],
  controllers: [DocumentoEmpleadoController],
  providers: [DocumentoEmpleadoService],
  exports: [DocumentoEmpleadoService],
})
export class DocumentoEmpleadoModule {}
