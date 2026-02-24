import { ConflictException, Injectable } from "@nestjs/common";
import { and, eq, ne } from "drizzle-orm";
import { BaseDrizzleService } from "src/drizzle/base_drizzle.service";
import { DrizzleService } from "src/drizzle/drizzle.service";

@Injectable()
export class ValidarUniqueService extends BaseDrizzleService{

  constructor(
    drizzleService: DrizzleService
  ) {
    super(drizzleService)
   }

  async validarDatosUnicos({
    dto,
    table,
    idColumn,
    uniqueFields,
    id
  }: {
    dto: any,
    table: any,
    idColumn: any,
    uniqueFields: { field: string, column: any }[]
    id?: number
  }) {

    const resultados = await Promise.all(
      uniqueFields.map(async ({ field, column }) => {
        const valor = dto[field]

        if (valor === undefined || valor === null) return null

        const [existe] = await this.db.select().from(table)
          .where(
            id
              ? and(
                eq(column, valor),
                ne(idColumn, id)
              )
              : eq(column, valor)
          )
          .limit(1)

        return existe ? `${field} ya fue registrado` : null
      })
    )

    const errores = resultados.filter((errorMessage) : errorMessage is string => errorMessage !== null)

    if (errores.length > 0) {
      throw new ConflictException({
        message: "Datos duplicados",
        errors: errores
      });
    }

  }
}