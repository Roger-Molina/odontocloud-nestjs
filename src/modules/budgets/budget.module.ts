import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BudgetService } from "./budget.service";
import { BudgetController } from "./budget.controller";
import { Budget } from "./budget.entity";
import { BudgetItem } from "./budget-item.entity";
import { CommonServicesModule } from "../../common/services/common-services.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Budget, BudgetItem]),
    CommonServicesModule,
  ],
  controllers: [BudgetController],
  providers: [BudgetService],
  exports: [BudgetService],
})
export class BudgetModule {}
