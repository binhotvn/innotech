import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { AppInfo } from './app/app.info';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  Logger.log(`Starting ${AppInfo.name} Services....`, 'Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: AppInfo.appVersion,
  });
  Logger.log(`Starting at port ${process.env.PORT}`, 'Bootstrap');

  const config = new DocumentBuilder()
    .setTitle(AppInfo.name)
    .setDescription(AppInfo.description)
    .setVersion(AppInfo.version)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  Logger.log(
    `Location of public path ${join(__dirname, '../', 'public')}`,
    'Bootstrap',
  );
  app.use('/public', express.static(join(__dirname, '../', 'public')));

  await app.listen(process.env.PORT || 3001);
}
bootstrap();
