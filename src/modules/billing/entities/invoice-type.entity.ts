import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "../../../common/entities/base.entity";
import { Invoice } from "./billing.entity";

@Entity("invoice_types")
export class InvoiceType extends BaseEntity {
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

  @Column({
    name: "default_tax_rate",
    type: "decimal",
    precision: 5,
    scale: 2,
    default: 19.0,
  })
  defaultTaxRate: number;

  @Column({ name: "requires_appointment", default: true })
  requiresAppointment: boolean;

  @Column({ name: "color_hex", length: 7, default: "#007bff" })
  colorHex: string;

  @Column({ name: "icon_class", nullable: true })
  iconClass?: string;

  // Relations
  @OneToMany(() => Invoice, (invoice) => invoice.invoiceType)
  invoices: Invoice[];
}
