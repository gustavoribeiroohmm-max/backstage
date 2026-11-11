import { Module } from '@nestjs/common';
import { OportunidadeController } from './controller/oportunidade.controller';
import { OportunidadeService } from './service/oportunidade.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [OportunidadeController],
  providers: [OportunidadeService],
  exports: [OportunidadeService],
})
export class OportunidadeModule {}