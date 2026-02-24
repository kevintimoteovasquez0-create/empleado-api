import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { v4 as uuidv4 } from 'uuid';
import { FotoService } from '../foto/foto.service';
import { EmailService } from '../email/email.service';
import { FotoDto } from '../common/dto/foto.dto';
import * as bcrypt from 'bcryptjs';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { PaginationUsuarioDto } from './dto/pagination-usuario.dto';
import { envs } from '../config';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { UsuarioTable } from 'src/drizzle/schema/usuario';
import { RolTable } from 'src/drizzle/schema/rol';
import { EmpresaTable } from 'src/drizzle/schema/empresa';
import { and, eq, gte, lte } from 'drizzle-orm';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { getTableColumns } from 'drizzle-orm';
import { count } from 'drizzle-orm';
import { ValidarUniqueService } from 'src/common/validar_unique.service';
import { BaseDrizzleService } from 'src/drizzle/base_drizzle.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UsuarioService extends BaseDrizzleService {

  constructor(
    drizzleService: DrizzleService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly emailService: EmailService,
    private readonly validarUniqueService: ValidarUniqueService
  ) {
    super(drizzleService)
  }

  async findUniqueUsuario(id: number, estado: boolean) {
    const { rol_id, ...restoCamposUsuario } = getTableColumns(UsuarioTable)

    const [responseUsuarioId] = await this.db
      .select({
        ...restoCamposUsuario,
        rol: {
          id: RolTable.id,
          nombre: RolTable.nombre,
        },
        empresa: {
          razon_social: EmpresaTable.razon_social
        }
      })
      .from(UsuarioTable)
      .innerJoin(RolTable, eq(UsuarioTable.rol_id, RolTable.id))
      .innerJoin(EmpresaTable, eq(UsuarioTable.empresa_id, EmpresaTable.id))
      .where(
        and(
          eq(UsuarioTable.id, id),
          eq(UsuarioTable.estado_registro, estado)
        )
      )
      .limit(1)

    if (!responseUsuarioId) {
      throw new NotFoundException(`No se encontro el usuario con id ${id}`)
    }

    return {
      responseUsuarioId,
      imagen_url: responseUsuarioId.url_imagen ?? 'empresoft.jpg'
    };
  }

  async findOnebyEmail(email: string) {

    const { rol_id, ...restoCamposEmail } = getTableColumns(UsuarioTable)

    const [responseBuscarUsuarioByEmail] = await this.db
      .select({
        ...restoCamposEmail,
        rol: {
          id: RolTable.id,
          nombre: RolTable.nombre
        },
        empresa: {
          razon_social: EmpresaTable.razon_social
        }
      })
      .from(UsuarioTable)
      .innerJoin(RolTable, eq(UsuarioTable.rol_id, RolTable.id))
      .innerJoin(EmpresaTable, eq(UsuarioTable.empresa_id, EmpresaTable.id))
      .where(
        eq(UsuarioTable.email, email)
      )
      .limit(1)

    if (!responseBuscarUsuarioByEmail) {
      throw new NotFoundException(`El usuario no fue encontrado`)
    }

    return {
      responseBuscarUsuarioByEmail,
      imagen_url: responseBuscarUsuarioByEmail.url_imagen ?? 'empresoft.jpg'
    };

  }

  async getAllUsuario(paginationUsuarioDto: PaginationUsuarioDto, estado: boolean) {

    const { page, limit, fechaInicio, fechaFin, rolId } = paginationUsuarioDto;

    const safeLimit = Math.max(1, limit ?? 10);
    const safePage = Math.max(1, page ?? 1);

    const conditions = [eq(UsuarioTable.estado_registro, estado)];

    // Filtro por fechas
    if (fechaInicio && fechaFin) {
      const fechaInicioDate = new Date(fechaInicio);
      const fechaFinDate = new Date(fechaFin);

      if (!isNaN(fechaInicioDate.getTime()) && !isNaN(fechaFinDate.getTime())) {
        conditions.push(
          gte(UsuarioTable.fecha_ingreso, fechaInicioDate.toISOString()),
          lte(UsuarioTable.fecha_ingreso, fechaFinDate.toISOString())
        );
      }
    }

    // Filtro por rol
    if (rolId) {
      const rolExists = await this.db
        .select({ id: RolTable.id })
        .from(RolTable)
        .where(eq(RolTable.id, rolId))
        .limit(1);

      if (rolExists.length > 0) {
        conditions.push(eq(UsuarioTable.rol_id, rolId));
      }
    }

    // Combinar todas las condiciones
    const whereClause = and(...conditions);

    const [{ value }] = await this.db
      .select({ value: count(UsuarioTable.id) })
      .from(UsuarioTable)
      .where(whereClause);

    const totalUsuario = Number(value);
    const lastPage = Math.ceil(totalUsuario / safeLimit);

    const usuarios = await this.db
      .select()
      .from(UsuarioTable)
      .where(whereClause)
      .limit(safeLimit)
      .offset((safePage - 1) * safeLimit);

    return {
      data: usuarios.map((user) => ({
        ...user,
        imagen_url: user.url_imagen ?? 'empresoft.jpg'
      })),
      pagination: {
        totalUsuario,
        page: safePage,
        lastPage,
      },
    };
  }

  async createUsuario(createUsuarioDto: CreateUsuarioDto, fotoUsuario: Express.Multer.File, empresaId: number) {

    try {
      if (!fotoUsuario) {
        throw new BadRequestException(`Es necesario una foto para registrar usuario`);
      }

      const verificationToken = uuidv4();

      const hashedPassword = await bcrypt.hash(createUsuarioDto.numero_documento, 10);

      const nombreCompleto = `${createUsuarioDto.nombre} ${createUsuarioDto.apellido}`

      await this.validarUniqueService.validarDatosUnicos({
        dto: createUsuarioDto,
        table: UsuarioTable,
        idColumn: UsuarioTable.id,
        uniqueFields: [
          { field: "numero_documento", column: UsuarioTable.numero_documento },
          { field: "email", column: UsuarioTable.email }
        ]
      })

      const imagen_url = await this.cloudinaryService.uploadFile(fotoUsuario)

      await this.db
        .insert(UsuarioTable)
        .values({
          // Datos básicos
          empresa_id: empresaId,
          rol_id: createUsuarioDto.rol_id,
          area_id: createUsuarioDto.area_id,
          nombre: createUsuarioDto.nombre,
          apellido: createUsuarioDto.apellido,
          tipo_documento: createUsuarioDto.tipo_documento,
          numero_documento: createUsuarioDto.numero_documento,
          tipo_imagen: fotoUsuario.mimetype as "png" | "jpg",
          url_imagen: imagen_url.secure_url,
          // Fechas convertidas a string
          fecha_nacimiento: createUsuarioDto.fecha_nacimiento.toISOString().split('T')[0],
          fecha_ingreso: createUsuarioDto.fecha_ingreso.toISOString().split('T')[0],
          // Ubicación
          direccion: createUsuarioDto.direccion,
          pais: createUsuarioDto.pais,
          departamento: createUsuarioDto.departamento,
          provincia: createUsuarioDto.provincia,
          distrito: createUsuarioDto.distrito,
          // Contacto
          telefono: createUsuarioDto.telefono,
          email: createUsuarioDto.email,
          // Autenticación
          password: hashedPassword,
          token_verificacion_email: verificationToken,
          token_expiry_email: new Date(Date.now() + 86400000),
        })

      // Enviar correo de verificación
      const verificationLink = `${envs.baseFrontendUrl}/${envs.verifyEmailPath}${verificationToken}`;
      // Usar el servicio de correo
      const emailMessage = await this.emailService.sendVerificationEmail(createUsuarioDto.email, verificationLink);
      //Enviar correo de credenciales de usuario
      const usuarioCredentialMessage = await this.emailService.sendUsuarioCredentials(createUsuarioDto.email, createUsuarioDto.numero_documento, nombreCompleto);
      return {
        message: "usuario creado correctamente",
        alerts: {
          email: emailMessage,
          usuario: usuarioCredentialMessage
        }
      }

    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(`Tenemos problemas para crear el usuario: ${error}`);
    }

  }

  async updateUsuario(id: number, updateUsuarioDto: UpdateUsuarioDto, empresaId: number, fotoUsuario: Express.Multer.File) {

    try {

      await this.findUniqueUsuario(id, true)

      await this.validarUniqueService.validarDatosUnicos({
        dto: updateUsuarioDto,
        table: UsuarioTable,
        idColumn: UsuarioTable.id,
        uniqueFields: [
          { field: "numero_documento", column: UsuarioTable.numero_documento },
          { field: "email", column: UsuarioTable.email }
        ],
        id: id
      })

      const responseFile = await this.cloudinaryService.uploadFile(fotoUsuario)

      await this.db
        .update(UsuarioTable)
        .set({
          // Datos básicos (solo los que vienen en updateUsuarioDto)
          nombre: updateUsuarioDto.nombre,
          apellido: updateUsuarioDto.apellido,
          tipo_documento: updateUsuarioDto.tipo_documento,
          numero_documento: updateUsuarioDto.numero_documento,
          // Fechas convertidas a string (si existen en el DTO)
          fecha_nacimiento: updateUsuarioDto.fecha_nacimiento
            ? updateUsuarioDto.fecha_nacimiento.toISOString().split('T')[0]
            : undefined,
          fecha_ingreso: updateUsuarioDto.fecha_ingreso
            ? updateUsuarioDto.fecha_ingreso.toISOString().split('T')[0]
            : undefined,
          // Ubicación
          direccion: updateUsuarioDto.direccion,
          pais: updateUsuarioDto.pais,
          departamento: updateUsuarioDto.departamento,
          provincia: updateUsuarioDto.provincia,
          distrito: updateUsuarioDto.distrito,
          // Contacto
          telefono: updateUsuarioDto.telefono,
          email: updateUsuarioDto.email,
          // Relaciones
          empresa_id: empresaId,
          rol_id: updateUsuarioDto.rol_id,
          // Imagen
          tipo_imagen: fotoUsuario.mimetype as "png" | "jpg",
          url_imagen: responseFile.secure_url,
        })
        .where(eq(UsuarioTable.id, id))

      return { message: "Usuario actualizado correctamente" }

    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(error)
    }

  }

  async updatePasswordProfile(usuarioId: number, updatePasswordDto: UpdatePasswordDto) {

    try {

      await this.findUniqueUsuario(usuarioId, true)

      // Hashear la nueva contraseña
      const hashedPassword = await bcrypt.hash(updatePasswordDto.password, 10);

      const [updatePassword] = await this.db
        .update(UsuarioTable)
        .set({
          password: hashedPassword
        })
        .where(
          eq(UsuarioTable.id, usuarioId)
        )
        .returning()

      return updatePassword

    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(error)
    }

  }

  async restaurarUsuario(id: number) {
    try {

      await this.findUniqueUsuario(id, false)

      await this.db
        .update(UsuarioTable)
        .set({
          estado_registro: true
        })
        .where(
          eq(UsuarioTable.id, id)
        )

      return {
        message: `Se restauro el usuario con id ${id} de manera correcta`
      }

    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(error)
    }
  }

  async remove(id: number) {
    try {

      await this.findUniqueUsuario(id, true)

      await this.db
        .update(UsuarioTable)
        .set({
          estado_registro: false
        })
        .where(
          eq(UsuarioTable.id, id)
        )

      return {
        message: `Se elimino el usuario con id ${id} de manera correcta`
      }

    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(error)
    }
  }

}
