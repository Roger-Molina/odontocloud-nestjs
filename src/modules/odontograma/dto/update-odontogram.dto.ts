import { PartialType, OmitType } from "@nestjs/mapped-types";
import {
  CreateOdontogramDto,
  UniqueToothNumbersConstraint,
} from "./create-odontogram.dto";
import { IsOptional, IsArray, ValidateNested, Validate } from "class-validator";
import { Type } from "class-transformer";
import { ToothRecordDto } from "./create-odontogram.dto";

// Extender de CreateOdontogramDto pero hacer opcional el array de tooth records
export class UpdateOdontogramDto extends PartialType(
  OmitType(CreateOdontogramDto, ["toothRecords"] as const),
) {
  @IsOptional()
  @IsArray({ message: "Los registros de dientes deben ser un array" })
  @ValidateNested({ each: true })
  @Type(() => ToothRecordDto)
  @Validate(UniqueToothNumbersConstraint)
  toothRecords?: ToothRecordDto[];
}
