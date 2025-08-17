import { IsString, IsOptional, IsNumber, IsArray, IsDateString, ValidateNested, Min, Max } from "class-validator";
import { Type } from "class-transformer";

export class CreateBudgetItemDto {
  @IsNumber()
  treatmentId: number;

  @IsString()
  treatmentName: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  unitPrice: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  discount: number;

  @IsNumber()
  @Min(0)
  total: number;
}

export class CreateBudgetDto {
  @IsNumber()
  patientId: number;

  @IsNumber()
  doctorId: number;

  @IsNumber()
  clinicId: number;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBudgetItemDto)
  items: CreateBudgetItemDto[];

  @IsDateString()
  validUntil: string;

  @IsOptional()
  @IsString()
  notes?: string;

  // Descuentos globales
  @IsOptional()
  @IsString()
  couponCode?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  couponDiscount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  globalDiscount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  finalTotal?: number;
}
