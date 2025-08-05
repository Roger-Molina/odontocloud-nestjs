import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "../../../common/entities/base.entity";
import { Invoice } from "./billing.entity";

@Entity("discount_types")
export class DiscountType extends BaseEntity {
  @Column({ unique: true, length: 50 })
  code: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ name: "is_active", default: true })
  isActive: boolean;

  @Column({ name: "display_order", default: 0 })
  displayOrder: number;

  @Column({ name: "is_percentage", default: true })
  isPercentage: boolean; // true = porcentaje, false = monto fijo

  @Column({
    name: "max_discount_percentage",
    type: "decimal",
    precision: 5,
    scale: 2,
    nullable: true,
  })
  maxDiscountPercentage?: number;

  @Column({
    name: "max_discount_amount",
    type: "decimal",
    precision: 10,
    scale: 2,
    nullable: true,
  })
  maxDiscountAmount?: number;

  @Column({ name: "requires_approval", default: false })
  requiresApproval: boolean;

  @Column({ name: "icon_class", nullable: true })
  iconClass?: string;

  @Column({ name: "color_hex", length: 7, default: "#ffc107" })
  colorHex: string;

  // Relations
  @OneToMany(() => Invoice, (invoice) => invoice.discountType)
  invoices: Invoice[];
}
