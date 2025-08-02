import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsPositive,
  Min,
  IsBoolean,
} from "class-validator";
import { ItemStatus } from "../entities/inventory.entity";

export class CreateInventoryItemDto {
  @IsString()
  itemCode: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  category: string; // Usar string simple por compatibilidad

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  manufacturer?: string;

  @IsString()
  unitOfMeasure: string;

  @IsNumber()
  @IsPositive()
  unitCost: number;

  @IsNumber()
  @IsPositive()
  sellingPrice: number;

  @IsNumber()
  @Min(0)
  currentStock: number;

  @IsNumber()
  @Min(0)
  minimumStock: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maximumStock?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  reorderPoint?: number;

  @IsOptional()
  @IsEnum(ItemStatus)
  status?: ItemStatus;

  @IsOptional()
  @IsString()
  storageLocation?: string;

  @IsOptional()
  @IsBoolean()
  requiresPrescription?: boolean;

  // Nuevos campos opcionales
  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @IsOptional()
  @IsNumber()
  defaultSupplierId?: number;

  @IsOptional()
  @IsBoolean()
  requiresBatchControl?: boolean;

  @IsOptional()
  @IsBoolean()
  autoReorder?: boolean;
}
