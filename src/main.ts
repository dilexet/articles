import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './modules';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const config: ConfigService = app.get(ConfigService);

    const host = config.get<string>('APP_HOST');
    const port = config.get<number>('APP_PORT');

    if (!host || !port) {
        throw new Error('Project config is not set');
    }

    const swaggerPath = config.get<string>('SWAGGER_PATH');
    const swaggerTitle = config.get<string>('SWAGGER_TITLE');
    const swaggerDescription = config.get<string>('SWAGGER_DESCRIPTION');
    const swaggerVersion = config.get<string>('SWAGGER_VERSION');

    if (!swaggerPath || !swaggerTitle || !swaggerDescription || !swaggerVersion) {
        throw new Error('Swagger config is not set');
    }

    const swaggerConfig = new DocumentBuilder()
        .setTitle(swaggerTitle)
        .setDescription(swaggerDescription)
        .setVersion(swaggerVersion)
        .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(swaggerPath, app, document);

    app.use(cookieParser());
    await app.listen(port, () => {
        console.log(`Server started on http://${host}:${port}/${swaggerPath}`);
    });
}

bootstrap().catch(console.error);
