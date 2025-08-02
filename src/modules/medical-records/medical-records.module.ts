import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MedicalRecord } from "./entities/medical-record.entity";
import { Doctor } from "../doctors/entities/doctor.entity";
import { Treatment } from "../treatments/entities/treatment.entity";
import { Diagnosis } from "../diagnoses/entities/diagnosis.entity";
import { MedicalRecordsService } from "./medical-records.service";
import { MedicalRecordsController } from "./medical-records.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([MedicalRecord, Doctor, Treatment, Diagnosis]),
  ],
  providers: [MedicalRecordsService],
  controllers: [MedicalRecordsController],
  exports: [MedicalRecordsService],
})
export class MedicalRecordsModule {}
