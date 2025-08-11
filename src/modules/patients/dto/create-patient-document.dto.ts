import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";
import { DocumentCategory } from "../entities/patient-document.entity";

export class CreatePatientDocumentDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  originalName: string;

  @IsEnum(DocumentCategory)
  @IsOptional()
  category?: DocumentCategory = DocumentCategory.OTHER;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  uploadedBy?: string;

  @IsNumber()
  patientId: number;

  @IsOptional()
  @IsNumber()
  clinicId?: number;
}
