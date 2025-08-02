import { DataSource } from "typeorm";
import * as bcrypt from "bcryptjs";
import {
  User,
  UserRole,
  UserStatus,
} from "../../modules/users/entities/user.entity";
import {
  Clinic,
  ClinicStatus,
} from "../../modules/clinics/entities/clinic.entity";

export async function seedUsers(dataSource: DataSource): Promise<void> {
  const userRepository = dataSource.getRepository(User);
  const clinicRepository = dataSource.getRepository(Clinic);

  console.log("🌱 Seeding users...");

  // Verificar si ya existen usuarios
  const existingUsers = await userRepository.count();
  if (existingUsers > 0) {
    console.log("✅ Users already exist, skipping seed");
    return;
  }

  // Buscar clínicas existentes
  let clinics = await clinicRepository.find();
  if (clinics.length === 0) {
    console.log("⚠️ No clinics found, creating a default clinic first");

    const defaultClinic = clinicRepository.create({
      name: "Clínica Principal",
      address: "Av. Principal 123",
      city: "Quito",
      state: "Pichincha",
      postalCode: "170101",
      country: "Ecuador",
      phoneNumber: "02-2345678",
      email: "info@clinicaprincipal.com",
      status: ClinicStatus.ACTIVE,
    });

    const savedClinic = await clinicRepository.save(defaultClinic);
    clinics = [savedClinic];
  }

  const firstClinic = clinics[0];

  // Hash de contraseña por defecto
  const defaultPassword = await bcrypt.hash("password123", 10);

  // Crear usuarios de prueba
  const users = [
    {
      email: "admin@multiclinica.com",
      password: defaultPassword,
      firstName: "Admin",
      lastName: "Sistema",
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      clinicId: firstClinic.id,
    },
    {
      email: "doctor@multiclinica.com",
      password: defaultPassword,
      firstName: "Dr. Carlos",
      lastName: "González",
      role: UserRole.DOCTOR,
      status: UserStatus.ACTIVE,
      clinicId: firstClinic.id,
    },
    {
      email: "recepcion@multiclinica.com",
      password: defaultPassword,
      firstName: "María",
      lastName: "Pérez",
      role: UserRole.RECEPTIONIST,
      status: UserStatus.ACTIVE,
      clinicId: firstClinic.id,
    },
    {
      email: "superadmin@multiclinica.com",
      password: defaultPassword,
      firstName: "Super",
      lastName: "Admin",
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      clinicId: undefined,
    },
  ];

  for (const userData of users) {
    const user = userRepository.create(userData);
    await userRepository.save(user);
    console.log(`✅ Created user: ${user.email} (${user.role})`);
  }

  console.log("🌱 Users seeded successfully!");
  console.log("");
  console.log("📋 Test Credentials:");
  console.log("Admin: admin@multiclinica.com / password123");
  console.log("Doctor: doctor@multiclinica.com / password123");
  console.log("Receptionist: recepcion@multiclinica.com / password123");
  console.log("Super Admin: superadmin@multiclinica.com / password123");
}
