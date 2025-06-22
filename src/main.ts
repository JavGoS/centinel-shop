import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
    .setTitle('Data-Sentinel Backend')
    .setDescription('Jwt configuration example with NestJS')
    .setVersion('1.0')
    .addTag('JWT')
    .build();
  
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);
  SwaggerModule.setup('swagger', app, documentFactory, {
    
  jsonDocumentUrl: 'swagger/json',
});
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
