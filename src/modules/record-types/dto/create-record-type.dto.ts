import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
} from "class-validator";

export class CreateRecordTypeDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  requiresTeeth?: boolean;

  @IsOptional()
  @IsBoolean()
  allowsOdontogram?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requiredFields?: string[];
}
