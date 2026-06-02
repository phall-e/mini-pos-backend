import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  UnprocessableEntityException,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { setupSwagger } from './swagger';
import { HttpResponseInterceptor } from '@libs/common/http/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(process.env.API_PREFIX ?? 'api');
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        const formattedErrors = errors.map((err) => ({
          field: err.property,
          errors: Object.values(err.constraints ?? {}),
        }));

        return new UnprocessableEntityException({
          message: 'Unexceptable Entity',
          statusCode: 422,
          errors: formattedErrors,
        });
      },
    }),
  );
  setupSwagger(app);
  app.enableCors();
  app.useGlobalInterceptors(new HttpResponseInterceptor());

  const port = process.env.PORT ?? process.env.API_PORT ?? 8000;
  await app.listen(port);
}
void bootstrap();
