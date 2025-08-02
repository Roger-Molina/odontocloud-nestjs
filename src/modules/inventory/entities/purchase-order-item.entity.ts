import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "../../../common/entities/base.entity";
import { PurchaseOrder } from "./purchase-order.entity";
import { InventoryItem } from "./inventory.entity";

@Entity("purchase_order_items")
export class PurchaseOrderItem extends BaseEntity {
  @Column({ type: "int" })
  quantity: number;

  @Column({ name: "quantity_received", type: "int", default: 0 })
  quantityReceived: number;

  @Column({
    name: "unit_cost",
    type: "decimal",
    precision: 10,
    scale: 2,
  })
  unitCost: number;

  @Column({
    name: "total_cost",
    type: "decimal",
    precision: 10,
    scale: 2,
  })
  totalCost: number;

  @Column({ type: "text", nullable: true })
  notes?: string;

  @Column({ name: "purchase_order_id" })
  purchaseOrderId: number;

  @Column({ name: "inventory_item_id" })
  inventoryItemId: number;

  @ManyToOne(() => PurchaseOrder)
  @JoinColumn({ name: "purchase_order_id" })
  purchaseOrder: PurchaseOrder;

  @ManyToOne(() => InventoryItem)
  @JoinColumn({ name: "inventory_item_id" })
  inventoryItem: InventoryItem;
}
