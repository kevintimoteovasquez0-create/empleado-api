import { forwardRef, Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { FotoModule } from '../foto/foto.module';
import { EmailModule } from '../email/email.module';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { CommonModule } from 'src/common/common.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [DrizzleModule, CloudinaryModule, EmailModule, CommonModule],
  controllers: [UsuarioController],
  providers: [UsuarioService],
  exports: [UsuarioService],
})
export class UsuarioModule {}
