import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccesoService } from './acceso.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@ApiTags('Acceso')
@Controller('acceso')
export class AccesoController {
  constructor(private readonly accesoService: AccesoService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los accesos',
    description: 'Retorna la lista completa de accesos registrados en el sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de accesos obtenida correctamente',
  })
  @UseGuards(AuthGuard)
  @HttpCode(200)
  findAllAccesos() {
    return this.accesoService.findAllAccesos();
  }
}
