import "reflect-metadata";
import { NestFactory, Reflector } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as bodyParser from "body-parser";
import * as multer from "multer";
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

  // Configure body parser limits for file uploads
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

  // Configure multer for handling multipart/form-data
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const upload = multer({
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB limit
    },
    storage: multer.memoryStorage(), // Store files in memory for processing
  });

  // Enable CORS with more specific configuration for file uploads
  app.enableCors({
    origin: "*", // Permite cualquier origen
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
      "Cache-Control",
    ],
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
