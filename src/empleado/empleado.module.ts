import { Module } from '@nestjs/common';
import { EmpleadoService } from './empleado.service';
import { EmpleadoController } from './empleado.controller';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [DrizzleModule, CommonModule],
  controllers: [EmpleadoController],
  providers: [EmpleadoService],
  exports: [EmpleadoService]
})
export class EmpleadoModule {}
