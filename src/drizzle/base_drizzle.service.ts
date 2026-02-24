import { Injectable } from "@nestjs/common"
import { DrizzleService } from "./drizzle.service"
import { NodePgDatabase } from "drizzle-orm/node-postgres"

@Injectable()
export class BaseDrizzleService {
  protected db: NodePgDatabase

  constructor(drizzleService: DrizzleService) {
    this.db = drizzleService.getDb()
  }
}