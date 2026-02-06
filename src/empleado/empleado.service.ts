import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { and, getTableColumns } from 'drizzle-orm';
import { count, eq } from 'drizzle-orm';
import { PaginationDto } from 'src/common';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { AreaTable } from 'src/drizzle/schema/area';
import { EmpleadoTable } from 'src/drizzle/schema/empleado';
import { CreateEmpleadoDto, DocumentoEnumDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';

@Injectable()
export class EmpleadoService {

  constructor(
    private readonly drizzleService: DrizzleService,
    // private readonly documentoService: DocumentoService
  ) { }

  private get db() {
    return this.drizzleService.getDb();
  }

  async findAllEmpleados(paginationDto: PaginationDto, estado: boolean) {
    try {

      const { page, limit } = paginationDto

      const [{ total }] = await this.db
        .select({ total: count() })
        .from(EmpleadoTable)
        .where(eq(EmpleadoTable.estado_registro, estado))

      const getAllRegistrosArea = Number(total)

      const finalPage = page ?? 1
      const finalLimit = limit ?? 10

      const numberPages = Math.ceil(getAllRegistrosArea / finalLimit)

      const { area_id, ...restoCamposArea } = getTableColumns(EmpleadoTable)

      const responseEmpleados = await this.db
        .select({
          ...restoCamposArea,
          area: {
            id: AreaTable.id,
            nombre: AreaTable.nombre
          }
        })
        .from(EmpleadoTable)
        .innerJoin(AreaTable, eq(EmpleadoTable.area_id, AreaTable.id))
        .where(eq(EmpleadoTable.estado_registro, estado))
        .limit(finalLimit)
        .offset((finalPage - 1) * finalLimit)

      return {
        data: responseEmpleados,
        pagination: {
          tota: getAllRegistrosArea,
          page: finalPage,
          limit: finalLimit,
          finalPage: numberPages
        }
      }

    } catch (error) {
      throw new InternalServerErrorException(
        `Ocurrió un error con el sistema: ${error}`,
      );
    }
  }

  async findEmpleadosById(id: number, estado: boolean) {
    try {

      const { area_id, ...restoCamposArea } = getTableColumns(EmpleadoTable)

      const [response] = await this.db
        .select({
          ...restoCamposArea,
          area: {
            id: AreaTable.id,
            nombre: AreaTable.nombre
          }
        })
        .from(EmpleadoTable)
        .innerJoin(AreaTable, eq(EmpleadoTable.area_id, AreaTable.id))
        .where(
          and(
            eq(EmpleadoTable.id, id),
            eq(EmpleadoTable.estado_registro, estado))
        )
        .limit(1)

      if (!response) {
        throw new NotFoundException(`No se encontro el área con id ${id}`)
      }

      return response

    } catch (error) {
      throw new InternalServerErrorException(
        `Ocurrió un error con el sistema: ${error}`,
      );
    }
  }

  async createEmpleados(createEmpleadosDto: CreateEmpleadoDto) {
    try {

      await this.db
        .insert(EmpleadoTable)
        .values({ ...createEmpleadosDto })

      return {
        message: "Área creada correctamente"
      }

    } catch (error) {
      throw new InternalServerErrorException(
        `Ocurrió un error con el sistema: ${error}`,
      );
    }
  }

  async updateEmpleados(id: number, updateEmpleadosDto: UpdateEmpleadoDto) {
    try {
      await this.findEmpleadosById(id, true)

      await this.db
        .update(EmpleadoTable)
        .set({ ...updateEmpleadosDto })
        .where(eq(EmpleadoTable.id, id))

      return {
        message: "Área actualizada correctamente"
      }

    } catch (error) {
      throw new InternalServerErrorException(
        `Ocurrió un error con el sistema: ${error}`,
      );
    }
  }

  async restoreEmpleados(id: number) {
    try {

      await this.findEmpleadosById(id, false)

      await this.db
        .update(EmpleadoTable)
        .set({ estado_registro: true })
        .where(eq(EmpleadoTable.id, id))

      return {
        message: "Área restaurada correctamente"
      }

    } catch (error) {
      throw new InternalServerErrorException(
        `Ocurrió un error con el sistema: ${error}`,
      );
    }
  }

  async removeEmpleados(id: number) {
    try {

      await this.findEmpleadosById(id, true)

      await this.db
        .update(EmpleadoTable)
        .set({ estado_registro: false })
        .where(eq(EmpleadoTable.id, id))

      return {
        message: "Área removida correctamente"
      }

    } catch (error) {
      throw new InternalServerErrorException(
        `Ocurrió un error con el sistema: ${error}`,
      );
    }
  }


  async actualizarAuditoriaProgreso(){

  }

  //Funciones extras

  async obtenerEmpleadoArea(areaID: number) {
    try {
      const [response] = await this.db
        .select({
          id: EmpleadoTable.id,
          nombre: EmpleadoTable.nombres,
          apellido: EmpleadoTable.apellidos
        })
        .from(EmpleadoTable)
        .where(eq(EmpleadoTable.area_id, areaID))

      return response

    } catch (error) {
      throw new InternalServerErrorException(
        `Ocurrió un error con el sistema: ${error}`
      );
    }
  }

  // async obtenerDocumentosEmpleados(id: number) {
  //   try {
  //     await this.findEmpleadosById(id, true)
  //     return this.documentoService.obtenerDocumentoEmpleado(id)

  //   } catch (error) {
  //     throw new InternalServerErrorException(`Ocurrió un error con el sistema: ${error}`)
  //   }

  // }

}
