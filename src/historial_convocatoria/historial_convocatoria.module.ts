import { Module } from '@nestjs/common';
import { HistorialConvocatoriaService } from './historial_convocatoria.service';
import { HistorialConvocatoriaController } from './historial_convocatoria.controller';

@Module({
  controllers: [HistorialConvocatoriaController],
  providers: [HistorialConvocatoriaService],
})
export class HistorialConvocatoriaModule {}
