import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "../../../common/entities/base.entity";
import { Expense } from "./expense.entity";

@Entity("expense_statuses")
export class ExpenseStatus extends BaseEntity {
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
  isFinal: boolean; // Estados finales como PAID, CANCELLED, REJECTED

  @Column({ name: "requires_approval", default: false })
  requiresApproval: boolean; // Si en este estado requiere aprobación

  @Column({ name: "can_edit", default: true })
  canEdit: boolean; // Si se puede editar el gasto en este estado

  @Column({ name: "can_delete", default: true })
  canDelete: boolean; // Si se puede eliminar el gasto en este estado

  // Relations
  @OneToMany(() => Expense, (expense) => expense.expenseStatus)
  expenses: Expense[];
}
