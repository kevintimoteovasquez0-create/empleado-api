import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { DocumentoEmpleadoService } from './documento_empleado.service';

import { CreateDocumentoEmpleadoDto } from './dto/create-documento-empleado.dto';
import { UpdateDocumentoEmpleadoDto } from './dto/update-documento-empleado.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Documento Empleado')
@Controller('documento-empleado')
export class DocumentoEmpleadoController {
  constructor(
    private readonly documentoEmpleadoService: DocumentoEmpleadoService,
  ) { }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un documento de empleado por ID',
    description:
      'Retorna los detalles de un documento específico con información del requisito',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del documento de empleado',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Documento encontrado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Documento no encontrado',
  })
  findDocumentoEmpleadoById(
    @Param('id', ParseIntPipe) id: number,
    @Query("estado", new DefaultValuePipe(true), ParseBoolPipe) estado: boolean
  ) {
    return this.documentoEmpleadoService.findDocumentoEmpleadoById(id, estado);
  }

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  @ApiOperation({
    summary: 'Crear un nuevo documento de empleado',
    description:
      'Crea un nuevo documento de empleado. Valida que el empleado y requisito existan y que no exista ya un documento del mismo requisito para el empleado.',
  })
  @ApiBody({
    type: CreateDocumentoEmpleadoDto,
    description: 'Datos del documento a crear',
  })
  @ApiResponse({
    status: 201,
    description: 'Documento creado exitosamente',
  })
  @ApiResponse({
    status: 400,
    description:
      'Datos inválidos, empleado/requisito no existe o documento duplicado',
  })
  createDocumentoEmpleado(
    @Body() createDocumentoEmpleadoDto: CreateDocumentoEmpleadoDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.documentoEmpleadoService.createDocumentoEmpleado(createDocumentoEmpleadoDto, file);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Actualizar un documento de empleado',
    description: 'Actualiza completamente un documento de empleado existente',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del documento a actualizar',
    example: 1,
  })
  @ApiBody({
    type: UpdateDocumentoEmpleadoDto,
    description: 'Datos actualizados del documento',
  })
  @ApiResponse({
    status: 200,
    description: 'Documento actualizado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Documento no encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o empleado/requisito no existe',
  })
  updateDocumentoEmpleado(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDocumentoEmpleadoDto: UpdateDocumentoEmpleadoDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.documentoEmpleadoService.updateDocumentoEmpleado(id, updateDocumentoEmpleadoDto, file);
  }

  @Patch(':id/remove')
  @ApiOperation({
    summary: 'Eliminar (desactivar) un documento de empleado',
    description:
      'Realiza una eliminación lógica del documento de empleado (soft delete)',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del documento de empleado a eliminar',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Documento de empleado eliminado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Documento de empleado no encontrado',
  })
  removeDocumentoEmpleado(@Param('id', ParseIntPipe) id: number) {
    return this.documentoEmpleadoService.removeDocumentoEmpleado(id);
  }

  @Patch(':id/restore')
  @ApiOperation({
    summary: 'Restaurar un documento de empleado',
    description: 'Restaura un documento de empleado previamente eliminado',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del documento de empleado a restaurar',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Documento de empleado restaurado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Documento de empleado no encontrado o ya está activo',
  })
  restoreDocumentoEmpleado(@Param('id', ParseIntPipe) id: number) {
    return this.documentoEmpleadoService.restoreDocumentoEmpleado(id);
  }


  //Api documentos por empleadoID
  @Get("empleado/:id/documentos")
  @ApiOperation({ summary: 'Obtener documentos de un empleado' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del empleado' })
  @ApiQuery({ name: 'estado', type: Boolean, required: false, description: 'Estado del documento', example: true })
  @ApiResponse({ status: 200, description: 'Documentos obtenidos correctamente' })
  @ApiResponse({ status: 404, description: 'Empleado no encontrado' })
  getDocumentosByEmpleadoID(
    @Param("id", ParseIntPipe) id: number,
    @Query("estado", new DefaultValuePipe(true), ParseBoolPipe) estado: boolean
  ) {
    return this.documentoEmpleadoService.getDocumentosByEmpleadoID(id, estado)
  }

  @Get("empleado/:id/requisitos")
  @ApiOperation({ summary: 'Obtener requisitos de un empleado con su estado de documento' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del empleado' })
  @ApiResponse({ status: 200, description: 'Requisitos obtenidos correctamente' })
  @ApiResponse({ status: 404, description: 'Empleado no encontrado' })
  getRequisitosDocumentosByEmpleadoID(
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.documentoEmpleadoService.getRequisitosDocumentosByEmpleadoID(id)
  }


}
