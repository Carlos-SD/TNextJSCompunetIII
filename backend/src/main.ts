import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Health check endpoint for Render (before global prefix)
  app.getHttpAdapter().get('/', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });
  
  const allowedOrigins = [
    'http://localhost:3001',
    'http://localhost:3000',
    'https://t-next-js-compunet-iii.vercel.app',
  ];

  // Agregar URL del frontend desde variable de entorno si existe
  if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
  }

  // Configurar CORS
  app.enableCors({
    origin: (origin, callback) => {
      // Permitir requests sin origin (como Postman, mobile apps, etc.)
      if (!origin) return callback(null, true);
      
      // Permitir si está en la lista de orígenes permitidos
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      // Permitir todos los dominios de Vercel (preview deployments, etc.)
      if (origin.includes('.vercel.app')) {
        return callback(null, true);
      }
      
      // En desarrollo, permitir todos los orígenes
      if (process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      
      // En producción, rechazar orígenes no permitidos
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  app.setGlobalPrefix('api');
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Betting System API')
    .setDescription('Sistema de gestión de apuestas - Backend API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingrese el token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: http://0.0.0.0:${port}/api`);
  console.log(`Swagger documentation: http://0.0.0.0:${port}/docs`);
}
bootstrap();
