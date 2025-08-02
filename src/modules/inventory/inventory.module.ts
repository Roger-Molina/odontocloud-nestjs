import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InventoryService } from "./inventory.service";
import { InventoryController } from "./inventory.controller";
import {
  InventoryItem,
  InventoryMovement,
  InventoryClinicStock,
  Supplier,
  ItemCategory,
  PurchaseOrder,
  PurchaseOrderItem,
  InventoryBatch,
} from "./entities";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InventoryItem,
      InventoryMovement,
      InventoryClinicStock,
      Supplier,
      ItemCategory,
      PurchaseOrder,
      PurchaseOrderItem,
      InventoryBatch,
    ]),
  ],
  providers: [InventoryService],
  controllers: [InventoryController],
  exports: [InventoryService],
})
export class InventoryModule {}
