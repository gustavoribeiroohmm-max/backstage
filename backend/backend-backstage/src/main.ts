import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades que não estão no DTO (segurança extra)
      forbidNonWhitelisted: true, // Retorna erro caso enviem propriedades desconhecidas
      transform: true, // Transforma os payloads automaticamente para os tipos dos DTOs
    }),
  );
  
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
