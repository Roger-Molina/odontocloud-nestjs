import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsDate,
  IsBoolean,
  Min,
  Max,
} from "class-validator";
import { Type } from "class-transformer";
import { CouponType } from "../coupon.entity";

export class CreateCouponDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(CouponType)
  type: CouponType;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100) // Para porcentajes máximo 100%, para montos fijos se puede ajustar
  value: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  @Min(0)
  minimumAmount?: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  @Min(0)
  maximumDiscount?: number;

  @Type(() => Date)
  @IsDate()
  validFrom: Date;

  @Type(() => Date)
  @IsDate()
  validUntil: Date;

  @IsNumber()
  @IsOptional()
  @Min(0)
  usageLimit?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
