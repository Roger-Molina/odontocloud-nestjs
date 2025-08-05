import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BillingService } from "./billing.service";
import { BillingController } from "./billing.controller";
import { Invoice, InvoiceItem, Payment } from "./entities/billing.entity";
import { InvoiceStatus } from "./entities/invoice-status.entity";
import { PaymentMethod } from "./entities/payment-method.entity";
import { InvoiceType } from "./entities/invoice-type.entity";
import { PaymentStatus } from "./entities/payment-status.entity";
import { DiscountType } from "./entities/discount-type.entity";
import { Expense } from "./entities/expense.entity";
import { ExpenseCategory } from "./entities/expense-category.entity";
import { ExpenseStatus } from "./entities/expense-status.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      // Main entities
      Invoice,
      InvoiceItem,
      Payment,
      Expense,
      // Catalog entities
      InvoiceStatus,
      PaymentMethod,
      InvoiceType,
      PaymentStatus,
      DiscountType,
      ExpenseCategory,
      ExpenseStatus,
    ]),
  ],
  providers: [BillingService],
  controllers: [BillingController],
  exports: [BillingService],
})
export class BillingModule {}
