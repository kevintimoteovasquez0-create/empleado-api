import * as bcrypt from 'bcryptjs';
import { RolTable } from '../schema/rol';
import { EmpresaTable } from '../schema/empresa';
import { AccesoTable } from '../schema/acceso';
import { Rol_Acceso_Table } from '../schema/rol_acceso';
import { TipoImagenEnum, UsuarioTable } from '../schema/usuario';
import { DrizzleService } from '../drizzle.service';
import { AreaTable } from '../schema/area';
import { eq } from 'drizzle-orm';
import { EmpleadoTable } from '../schema/empleado';

async function main() {

  const drizzleService = new DrizzleService();
  await drizzleService.onModuleInit();
  const db = drizzleService.getDb();

  try {

    const adminRoleInsert = await db.insert(RolTable).values({
      nombre: "GERENTE 1",
      descripcion: "ES GERENTE 1"
    }).returning();
    const adminRole = adminRoleInsert[0];

    const adminRoleSegundoInsert = await db.insert(RolTable).values({
      nombre: "GERENTE 2",
      descripcion: "ES GERENTE 2"
    }).returning();
    const adminRoleSegundo = adminRoleSegundoInsert[0];

    const rolPracticanteInsert = await db.insert(RolTable).values({
      nombre: "PRACTICANTE",
      descripcion: "Es practicante"
    }).returning();
    const rolPracticante = rolPracticanteInsert[0];

    const rolSupervisorInsert = await db.insert(RolTable).values({
      nombre: "SUPERVISOR",
      descripcion: "Es supervisor"
    }).returning();
    const rolSupervisor = rolSupervisorInsert[0];

    const areaRRHHInsert = await db.insert(AreaTable).values({
      nombre: 'RRHH',
      descripcion: 'Área de Recursos Humanos',
      responsable_id: null
    }).returning();
    const areaRRHH = areaRRHHInsert[0];

    const areaTecnologiaInsert = await db.insert(AreaTable).values({
      nombre: 'Tecnología',
      descripcion: 'Área de Tecnología',
      responsable_id: null
    }).returning();
    const areaTecnologia = areaTecnologiaInsert[0];

    const empresaInsert = await db.insert(EmpresaTable).values({
      razon_social: "Empresa de carnes",
      ruc: "12345678911"
    }).returning();
    const empresa = empresaInsert[0];

    const areaTrabajoInsert = await db.insert(AreaTable).values({
      nombre: 'Gerente General',
      descripcion: 'Es gerente general',
      responsable_id: null
    }).returning();
    const responseAreaTrabajo = areaTrabajoInsert[0];

    await db.insert(AccesoTable).values([
      { path: "local", descripcion: "1" },
      { path: "proveedor", descripcion: "1" },
      { path: "producto", descripcion: "1" },
      { path: "insumo", descripcion: "1" },
      { path: "insumo_extra", descripcion: "1" },
      { path: "empleado", descripcion: "1" },
      { path: "pedido", descripcion: "1" },
      { path: "delivery", descripcion: "1" },
      { path: "estadisticas", descripcion: "1" },
    ]);

    const accesos = await db.select().from(AccesoTable);

    await db.insert(Rol_Acceso_Table).values(
      accesos.map((acceso) => ({
        rol_id: adminRole.id,
        acceso_id: acceso.id,
      }))
    );

    await db.insert(Rol_Acceso_Table).values(
      accesos.map((acceso) => ({
        rol_id: adminRoleSegundo.id,
        acceso_id: acceso.id,
      }))
    );

    const hashedPassword = await bcrypt.hash('Prueb@123', 10);

    const usuarioData = {
      nombre: 'usuario',
      apellido: 'apellidousuario',
      tipo_documento: "DNI" as const,
      numero_documento: '78945612',
      fecha_nacimiento: new Date('1990-01-01').toISOString(),
      fecha_ingreso: new Date().toISOString(),
      direccion: 'Av. Siempre Viva 742',
      pais: 'Perú',
      departamento: 'Lima',
      provincia: 'Lima',
      distrito: 'Miraflores',
      telefono: '987654321',
      email: 'empresoftperu@gmail.com',
      password: hashedPassword,
      rol_id: adminRole.id,
      empresa_id: empresa.id,
      area_id: responseAreaTrabajo.id,
      tipo_imagen: "jpg" as const,
      url_imagen: 'empresoft.jpg',
      verificado_email: true,
    };

    const usuarioDataDos = {
      nombre: 'Carlos',
      apellido: 'Ramírez Torres',
      tipo_documento: "DNI" as const,
      numero_documento: '45612378',
      fecha_nacimiento: new Date('1992-06-15').toISOString(),
      fecha_ingreso: new Date().toISOString(),
      direccion: 'Calle Los Olivos 123',
      pais: 'Perú',
      departamento: 'Lima',
      provincia: 'Lima',
      distrito: 'San Isidro',
      telefono: '956123789',
      email: 'leonsaavedrajosefabian573@gmail.com',
      password: hashedPassword,
      rol_id: adminRoleSegundo.id,
      empresa_id: empresa.id,
      area_id: responseAreaTrabajo.id,
      tipo_imagen: "jpg" as const,
      url_imagen: 'empresoft.jpg',
      verificado_email: true,
    };

    const adminUserInsert = await db.insert(UsuarioTable).values(usuarioData).returning();
    const usuarioAdmin = adminUserInsert[0];
    await db.insert(UsuarioTable).values(usuarioDataDos);

    const areaUpdateInsert = await db.update(AreaTable)
      .set({ responsable_id: usuarioAdmin.id })
      .where(eq(AreaTable.id, responseAreaTrabajo.id)).returning();
    const area = areaUpdateInsert[0];

    await db.insert(EmpleadoTable).values({
      usuario_id: usuarioAdmin.id,
      area_id: area.id,
      nombres: 'Juan Carlos',
      apellidos: 'Pérez Gómez',
      tipo_documento: 'dni',
      numero_documento: '87654321',
      cargo: 'Administrador',
      tipo_personal: 'PLANILLA',
      fecha_ingreso: new Date(),
      fecha_nacimiento: new Date('1990-05-10'),
      telefono: '987654321',
      email_corporativo: 'juan.perez@empresa.com',
      direccion: 'Av. Principal 123',
      distrito: 'Miraflores',
      auditoria_progreso: null,
      estado_legajo: 'pendiente',
    });

    const usuarioRRHH = {
      nombre: 'Ana',
      apellido: 'García López',
      tipo_documento: "DNI" as const,
      numero_documento: '12345679',
      fecha_nacimiento: new Date('1995-03-20').toISOString(),
      fecha_ingreso: new Date().toISOString(),
      direccion: 'Av. Los Pinos 456',
      pais: 'Perú',
      departamento: 'Lima',
      provincia: 'Lima',
      distrito: 'Surco',
      telefono: '912345678',
      email: 'ana.garcia@empresa.com',
      password: hashedPassword,
      rol_id: rolSupervisor.id,
      empresa_id: empresa.id,
      area_id: areaRRHH.id,
      tipo_imagen: "jpg" as const,
      url_imagen: 'empresoft.jpg',
      verificado_email: true,
    };

    const usuarioTecnologia = {
      nombre: 'Pedro',
      apellido: 'Flores Ríos',
      tipo_documento: "DNI" as const,
      numero_documento: '98765431',
      fecha_nacimiento: new Date('1993-08-10').toISOString(),
      fecha_ingreso: new Date().toISOString(),
      direccion: 'Calle Las Flores 789',
      pais: 'Perú',
      departamento: 'Lima',
      provincia: 'Lima',
      distrito: 'San Borja',
      telefono: '923456789',
      email: 'pedro.flores@empresa.com',
      password: hashedPassword,
      rol_id: rolPracticante.id,
      empresa_id: empresa.id,
      area_id: areaTecnologia.id,
      tipo_imagen: "jpg" as const,
      url_imagen: 'empresoft.jpg',
      verificado_email: true,
    };

    const usuarioRRHHInsert = await db.insert(UsuarioTable).values(usuarioRRHH).returning();
    const usuarioRRHHResponse = usuarioRRHHInsert[0];
    const usuarioTecnologiaInsert = await db.insert(UsuarioTable).values(usuarioTecnologia).returning();
    const usuarioTecnologiaResponse = usuarioTecnologiaInsert[0];

    await db.update(AreaTable)
      .set({ responsable_id: usuarioRRHHResponse.id })
      .where(eq(AreaTable.id, areaRRHH.id));

    await db.update(AreaTable)
      .set({ responsable_id: usuarioTecnologiaResponse.id })
      .where(eq(AreaTable.id, areaTecnologia.id));

    console.log('Seeders insertados correctamente.');
  } catch (err) {
    console.error('Error al insertar seeders:', err);
  } finally {
    try {
      await drizzleService.onModuleDestroy();
      console.log('Conexión cerrada correctamente.');
    } catch (err) {
      console.warn('Error al cerrar la base de datos (ignorado):', err);
    }
  }

}

// Ejecutar seed
main();