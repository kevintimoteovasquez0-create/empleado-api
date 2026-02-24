import { Module } from "@nestjs/common";
import { DrizzleModule } from "src/drizzle/drizzle.module";
import { ValidarUniqueService } from "./validar_unique.service";

@Module({
  imports: [DrizzleModule],
  providers: [ValidarUniqueService],
  exports: [ValidarUniqueService]
})
export class CommonModule{}