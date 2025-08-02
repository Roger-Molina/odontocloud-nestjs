import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "../../../common/entities/base.entity";
import { PurchaseOrder } from "./purchase-order.entity";

@Entity("suppliers")
export class Supplier extends BaseEntity {
  @Column({ name: "supplier_code", unique: true })
  supplierCode: string;

  @Column({ name: "company_name" })
  companyName: string;

  @Column({ name: "contact_name", nullable: true })
  contactName?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ type: "text", nullable: true })
  address?: string;

  @Column({ name: "tax_id", nullable: true })
  taxId?: string;

  @Column({ type: "boolean", default: true })
  active: boolean;

  @Column({ name: "payment_terms", nullable: true })
  paymentTerms?: string; // "30 días", "Contado", etc.

  @Column({ type: "text", nullable: true })
  @Column({ type: "text", nullable: true })
  notes?: string;

  @OneToMany(() => PurchaseOrder, (order) => order.supplier)
  purchaseOrders: PurchaseOrder[];
}
