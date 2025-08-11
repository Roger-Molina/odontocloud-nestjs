import { PartialType } from "@nestjs/mapped-types";
import { CreatePatientDocumentDto } from "./create-patient-document.dto";

export class UpdatePatientDocumentDto extends PartialType(
  CreatePatientDocumentDto,
) {}
