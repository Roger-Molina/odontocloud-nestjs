import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "../../../common/entities/base.entity";
import { Payment } from "./billing.entity";

@Entity("payment_methods")
export class PaymentMethod extends BaseEntity {
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

  @Column({ name: "requires_authorization", default: false })
  requiresAuthorization: boolean;

  @Column({ name: "requires_reference", default: false })
  requiresReference: boolean;

  @Column({
    name: "processing_fee_percentage",
    type: "decimal",
    precision: 5,
    scale: 2,
    default: 0,
  })
  processingFeePercentage: number;

  @Column({
    name: "processing_fee_fixed",
    type: "decimal",
    precision: 10,
    scale: 2,
    default: 0,
  })
  processingFeeFixed: number;

  @Column({ name: "icon_class", nullable: true })
  iconClass?: string; // Para mostrar iconos en el frontend

  // Relations
  @OneToMany(() => Payment, (payment) => payment.paymentMethod)
  payments: Payment[];
}
