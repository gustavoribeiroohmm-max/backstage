import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { PerfilModule } from './perfil/perfil.module';
import { BandaModule } from './banda/banda.module';
import { OportunidadeModule } from './oportunidade/oportunidade.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    PerfilModule,
    BandaModule,
    OportunidadeModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}