import { config } from "dotenv";
import { AppDataSource } from "../data-source";
import { seedAppointments } from "./appointment.seeder";

// Cargar variables de entorno
config();

async function runSeeders() {
  try {
    // Inicializar conexión a la base de datos
    await AppDataSource.initialize();
    console.log("📦 Conexión a la base de datos establecida");

    // Ejecutar seeders disponibles
    console.log("🌱 Iniciando seeders...");

    // Por ahora solo ejecutamos el seeder de appointments que existe
    await seedAppointments(AppDataSource);

    console.log("✅ Todos los seeders completados exitosamente");
  } catch (error) {
    console.error("❌ Error ejecutando seeders:", error);
    process.exit(1);
  } finally {
    // Cerrar conexión
    await AppDataSource.destroy();
    console.log("🔌 Conexión a la base de datos cerrada");
    process.exit(0);
  }
}

// Ejecutar seeders
void runSeeders();
