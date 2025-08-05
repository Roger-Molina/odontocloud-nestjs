import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "../../../common/entities/base.entity";
import { Clinic } from "../../clinics/entities/clinic.entity";
import { Doctor } from "../../doctors/entities/doctor.entity";
import { ExpenseCategory } from "./expense-category.entity";
import { ExpenseStatus } from "./expense-status.entity";

@Entity("expenses")
export class Expense extends BaseEntity {
  @Column({ name: "expense_number", unique: true })
  expenseNumber: string;

  @Column({ name: "expense_date", type: "date" })
  expenseDate: Date;

  @Column({ length: 200 })
  description: string;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
  })
  amount: number;

  @Column({ name: "supplier_name", nullable: true })
  supplierName?: string;

  @Column({ name: "invoice_reference", nullable: true })
  invoiceReference?: string;

  @Column({ name: "receipt_url", nullable: true })
  receiptUrl?: string; // URL del comprobante/factura

  @Column({ type: "text", nullable: true })
  notes?: string;

  @Column({ name: "is_recurring", default: false })
  isRecurring: boolean;

  @Column({ name: "recurring_frequency", nullable: true })
  recurringFrequency?: string; // monthly, quarterly, yearly

  @Column({ name: "next_occurrence", type: "date", nullable: true })
  nextOccurrence?: Date;

  @Column({ name: "payment_method", nullable: true })
  paymentMethod?: string;

  @Column({ name: "approved_by", nullable: true })
  approvedBy?: string;

  @Column({ name: "approved_at", type: "timestamp", nullable: true })
  approvedAt?: Date;

  @Column({ name: "paid_at", type: "timestamp", nullable: true })
  paidAt?: Date;

  // Foreign Keys
  @Column({ name: "clinic_id" })
  clinicId: number;

  @Column({ name: "doctor_id", nullable: true })
  doctorId?: number; // Doctor que reportó o aprobó el gasto

  @Column({ name: "expense_category_id" })
  expenseCategoryId: number;

  @Column({ name: "expense_status_id" })
  expenseStatusId: number;

  // Relations
  @ManyToOne(() => Clinic)
  @JoinColumn({ name: "clinic_id" })
  clinic: Clinic;

  @ManyToOne(() => Doctor, { nullable: true })
  @JoinColumn({ name: "doctor_id" })
  doctor?: Doctor;

  @ManyToOne(() => ExpenseCategory)
  @JoinColumn({ name: "expense_category_id" })
  expenseCategory: ExpenseCategory;

  @ManyToOne(() => ExpenseStatus)
  @JoinColumn({ name: "expense_status_id" })
  expenseStatus: ExpenseStatus;
}
