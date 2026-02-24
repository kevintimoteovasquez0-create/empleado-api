import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { PaginationConvocatoriaDto } from './dto/pagination-convocatoria.dto';
import { ConvocatoriaTable } from 'src/drizzle/schema/convocatoria';
import { and, count, eq } from 'drizzle-orm';
import { CreateConvocatoriaDto } from './dto/create-convocatoria.dto';
import { UsuarioTable } from 'src/drizzle/schema/usuario';
import { alias } from 'drizzle-orm/pg-core';
import { AreaTable } from 'src/drizzle/schema/area';
import { CreatePostulacionDto } from 'src/postulacion/dto/create-postulacion.dto';
import { PostulacionService } from 'src/postulacion/postulacion.service';
import { PaginationDto } from 'src/common';
import { getTableColumns } from 'drizzle-orm';
import { BaseDrizzleService } from 'src/drizzle/base_drizzle.service';

@Injectable()
export class ConvocatoriaService extends BaseDrizzleService{

  constructor(
    drizzleService: DrizzleService,
    private readonly postulacionService: PostulacionService
  ) { 
    super(drizzleService)
  }

  async findAllConvocatorias(paginationConvocatoriaDto: PaginationConvocatoriaDto, estado: boolean) {

      const { page, limit, tipo_empleado } = paginationConvocatoriaDto;

      const safeLimit = limit ?? 10;
      const safePage = page ?? 1;

      const whereConditions: any[] = [
        eq(ConvocatoriaTable.estado_registro, estado)
      ];

      if (tipo_empleado) {
        whereConditions.push(eq(ConvocatoriaTable.tipo_empleado, tipo_empleado));
      }

      const [{ value }] = await this.db
        .select({ value: count(ConvocatoriaTable.id) })
        .from(ConvocatoriaTable)
        .where(and(...whereConditions));

      const totalConvocatoria = Number(value);
      const lastPage = Math.ceil(totalConvocatoria / safeLimit);

      const usuarioCreador = alias(UsuarioTable, 'usuario_creador') as typeof UsuarioTable
      const usuarioResponsable = alias(UsuarioTable, 'usuario_responsable') as typeof UsuarioTable

      const { usuario_id, area_id, ...restoCamposConvocatoria } = getTableColumns(ConvocatoriaTable)

      const response = await this.db
        .select({
          ...restoCamposConvocatoria,
          usuario_creador: {
            id: usuarioCreador.id,
            nombre: usuarioCreador.nombre,
            apellido: usuarioCreador.apellido
          },
          usuario_responsable: {
            id: usuarioResponsable.id,
            nombre: usuarioResponsable.nombre,
            apellido: usuarioResponsable.apellido
          },
          area: {
            id: AreaTable.id,
            nombre: AreaTable.nombre,
            descripcion: AreaTable.descripcion
          },
        })
        .from(ConvocatoriaTable)
        .leftJoin(usuarioCreador, eq(ConvocatoriaTable.usuario_id, usuarioCreador.id))
        .leftJoin(usuarioResponsable, eq(ConvocatoriaTable.responsable_id, usuarioResponsable.id))
        .leftJoin(AreaTable, eq(ConvocatoriaTable.area_id, AreaTable.id))
        .where(and(...whereConditions))
        .limit(safeLimit)
        .offset((safePage - 1) * safeLimit);

      return {
        data: response,
        pagination: {
          totalConvocatoria: totalConvocatoria,
          page: safePage,
          limit: safeLimit,
          lastPage: lastPage
        },
      };
  }

  async findOneConvocatoriaById(id: number, estado: boolean) {

    const usuarioCreador = alias(UsuarioTable, 'usuario_creador') as typeof UsuarioTable
    const usuarioResponsable = alias(UsuarioTable, 'usuario_responsable') as typeof UsuarioTable

    const { usuario_id, area_id, ...restoCamposConvocatoria } = getTableColumns(ConvocatoriaTable)

    const [response] = await this.db
      .select({
        ...restoCamposConvocatoria,
        usuario_creador: {
          id: usuarioCreador.id,
          nombre: usuarioCreador.nombre,
          apellido: usuarioCreador.apellido
        },
        usuario_responsable: {
          id: usuarioResponsable.id,
          nombre: usuarioResponsable.nombre,
          apellido: usuarioResponsable.apellido
        },
        area: {
          id: AreaTable.id,
          nombre: AreaTable.nombre,
          descripcion: AreaTable.descripcion
        }
      })
      .from(ConvocatoriaTable)
      .leftJoin(usuarioCreador, eq(ConvocatoriaTable.usuario_id, usuarioCreador.id))
      .leftJoin(usuarioResponsable, eq(ConvocatoriaTable.responsable_id, usuarioResponsable.id))
      .leftJoin(AreaTable, eq(ConvocatoriaTable.area_id, AreaTable.id))
      .where(
        and(
          eq(ConvocatoriaTable.id, id),
          eq(ConvocatoriaTable.estado_registro, estado)
        )
      )
      .limit(1);

    if (!response) {
      throw new NotFoundException(`No se encontro la convocatoria con id ${id}`)
    }

    return response
  }

  async createConvocatoria(createConvocatoriaDto: CreateConvocatoriaDto) {
    try {

      const { remuneracion, es_a_convenir } = createConvocatoriaDto;

      const remuneraciones = remuneracion === 0
        ? null
        : remuneracion;

      if (!es_a_convenir && (remuneraciones == null || remuneraciones <= 0)) {
        throw new BadRequestException(
          'La remuneración es obligatoria cuando no es a convenir'
        );
      }

      if (es_a_convenir && remuneraciones != null) {
        throw new BadRequestException(
          'No se debe especificar remuneración cuando es a convenir'
        );
      }

      await this.db
        .insert(ConvocatoriaTable)
        .values({
          ...createConvocatoriaDto,
          remuneracion: remuneraciones != null ? remuneraciones.toString() : null
        });

      return {
        message: "Convocatoria creada correctamente"
      }

    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async updateConvocatoria(id, updateConvocatoriaDto) {
    try {

      await this.findOneConvocatoriaById(id, true)

      const { remuneracion, es_a_convenir } = updateConvocatoriaDto;

      const remuneraciones = remuneracion === 0
        ? null
        : remuneracion;

      // Validación de negocio
      if (!es_a_convenir && (remuneraciones == null || remuneraciones <= 0)) {
        throw new BadRequestException(
          'La remuneración es obligatoria cuando no es a convenir'
        );
      }

      if (es_a_convenir && remuneraciones != null) {
        throw new BadRequestException(
          'No se debe especificar remuneración cuando es a convenir'
        );
      }

      await this.db
        .update(ConvocatoriaTable)
        .set({
          ...updateConvocatoriaDto,
          remuneracion: es_a_convenir ? null : remuneraciones?.toString(),
          updated_at: new Date()
        })
        .where(
          eq(ConvocatoriaTable.id, id)
        );

      return {
        message: `La convocatoria con id ${id} ha sido actualizada correctamente`
      }

    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async removeConvocatoria(id: number) {
    try {

      await this.findOneConvocatoriaById(id, true)

      await this.db
        .update(ConvocatoriaTable)
        .set({
          estado_registro: false,
          updated_at: new Date()
        })
        .where(
          eq(ConvocatoriaTable.id, id)
        )

      return {
        message: `La convocatoria con id ${id} ha sido eliminada correctamente`
      }

    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async restoreConvocatoria(id: number) {
    try {

      await this.findOneConvocatoriaById(id, false)

      await this.db
        .update(ConvocatoriaTable)
        .set({
          estado_registro: false,
          updated_at: new Date()
        })
        .where(
          eq(ConvocatoriaTable.id, id)
        )

      return {
        message: `La convocatoria con id ${id} ha sido restaurada correctamente`
      }

    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  //Funciones extras

  async convocatoriaPostular(id: number, createPostulacionDto: CreatePostulacionDto) {
    await this.findOneConvocatoriaById(id, true)
    return this.postulacionService.createPostulacion(id, createPostulacionDto)
  }

  async obtenerPostulacionesConvocatorias(id: number, estado: boolean, paginationDto: PaginationDto) {
    await this.findOneConvocatoriaById(id, true)
    return this.postulacionService.findAllPostulaciones(paginationDto, estado, id)
  }

}
