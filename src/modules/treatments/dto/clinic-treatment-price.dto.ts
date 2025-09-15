import { IsNumber, IsOptional, IsString, IsBoolean, IsDateString } from "class-validator";

export class CreateClinicTreatmentPriceDto {
  @IsNumber()
  clinicId: number;

  @IsNumber()
  treatmentId: number;

  @IsNumber()
  basePrice: number;

  @IsOptional()
  @IsNumber()
  insurancePrice?: number;

  @IsOptional()
  @IsNumber()
  promotionalPrice?: number;

  @IsOptional()
  @IsDateString()
  promotionalStartDate?: string;

  @IsOptional()
  @IsDateString()
  promotionalEndDate?: string;

  @IsOptional()
  @IsNumber()
  minDurationMinutes?: number;

  @IsOptional()
  @IsNumber()
  maxDurationMinutes?: number;

  @IsOptional()
  @IsNumber()
  costPerSession?: number;

  @IsOptional()
  @IsNumber()
  estimatedSessions?: number;

  @IsOptional()
  @IsBoolean()
  requiresAnesthesia?: boolean;

  @IsOptional()
  @IsNumber()
  anesthesiaCost?: number;

  @IsOptional()
  @IsNumber()
  materialCost?: number;

  @IsDateString()
  effectiveFrom: string;

  @IsOptional()
  @IsDateString()
  effectiveUntil?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateClinicTreatmentPriceDto {
  @IsOptional()
  @IsNumber()
  basePrice?: number;

  @IsOptional()
  @IsNumber()
  insurancePrice?: number;

  @IsOptional()
  @IsNumber()
  promotionalPrice?: number;

  @IsOptional()
  @IsDateString()
  promotionalStartDate?: string;

  @IsOptional()
  @IsDateString()
  promotionalEndDate?: string;

  @IsOptional()
  @IsNumber()
  minDurationMinutes?: number;

  @IsOptional()
  @IsNumber()
  maxDurationMinutes?: number;

  @IsOptional()
  @IsNumber()
  costPerSession?: number;

  @IsOptional()
  @IsNumber()
  estimatedSessions?: number;

  @IsOptional()
  @IsBoolean()
  requiresAnesthesia?: boolean;

  @IsOptional()
  @IsNumber()
  anesthesiaCost?: number;

  @IsOptional()
  @IsNumber()
  materialCost?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsDateString()
  effectiveFrom?: string;

  @IsOptional()
  @IsDateString()
  effectiveUntil?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class SyncOdontogramDto {
  @IsNumber()
  toothRecordId: number;

  @IsNumber()
  budgetId: number;
}

export class SyncBudgetToInvoiceDto {
  @IsNumber()
  budgetItemId: number;

  @IsNumber()
  invoiceId: number;
}
