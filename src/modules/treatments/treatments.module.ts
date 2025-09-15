import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Treatment } from "./entities/treatment.entity";
import { ClinicTreatmentPrice } from "./entities/clinic-treatment-price.entity";
import { TreatmentsService } from "./treatments.service";
import { TreatmentsController } from "./treatments.controller";
import { ClinicTreatmentPriceService } from "./services/clinic-treatment-price.service";
import { ClinicTreatmentPriceController } from "./controllers/clinic-treatment-price.controller";
import { OdontogramSyncService } from "./services/odontogram-sync.service";
import { BudgetItem } from "../budgets/budget-item.entity";
import { InvoiceItem } from "../billing/entities/billing.entity";
import { ToothRecord } from "../odontograma/entities/odontogram.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Treatment,
      ClinicTreatmentPrice,
      BudgetItem,
      InvoiceItem,
      ToothRecord,
    ]),
  ],
  providers: [TreatmentsService, ClinicTreatmentPriceService, OdontogramSyncService],
  controllers: [TreatmentsController, ClinicTreatmentPriceController],
  exports: [TreatmentsService, ClinicTreatmentPriceService, OdontogramSyncService],
})
export class TreatmentsModule {}
