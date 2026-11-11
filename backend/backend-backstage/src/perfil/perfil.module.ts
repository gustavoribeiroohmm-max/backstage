import { Module } from '@nestjs/common';
import { PerfilController } from './controller/perfil.controller';
import { PerfilService } from './service/perfil.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PerfilController],
  providers: [PerfilService],
  exports: [PerfilService],
})
export class PerfilModule {}