"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const allowedOrigins = [
        'http://localhost:3001',
        'http://localhost:3000',
        'https://t-next-js-compunet-iii.vercel.app',
    ];
    if (process.env.FRONTEND_URL) {
        allowedOrigins.push(process.env.FRONTEND_URL);
    }
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin)
                return callback(null, true);
            if (origin.includes('.vercel.app')) {
                return callback(null, true);
            }
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            if (process.env.NODE_ENV !== 'production') {
                return callback(null, true);
            }
            return callback(null, true);
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        preflightContinue: false,
        optionsSuccessStatus: 204,
    });
    app.getHttpAdapter().get('/', (req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Betting System API')
        .setDescription('Sistema de gestión de apuestas - Backend API')
        .setVersion('1.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingrese el token JWT',
        in: 'header',
    }, 'JWT-auth')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document);
    const port = process.env.PORT ?? 3000;
    await app.listen(port, '0.0.0.0');
    console.log(`Application is running on: http://0.0.0.0:${port}/api`);
    console.log(`Swagger documentation: http://0.0.0.0:${port}/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map