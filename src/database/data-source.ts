import { DataSource } from "typeorm";
import { config } from "dotenv";

// Cargar variables de entorno
config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_DATABASE || "multiclinica",
  synchronize: false, // Desactivar sincronización automática para evitar problemas con cambios de esquema
  logging: process.env.NODE_ENV === "development",
  entities: [
    "src/modules/**/entities/*.entity.ts",
    "src/common/entities/*.entity.ts",
  ],
  migrations: ["src/database/migrations/*.ts"],
  subscribers: ["src/database/subscribers/*.ts"],
});
