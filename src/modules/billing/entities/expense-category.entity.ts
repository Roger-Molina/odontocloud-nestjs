import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "../../../common/entities/base.entity";
import { Expense } from "./expense.entity";

@Entity("expense_categories")
export class ExpenseCategory extends BaseEntity {
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

  @Column({ name: "is_deductible", default: false })
  isDeductible: boolean; // Si el gasto es deducible de impuestos

  @Column({ name: "requires_receipt", default: false })
  requiresReceipt: boolean; // Si requiere comprobante/factura obligatorio

  @Column({ name: "max_amount", type: "decimal", precision: 10, scale: 2, nullable: true })
  maxAmount?: number; // Monto máximo permitido para esta categoría

  @Column({ name: "requires_approval", default: false })
  requiresApproval: boolean; // Si requiere aprobación

  @Column({ name: "icon_class", nullable: true })
  iconClass?: string; // Clase de ícono para UI

  @Column({ name: "color_hex", length: 7, default: "#6c757d" })
  colorHex: string;

  // Relations
  @OneToMany(() => Expense, (expense) => expense.expenseCategory)
  expenses: Expense[];
}
