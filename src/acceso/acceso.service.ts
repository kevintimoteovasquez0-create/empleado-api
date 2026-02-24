import { Injectable } from '@nestjs/common';
import { BaseDrizzleService } from 'src/drizzle/base_drizzle.service';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { AccesoTable } from 'src/drizzle/schema/acceso';

@Injectable()
export class AccesoService extends BaseDrizzleService{

  constructor(
    drizzleService: DrizzleService
  ) {
    super(drizzleService)
   }

  async findAllAccesos() {
    const accesos = await this.db.select().from(AccesoTable);
    return { data: accesos };
  }
}
