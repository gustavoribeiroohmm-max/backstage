import { Module } from '@nestjs/common';
import { BandaController } from './controller/banda.controller';
import { BandaService } from './service/banda.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BandaController],
  providers: [BandaService],
  exports: [BandaService],
})
export class BandaModule {}