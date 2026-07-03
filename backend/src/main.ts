import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const origins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : [ "http://127.254.99.100", "https://helicorp-landingpage-test-woad.vercel.app" ];

  app.enableCors({
    origin: origins,
    credentials: true,
  });

  app.setGlobalPrefix('api');
  
 
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,           
    forbidNonWhitelisted: true,
    transform: true            
  }));

  await app.listen(process.env.PORT || 3000);
}
bootstrap();