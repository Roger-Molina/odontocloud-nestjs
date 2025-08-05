import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "../../../common/entities/base.entity";
import { Payment } from "./billing.entity";

@Entity("payment_statuses")
export class PaymentStatus extends BaseEntity {
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

  @Column({ name: "color_hex", length: 7, default: "#28a745" })
  colorHex: string;

  @Column({ name: "is_final", default: false })
  isFinal: boolean; // Estados finales como COMPLETED, FAILED, CANCELLED

  @Column({ name: "allows_refund", default: false })
  allowsRefund: boolean;

  // Relations
  @OneToMany(() => Payment, (payment) => payment.paymentStatus)
  payments: Payment[];
}
