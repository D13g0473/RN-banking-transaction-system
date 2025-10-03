import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for WebSocket connections
  app.enableCors({
    origin: true, // Allow all origins
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const port = process.env.PORT ?? 8080;
  await app.listen(port);
  console.log(`Gateway service listening on port ${port}`);
}
bootstrap();
