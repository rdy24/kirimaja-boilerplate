import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodValidationPipe } from './common/pipes/zod.validation.pipe';
import { ResponseTransformInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ZodValidationPipe());
    app.useGlobalInterceptors(new ResponseTransformInterceptor());
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
