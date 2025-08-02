import "reflect-metadata";
import { NestFactory, Reflector } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
// Import class-validator to ensure it's loaded
//import 'class-validator';
import { AppModule } from "./app.module";
import { JwtAuthGuard } from "./modules/auth/guards/jwt-auth.guard";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Get configuration values
  const port = configService.get<number>("app.port")!;
  const apiPrefix = configService.get<string>("app.apiPrefix")!;
  const corsOrigin = configService.get<string>("app.corsOrigin")!;

  // Set global prefix
  app.setGlobalPrefix(apiPrefix);

  // Enable CORS
  app.enableCors({
    origin: "*", // Permite cualquier origen
    credentials: true,
  });

  // Global validation pipe with explicit options
  app.useGlobalPipes();

  // Global JWT guard
  //const reflector = app.get(Reflector);
  //app.useGlobalGuards(new JwtAuthGuard(reflector));

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle("Multiclinica API")
    .setDescription("Sistema de gestión para multiclinicas")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document);

  await app.listen(port);
  console.log(
    `🚀 Application is running on: http://localhost:${port}/${apiPrefix}`,
  );
  console.log(
    `📚 API Documentation: http://localhost:${port}/${apiPrefix}/docs`,
  );
}
void bootstrap();
