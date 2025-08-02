import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PatientsService } from "./patients.service";
import { PatientsController } from "./patients.controller";
import { Patient } from "./entities/patient.entity";
import { PatientClinic } from "./entities/patient-clinic.entity";
import { DocumentType } from "./entities/document-type.entity";
import { DocumentTypesService } from "./services/document-types.service";
import { DocumentTypesController } from "./controllers/document-types.controller";
import { BloodType } from "./entities/blood-type.entity";
import { BloodTypesService } from "./services/blood-types.service";
import { BloodTypesController } from "./controllers/blood-types.controller";
import { Allergy } from "./entities/allergy.entity";
import { AllergiesService } from "./services/allergies.service";
import { AllergiesController } from "./controllers/allergies.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Patient,
      PatientClinic,
      DocumentType,
      BloodType,
      Allergy,
    ]),
  ],
  providers: [
    PatientsService,
    DocumentTypesService,
    BloodTypesService,
    AllergiesService,
  ],
  controllers: [
    PatientsController,
    DocumentTypesController,
    BloodTypesController,
    AllergiesController,
  ],
  exports: [
    PatientsService,
    DocumentTypesService,
    BloodTypesService,
    AllergiesService,
  ],
})
export class PatientsModule {}
