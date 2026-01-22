import { Module } from '@nestjs/common';
import { ConvocatoriaService } from './convocatoria.service';
import { ConvocatoriaController } from './convocatoria.controller';
import { DrizzleModule } from 'src/drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  controllers: [ConvocatoriaController],
  providers: [ConvocatoriaService],
})
export class ConvocatoriaModule {}
