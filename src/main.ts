import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { StorageConfig } from 'config/storage.config';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(StorageConfig.image.destination, {
    prefix: StorageConfig.image.urlPrefix,
  });

  app.use('/webhook/stripe', express.raw({ type: 'application/json' }));

  app.enableCors();
 
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
