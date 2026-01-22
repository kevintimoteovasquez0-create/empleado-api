import { Controller, Get } from '@nestjs/common';
import { AreaService } from './area.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Areas')
@Controller('area')
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las areas',
    description: 'Retorna la lista completa de areas registrados en el sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de areas obtenida correctamente',
  })
  findAllAccesos() {
    return this.areaService.findAllAreas();
  }

}
