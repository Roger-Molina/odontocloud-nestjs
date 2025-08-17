import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

// Configuration imports
import appConfig from "./config/app.config";
import databaseConfig from "./config/database.config";
import jwtConfig from "./config/jwt.config";

// Module imports
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { ClinicsModule } from "./modules/clinics/clinics.module";
import { PatientsModule } from "./modules/patients/patients.module";
import { DoctorsModule } from "./modules/doctors/doctors.module";
import { AppointmentsModule } from "./modules/appointments/appointments.module";
import { MedicalRecordsModule } from "./modules/medical-records/medical-records.module";
import { BillingModule } from "./modules/billing/billing.module";
import { InventoryModule } from "./modules/inventory/inventory.module";
import { ReportsModule } from "./modules/reports/reports.module";
import { OdontogramaModule } from "./modules/odontograma/odontograma.module";
import { RecordTypesModule } from "./modules/record-types/record-types.module";
import { TreatmentsModule } from "./modules/treatments/treatments.module";
import { DiagnosesModule } from "./modules/diagnoses/diagnoses.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { BudgetsModule } from "./modules/budgets/budgets.module";
import { CouponModule } from "./modules/coupons/coupon.module";
 
@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig],
      envFilePath: [".env.local", ".env"],
    }),

    // Database
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get("database")!,
    }),

    // Feature modules
    AuthModule,
    UsersModule,
    ClinicsModule,
    PatientsModule,
    DoctorsModule,
    AppointmentsModule,
    MedicalRecordsModule,
    RecordTypesModule,
    TreatmentsModule,
    DiagnosesModule,
    BillingModule,
    BudgetsModule,
    CouponModule,
    InventoryModule,
    ReportsModule,
    OdontogramaModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
