import {
  IsEnum,
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsObject,
  IsDateString,
} from "class-validator";
import {
  RecordTypeEnum,
  ToothCondition,
  ProcedureStatus,
} from "../entities/medical-record.entity";

export class CreateMedicalRecordDto {
  @IsEnum(RecordTypeEnum)
  type: RecordTypeEnum;

  @IsNumber()
  patientId: number;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  diagnosis?: string;

  @IsString()
  @IsOptional()
  treatment?: string;

  @IsString()
  @IsOptional()
  prescription?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsObject()
  @IsOptional()
  vitalSigns?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    weight?: number;
    height?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
    painLevel?: number;
    allergies?: string[];
  };

  @IsArray()
  @IsOptional()
  labResults?: {
    testName: string;
    result: string;
    normalRange: string;
    unit: string;
    date: Date;
    imageUrl?: string;
  }[];

  @IsArray()
  @IsOptional()
  attachments?: {
    filename: string;
    url: string;
    type: string;
    description?: string;
    uploadedAt: Date;
  }[];

  @IsDateString()
  @IsOptional()
  followUpDate?: Date;

  @IsArray()
  @IsOptional()
  toothNumbers?: string[];

  @IsArray()
  @IsOptional()
  toothSurfaces?: {
    toothNumber: string;
    surfaces: string[];
    condition: ToothCondition;
  }[];

  @IsArray()
  @IsOptional()
  odontogramData?: {
    toothNumber: string;
    procedures: {
      type: string;
      status: ProcedureStatus;
      date: Date;
      cost?: number;
      notes?: string;
    }[];
    conditions: {
      condition: ToothCondition;
      severity?: "mild" | "moderate" | "severe";
      notes?: string;
    }[];
  }[];

  @IsString()
  @IsOptional()
  procedureCode?: string;

  @IsEnum(ProcedureStatus)
  @IsOptional()
  procedureStatus?: ProcedureStatus;

  @IsNumber()
  @IsOptional()
  procedureCost?: number;

  @IsNumber()
  @IsOptional()
  procedureDuration?: number;

  @IsArray()
  @IsOptional()
  materialsUsed?: {
    name: string;
    quantity: number;
    unit: string;
    cost?: number;
  }[];

  @IsNumber()
  @IsOptional()
  doctorId?: number;

  @IsNumber()
  @IsOptional()
  appointmentId?: number;
}
