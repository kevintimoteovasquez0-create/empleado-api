import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { AreaTrabajoTable } from 'src/drizzle/schema/areaTrabajo';

@Injectable()
export class AreaService {

  constructor(private readonly drizzleService: DrizzleService) { }

  private get db() {
    return this.drizzleService.getDb();
  }

  async findAllAreas() {
    try {

      const areas = await this.db
        .select()
        .from(AreaTrabajoTable);

      return { 
        data: areas
      };

    } catch (error) {
      throw new InternalServerErrorException(
        `Ocurrió un error con el sistema: ${error}`,
      );
    }
  }
  
}
