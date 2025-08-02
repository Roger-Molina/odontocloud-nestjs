import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { BaseEntity } from "../../../common/entities/base.entity";
import { Supplier } from "./supplier.entity";
import { Clinic } from "../../clinics/entities/clinic.entity";
import { PurchaseOrderItem } from "./purchase-order-item.entity";

export enum PurchaseOrderStatus {
  DRAFT = "draft",
  SENT = "sent",
  CONFIRMED = "confirmed",
  PARTIALLY_RECEIVED = "partially_received",
  RECEIVED = "received",
  CANCELLED = "cancelled",
}

@Entity("purchase_orders")
export class PurchaseOrder extends BaseEntity {
  @Column({ name: "order_number", unique: true })
  orderNumber: string;

  @Column({ name: "order_date", type: "date" })
  orderDate: Date;

  @Column({ name: "expected_delivery_date", type: "date", nullable: true })
  expectedDeliveryDate?: Date;

  @Column({ name: "actual_delivery_date", type: "date", nullable: true })
  actualDeliveryDate?: Date;

  @Column({
    type: "enum",
    enum: PurchaseOrderStatus,
    default: PurchaseOrderStatus.DRAFT,
  })
  status: PurchaseOrderStatus;

  @Column({
    name: "subtotal",
    type: "decimal",
    precision: 10,
    scale: 2,
    default: 0,
  })
  subtotal: number;

  @Column({
    name: "tax_amount",
    type: "decimal",
    precision: 10,
    scale: 2,
    default: 0,
  })
  taxAmount: number;

  @Column({
    name: "total_amount",
    type: "decimal",
    precision: 10,
    scale: 2,
  })
  totalAmount: number;

  @Column({ type: "text", nullable: true })
  notes?: string;

  @Column({ name: "supplier_id" })
  supplierId: number;

  @Column({ name: "clinic_id" })
  clinicId: number;

  @ManyToOne(() => Supplier)
  @JoinColumn({ name: "supplier_id" })
  supplier: Supplier;

  @ManyToOne(() => Clinic)
  @JoinColumn({ name: "clinic_id" })
  clinic: Clinic;

  @OneToMany(() => PurchaseOrderItem, (item) => item.purchaseOrder)
  items: PurchaseOrderItem[];
}
