import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Main');
  logger.log('Logger inicializado');
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableCors({
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', 
  });
  await app.listen(envs.port);
  logger.log(`App is running and listening on port ${envs.port}`)
}
bootstrap();