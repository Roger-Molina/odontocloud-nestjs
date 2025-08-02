import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  Min,
} from "class-validator";

export class CreateItemCategoryDto {
  @IsString()
  categoryCode: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  parentId?: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  sortOrder?: number;
}
