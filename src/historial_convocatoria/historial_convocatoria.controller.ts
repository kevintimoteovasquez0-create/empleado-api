import { Controller } from '@nestjs/common';
import { HistorialConvocatoriaService } from './historial_convocatoria.service';

@Controller('historial-convocatoria')
export class HistorialConvocatoriaController {
  constructor(private readonly historialConvocatoriaService: HistorialConvocatoriaService) {}
}
