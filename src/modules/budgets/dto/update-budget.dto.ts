import { PartialType } from "@nestjs/mapped-types";
import { IsEnum, IsOptional } from "class-validator";
import { CreateBudgetDto } from "./create-budget.dto";
import { BudgetStatus } from "../budget.entity";

export class UpdateBudgetDto extends PartialType(CreateBudgetDto) {
  @IsOptional()
  @IsEnum(BudgetStatus)
  status?: BudgetStatus;
}
