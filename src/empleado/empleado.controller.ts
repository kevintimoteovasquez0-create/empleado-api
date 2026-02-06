import { Body, Controller, Get, Param, ParseBoolPipe, ParseIntPipe, Patch, Post, Put, Query } from '@nestjs/common';
import { EmpleadoService } from './empleado.service';
import { PaginationDto } from 'src/common';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';

@Controller('empleado')
export class EmpleadoController {
  constructor(private readonly empleadoService: EmpleadoService) { }

  @Get()
  findAllEmpleados(
    @Query() paginationDto: PaginationDto,
    @Query("estado", ParseBoolPipe) estado: boolean
  ) {

    const estadoValidado = estado ?? true
    return this.empleadoService.findAllEmpleados(paginationDto, estadoValidado);
  }

  @Get(":id")
  findEmpleadosById(
    @Param("id", ParseIntPipe) id: number,
    @Query("estado", ParseBoolPipe) estado: boolean
  ) {
    const estadoValidado = estado ?? true
    return this.empleadoService.findEmpleadosById(id, estadoValidado)
  }

  @Post()
  createEmpleados(
    @Body() createEmpleadosDto: CreateEmpleadoDto
  ) {
    return this.empleadoService.createEmpleados(createEmpleadosDto)
  }

  @Put(":id")
  updateEmpleados(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateEmpleadosDto: UpdateEmpleadoDto
  ) {
    return this.empleadoService.updateEmpleados(id, updateEmpleadosDto)
  }

  @Patch(":id/restore")
  restoreEmpleados(
    @Param("id", ParseIntPipe) id: number
  ) {
    return this.empleadoService.restoreEmpleados(id)
  }

  @Patch(":id/remove")
  removeEmpleados(
    @Param("id", ParseIntPipe) id: number
  ) {
    return this.empleadoService.removeEmpleados(id)
  }

  //Apis extras

  // @Get(":id/documentos")
  // obtenerDocumentosEmpleados(
  //   @Param("id", ParseIntPipe) id: number
  // ) {
  //   return this.empleadoService.obtenerDocumentosEmpleados(id)
  // }
}

