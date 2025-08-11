import { PartialType } from "@nestjs/swagger";
import { CreatePatientNoteDto } from "./create-patient-note.dto";
import { OmitType } from "@nestjs/swagger";

export class UpdatePatientNoteDto extends PartialType(
  OmitType(CreatePatientNoteDto, ["patientId"] as const),
) {}
