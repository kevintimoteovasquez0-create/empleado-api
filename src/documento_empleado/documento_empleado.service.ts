import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { and, asc, eq, or } from 'drizzle-orm';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { DocumentoEmpleadoTable } from 'src/drizzle/schema/documento_empleado';
import { RequisitoDocumentoTable } from 'src/drizzle/schema/requisito_documento';
import { CreateDocumentoEmpleadoDto } from './dto/create-documento-empleado.dto';
import { UpdateDocumentoEmpleadoDto } from './dto/update-documento-empleado.dto';
import { getTableColumns } from 'drizzle-orm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { RequisitoDocumentoService } from 'src/requisito_documento/requisito_documento.service';
import { BaseDrizzleService } from 'src/drizzle/base_drizzle.service';
import { EmpleadoService } from 'src/empleado/empleado.service';
import { number } from 'joi';
import { EmpleadoTable } from 'src/drizzle/schema/empleado';

@Injectable()
export class DocumentoEmpleadoService extends BaseDrizzleService {
  constructor(
    drizzleService: DrizzleService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly requisitoDocumentoService: RequisitoDocumentoService,
    private readonly empleadoService: EmpleadoService
  ) {
    super(drizzleService)
  }

  async findDocumentoEmpleadoById(id: number, estado: boolean) {

    const { requisito_id, ...restoCamposDocumentoEmpleado } = getTableColumns(DocumentoEmpleadoTable)
    const [response] = await this.db
      .select({
        ...restoCamposDocumentoEmpleado,
        requisito: {
          id: RequisitoDocumentoTable.id,
          nombre: RequisitoDocumentoTable.nombre,
          descripcion: RequisitoDocumentoTable.descripcion,
          es_obligatorio: RequisitoDocumentoTable.es_obligatorio,
          aplica_para: RequisitoDocumentoTable.aplica_para,
        },
      })
      .from(DocumentoEmpleadoTable)
      .innerJoin(
        RequisitoDocumentoTable,
        eq(DocumentoEmpleadoTable.requisito_id, RequisitoDocumentoTable.id),
      )
      .where(
        and(
          eq(DocumentoEmpleadoTable.id, id),
          eq(DocumentoEmpleadoTable.estado_registro, estado),
        ),
      )
      .limit(1);

    if (!response) {
      throw new NotFoundException(
        `No se encontró el documento empleado con id ${id}`,
      );
    }

    return response;
  }

  async getDocumentosByEmpleadoID(empleadoId: number, estado: boolean) {

    await this.empleadoService.findEmpleadosById(empleadoId, true)
    const { requisito_id, ...restoCamposDocumentoEmpleado } = getTableColumns(DocumentoEmpleadoTable)

    const documentos = await this.db
      .select({
        ...restoCamposDocumentoEmpleado,
        requisito: {
          id: RequisitoDocumentoTable.id,
          nombre: RequisitoDocumentoTable.nombre,
          es_obligatorio: RequisitoDocumentoTable.es_obligatorio,
        },
      })
      .from(DocumentoEmpleadoTable)
      .leftJoin(
        RequisitoDocumentoTable,
        eq(DocumentoEmpleadoTable.requisito_id, RequisitoDocumentoTable.id),
      )
      .where(
        and(
          eq(DocumentoEmpleadoTable.empleado_id, empleadoId),
          eq(DocumentoEmpleadoTable.estado_registro, estado),
        ),
      )

    return documentos;
  }

  async createDocumentoEmpleado(createDocumentoEmpleadoDto: CreateDocumentoEmpleadoDto, file: Express.Multer.File) {
    try {

      await this.empleadoService.findEmpleadosById(createDocumentoEmpleadoDto.empleado_id, true)
      await this.requisitoDocumentoService.findRequisitoDocumentoById(createDocumentoEmpleadoDto.requisito_id, true)

      const responseFile = await this.cloudinaryService.uploadFile(file)

      await this.db
        .insert(DocumentoEmpleadoTable)
        .values({
          ...createDocumentoEmpleadoDto,
          tipo_archivo: file.mimetype as "pdf",
          archivo_pdf: responseFile.secure_url
        });

      return {
        message: 'Documento empleado creado correctamente',
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        `Ocurrió un error con el sistema: ${error}`,
      );
    }
  }

  async updateDocumentoEmpleado(id: number, updateDocumentoEmpleadoDto: UpdateDocumentoEmpleadoDto, file: Express.Multer.File) {
    try {
      const responseDocumentoEmpleado = await this.findDocumentoEmpleadoById(id, true);

      const { empleado_id, requisito_id, ...restoCamposUpdateDocumentoEmpleado } = updateDocumentoEmpleadoDto

      const validadoEmpleadoID = empleado_id ?? responseDocumentoEmpleado.empleado_id
      const validadoRequisitoID = requisito_id ?? responseDocumentoEmpleado.requisito.id

      await this.empleadoService.findEmpleadosById(validadoEmpleadoID, true)
      await this.requisitoDocumentoService.findRequisitoDocumentoById(validadoRequisitoID, true)

      const responseFile = await this.cloudinaryService.uploadFile(file)

      await this.db
        .update(DocumentoEmpleadoTable)
        .set({
          ...restoCamposUpdateDocumentoEmpleado,
          archivo_pdf: responseFile.secure_url
        })
        .where(eq(DocumentoEmpleadoTable.id, id));

      return {
        message: 'Documento empleado actualizado correctamente',
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      throw new InternalServerErrorException(
        `Ocurrió un error con el sistema: ${error}`,
      );
    }
  }

  async removeDocumentoEmpleado(id: number) {
    try {
      await this.findDocumentoEmpleadoById(id, true);

      await this.db
        .update(DocumentoEmpleadoTable)
        .set({ estado_registro: false })
        .where(eq(DocumentoEmpleadoTable.id, id));

      return {
        message: 'Documento empleado eliminado correctamente',
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Ocurrió un error con el sistema: ${error}`,
      );
    }
  }

  async restoreDocumentoEmpleado(id: number) {
    try {

      await this.findDocumentoEmpleadoById(id, false)

      await this.db
        .update(DocumentoEmpleadoTable)
        .set({ estado_registro: true })
        .where(eq(DocumentoEmpleadoTable.id, id));

      return {
        message: 'Documento empleado restaurado correctamente',
      };

    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Ocurrió un error con el sistema: ${error}`,
      );
    }
  }


  async getRequisitosDocumentosByEmpleadoID(empleadoID: number) {
    
    const obtenerEmpleado = await this.empleadoService.findEmpleadosById(empleadoID, true)

    const requisitoDocumento = getTableColumns(RequisitoDocumentoTable)

    const response = await this.db
    .select({
      ...requisitoDocumento,
      estado: DocumentoEmpleadoTable.estado,
      archivo_pdf: DocumentoEmpleadoTable.archivo_pdf
    })
    .from(RequisitoDocumentoTable)
    .leftJoin(DocumentoEmpleadoTable, and(
      eq(DocumentoEmpleadoTable.requisito_id, RequisitoDocumentoTable.id),
      eq(DocumentoEmpleadoTable.empleado_id, empleadoID)
    ))
    .where(
      or(
        eq(RequisitoDocumentoTable.aplica_para, obtenerEmpleado.tipo_personal),
        eq(RequisitoDocumentoTable.aplica_para, "AMBOS")
      )
    )
    .orderBy(asc(RequisitoDocumentoTable.orden_visualizacion))

    return {
     data: response
    }
  }

}
