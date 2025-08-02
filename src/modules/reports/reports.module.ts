import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReportsController } from "./reports.controller";
import { ReportsService } from "./reports.service";
import { Doctor } from "../doctors/entities/doctor.entity";
import { Appointment } from "../appointments/entities/appointment.entity";
import { Invoice } from "../billing/entities/billing.entity";
import { Patient } from "../patients/entities/patient.entity";
import { Clinic } from "../clinics/entities/clinic.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Doctor,
      Appointment,
      Invoice,
      Patient,
      Clinic,
    ]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
