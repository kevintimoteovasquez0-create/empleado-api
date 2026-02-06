import { Body, Controller, Get, Param, ParseBoolPipe, ParseIntPipe, Patch, Post, Put, Query } from '@nestjs/common';
import { AreaService } from './area.service';
import { PaginationDto } from 'src/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
@Controller('area')
export class AreaController {
  constructor(private readonly areaService: AreaService) { }

  @Get()
  findAllAreas(
    @Query() paginationDto: PaginationDto,
    @Query("estado", ParseBoolPipe) estado: boolean
  ) {

    const estadoValidado = estado ?? true
    return this.areaService.findAllAreas(paginationDto, estadoValidado);
  }

  @Get(":id")
  findAreasById(
    @Param("id", ParseIntPipe) id: number,
    @Query("estado", ParseBoolPipe) estado: boolean
  ) {
    const estadoValidado = estado ?? true
    return this.areaService.findAreasById(id, estadoValidado)
  }

  @Post()
  createAreas(
    @Body() createAreaDto: CreateAreaDto
  ) {
    return this.areaService.createAreas(createAreaDto)
  }

  @Put(":id")
  updateAreas(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateAreaDto: UpdateAreaDto
  ) {
    return this.areaService.updateAreas(id, updateAreaDto)
  }

  @Patch(":id/restore")
  restoreAreas(
    @Param("id", ParseIntPipe) id: number
  ) {
    return this.areaService.restoreAreas(id)
  }

  @Patch(":id/remove")
  removeAreas(
    @Param("id", ParseIntPipe) id: number
  ) {
    return this.areaService.removeAreas(id)
  }

  //Apis extras

  @Get(":id/empleados")
  obtenerEmpleadosAreas(
    @Param("id", ParseIntPipe) id: number
  ){
    return this.areaService.obtenerEmpleadosAreas(id)
  }
}
