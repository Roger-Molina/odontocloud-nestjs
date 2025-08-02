import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";
import { Appointment } from "../appointments/entities/appointment.entity";
import { Patient } from "../patients/entities/patient.entity";
import { MedicalRecord } from "../medical-records/entities/medical-record.entity";
import { User } from "../users/entities/user.entity";
import { Doctor } from "../doctors/entities/doctor.entity";
import { Clinic } from "../clinics/entities/clinic.entity";
import { OdontogramaModule } from "../odontograma/odontograma.module";
import { BillingModule } from "../billing/billing.module";
import { MedicalRecordsModule } from "../medical-records/medical-records.module";
import { AppointmentsModule } from "../appointments/appointments.module";
import { PatientsModule } from "../patients/patients.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Appointment,
      Patient,
      MedicalRecord,
      User,
      Doctor,
      Clinic,
    ]),
    OdontogramaModule,
    BillingModule,
    MedicalRecordsModule,
    AppointmentsModule,
    PatientsModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
