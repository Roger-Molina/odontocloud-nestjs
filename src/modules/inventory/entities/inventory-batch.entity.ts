import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "../../../common/entities/base.entity";
import { InventoryItem } from "./inventory.entity";
import { PurchaseOrder } from "./purchase-order.entity";

@Entity("inventory_batches")
export class InventoryBatch extends BaseEntity {
  @Column({ name: "batch_number" })
  batchNumber: string;

  @Column({ name: "expiration_date", type: "date", nullable: true })
  expirationDate?: Date;

  @Column({ name: "manufacture_date", type: "date", nullable: true })
  manufactureDate?: Date;

  @Column({
    name: "purchase_cost",
    type: "decimal",
    precision: 10,
    scale: 2,
  })
  purchaseCost: number;

  @Column({ name: "current_stock", type: "int", default: 0 })
  currentStock: number;

  @Column({ name: "initial_stock", type: "int" })
  initialStock: number;

  @Column({ name: "is_expired", type: "boolean", default: false })
  isExpired: boolean;

  @Column({ type: "text", nullable: true })
  notes?: string;

  @Column({ name: "item_id" })
  itemId: number;

  @Column({ name: "purchase_order_id", nullable: true })
  purchaseOrderId?: number;

  @ManyToOne(() => InventoryItem)
  @JoinColumn({ name: "item_id" })
  item: InventoryItem;

  @ManyToOne(() => PurchaseOrder, { nullable: true })
  @JoinColumn({ name: "purchase_order_id" })
  purchaseOrder?: PurchaseOrder;

  // Relación con InventoryMovement
  // @OneToMany(() => InventoryMovement, (movement) => movement.batch)
  // movements: InventoryMovement[];
}
