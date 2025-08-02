import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BillingService } from "./billing.service";
import { BillingController } from "./billing.controller";
import { Invoice, InvoiceItem, Payment } from "./entities/billing.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Invoice, InvoiceItem, Payment])],
  providers: [BillingService],
  controllers: [BillingController],
  exports: [BillingService],
})
export class BillingModule {}
