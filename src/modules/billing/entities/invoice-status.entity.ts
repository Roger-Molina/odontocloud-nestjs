import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "../../../common/entities/base.entity";
import { Invoice } from "./billing.entity";

@Entity("invoice_statuses")
export class InvoiceStatus extends BaseEntity {
  @Column({ unique: true, length: 50 })
  code: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ name: "color_hex", length: 7, default: "#6c757d" })
  colorHex: string;

  @Column({ name: "is_active", default: true })
  isActive: boolean;

  @Column({ name: "display_order", default: 0 })
  displayOrder: number;

  @Column({ name: "is_final", default: false })
  isFinal: boolean; // Estados finales como PAID, CANCELLED, REFUNDED

  @Column({ name: "requires_payment", default: false })
  requiresPayment: boolean; // Si el estado requiere información de pago

  // Relations
  @OneToMany(() => Invoice, (invoice) => invoice.invoiceStatus)
  invoices: Invoice[];
}
