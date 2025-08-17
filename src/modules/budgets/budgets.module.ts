import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Budget } from "./budget.entity";
import { BudgetItem } from "./budget-item.entity";
import { BudgetService } from "./budget.service";
import { BudgetController } from "./budget.controller";
import { TreatmentsModule } from "../treatments/treatments.module";
import { CommonServicesModule } from "../../common/services/common-services.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Budget, BudgetItem]),
    TreatmentsModule,
    CommonServicesModule,
  ],
  providers: [BudgetService],
  controllers: [BudgetController],
  exports: [BudgetService],
})
export class BudgetsModule {}
