import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";

import { PatientsService } from "./patients.service";
import { PatientsController } from "./patients.controller";
import { Patient } from "./entities/patient.entity";
import { PatientClinic } from "./entities/patient-clinic.entity";
import { PatientNote } from "./entities/patient-note.entity";
import { PatientDocument } from "./entities/patient-document.entity";
import { DocumentType } from "./entities/document-type.entity";
import { DocumentTypesService } from "./services/document-types.service";
import { DocumentTypesController } from "./controllers/document-types.controller";
import { BloodType } from "./entities/blood-type.entity";
import { BloodTypesService } from "./services/blood-types.service";
import { BloodTypesController } from "./controllers/blood-types.controller";
import { Allergy } from "./entities/allergy.entity";
import { AllergiesService } from "./services/allergies.service";
import { AllergiesController } from "./controllers/allergies.controller";
import { PatientNotesService } from "./services/patient-notes.service";
import { PatientNotesController } from "./controllers/patient-notes.controller";
import { PatientDocumentsService } from "./services/patient-documents.service";
import { PatientDocumentsController } from "./controllers/patient-documents.controller";
import { PatientProfilePhotoService } from "./services/patient-profile-photo.service";
import { PatientProfilePhotoController } from "./controllers/patient-profile-photo.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Patient,
      PatientClinic,
      PatientNote,
      PatientDocument,
      DocumentType,
      BloodType,
      Allergy,
    ]),
    AuthModule, // Importar AuthModule para acceder a JwtService
  ],
  providers: [
    PatientsService,
    DocumentTypesService,
    BloodTypesService,
    AllergiesService,
    PatientNotesService,
    PatientDocumentsService,
    PatientProfilePhotoService,
  ],
  controllers: [
    PatientsController,
    DocumentTypesController,
    BloodTypesController,
    AllergiesController,
    PatientNotesController,
    PatientDocumentsController,
    PatientProfilePhotoController,
  ],
  exports: [
    PatientsService,
    DocumentTypesService,
    BloodTypesService,
    AllergiesService,
    PatientNotesService,
    PatientDocumentsService,
    PatientProfilePhotoService,
  ],
})
export class PatientsModule {}
