import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { BaseEntity } from "../../../common/entities/base.entity";
import { Patient } from "../../patients/entities/patient.entity";
import { Appointment } from "../../appointments/entities/appointment.entity";
import { Doctor } from "../../doctors/entities/doctor.entity";
import { Treatment } from "../../treatments/entities/treatment.entity";
import { Clinic } from "../../clinics/entities/clinic.entity";
import { InvoiceStatus } from "./invoice-status.entity";
import { PaymentMethod } from "./payment-method.entity";
import { InvoiceType } from "./invoice-type.entity";
import { PaymentStatus } from "./payment-status.entity";
import { DiscountType } from "./discount-type.entity";

@Entity("invoices")
export class Invoice extends BaseEntity {
  @Column({ name: "invoice_number", unique: true })
  invoiceNumber: string;

  @Column({ name: "invoice_date", type: "date" })
  invoiceDate: Date;

  @Column({ name: "due_date", type: "date" })
  dueDate: Date;

  // Foreign Keys for catalog tables
  @Column({ name: "invoice_type_id" })
  invoiceTypeId: number;

  @Column({ name: "invoice_status_id" })
  invoiceStatusId: number;

  @Column({ name: "discount_type_id", nullable: true })
  discountTypeId?: number;

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
    name: "tax_rate",
    type: "decimal",
    precision: 5,
    scale: 2,
    default: 19.0,
  })
  taxRate: number;

  @Column({
    name: "discount_amount",
    type: "decimal",
    precision: 10,
    scale: 2,
    default: 0,
  })
  discountAmount: number;

  @Column({
    name: "discount_value",
    type: "decimal",
    precision: 10,
    scale: 2,
    nullable: true,
  })
  discountValue?: number;

  @Column({
    name: "insurance_covered",
    type: "decimal",
    precision: 10,
    scale: 2,
    default: 0,
  })
  insuranceCovered: number;

  @Column({
    name: "total_amount",
    type: "decimal",
    precision: 10,
    scale: 2,
  })
  totalAmount: number;

  @Column({
    name: "paid_amount",
    type: "decimal",
    precision: 10,
    scale: 2,
    default: 0,
  })
  paidAmount: number;

  @Column({
    name: "balance_due",
    type: "decimal",
    precision: 10,
    scale: 2,
    default: 0,
  })
  balanceDue: number;

  @Column({ type: "text", nullable: true })
  notes?: string;

  @Column({ type: "text", nullable: true })
  internalNotes?: string;

  @Column({ name: "payment_terms", default: 30 })
  paymentTerms: number;

  @Column({ name: "is_recurring", default: false })
  isRecurring: boolean;

  @Column({ name: "recurring_frequency", nullable: true })
  recurringFrequency?: string;

  @Column({ name: "paid_at", type: "timestamp", nullable: true })
  paidAt?: Date;

  @Column({ name: "sent_at", type: "timestamp", nullable: true })
  sentAt?: Date;

  @Column({ name: "viewed_at", type: "timestamp", nullable: true })
  viewedAt?: Date;

  @Column({ name: "cancellation_reason", nullable: true })
  cancellationReason?: string;

  @Column({ name: "refund_reason", nullable: true })
  refundReason?: string;

  @Column({
    name: "refund_amount",
    type: "decimal",
    precision: 10,
    scale: 2,
    nullable: true,
  })
  refundAmount?: number;

  // Foreign Keys
  @Column({ name: "patient_id" })
  patientId: number;

  @Column({ name: "appointment_id", nullable: true })
  appointmentId?: number;

  @Column({ name: "clinic_id" })
  clinicId: number;

  @Column({ name: "doctor_id", nullable: true })
  doctorId?: number;

  // Relations
  @ManyToOne(() => Patient)
  @JoinColumn({ name: "patient_id" })
  patient: Patient;

  @ManyToOne(() => Appointment, { nullable: true })
  @JoinColumn({ name: "appointment_id" })
  appointment?: Appointment;

  @ManyToOne(() => Clinic)
  @JoinColumn({ name: "clinic_id" })
  clinic: Clinic;

  @ManyToOne(() => Doctor, { nullable: true })
  @JoinColumn({ name: "doctor_id" })
  doctor?: Doctor;

  // Relations to catalog tables
  @ManyToOne(() => InvoiceType)
  @JoinColumn({ name: "invoice_type_id" })
  invoiceType: InvoiceType;

  @ManyToOne(() => InvoiceStatus)
  @JoinColumn({ name: "invoice_status_id" })
  invoiceStatus: InvoiceStatus;

  @ManyToOne(() => DiscountType, { nullable: true })
  @JoinColumn({ name: "discount_type_id" })
  discountType?: DiscountType;

  @OneToMany(() => InvoiceItem, (item) => item.invoice, { cascade: true })
  items: InvoiceItem[];

  @OneToMany(() => Payment, (payment) => payment.invoice)
  payments: Payment[];
}

@Entity("invoice_items")
export class InvoiceItem extends BaseEntity {
  @Column()
  description: string;

  @Column({ type: "int" })
  quantity: number;

  @Column({
    name: "unit_price",
    type: "decimal",
    precision: 10,
    scale: 2,
  })
  unitPrice: number;

  @Column({
    name: "discount_amount",
    type: "decimal",
    precision: 10,
    scale: 2,
    default: 0,
  })
  discountAmount: number;

  @Column({
    name: "total_price",
    type: "decimal",
    precision: 10,
    scale: 2,
  })
  totalPrice: number;

  @Column({ name: "treatment_id", nullable: true })
  treatmentId?: number;

  @Column({ name: "tooth_numbers", type: "json", nullable: true })
  toothNumbers?: string[];

  @Column({ name: "invoice_id" })
  invoiceId: number;

  @ManyToOne(() => Invoice, (invoice) => invoice.items, { onDelete: "CASCADE" })
  @JoinColumn({ name: "invoice_id" })
  invoice: Invoice;

  @ManyToOne(() => Treatment, { nullable: true })
  @JoinColumn({ name: "treatment_id" })
  treatment?: Treatment;
}

@Entity("payments")
export class Payment extends BaseEntity {
  @Column({ name: "payment_number", unique: true })
  paymentNumber: string;

  @Column({ name: "payment_date", type: "date" })
  paymentDate: Date;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
  })
  amount: number;

  @Column({ name: "payment_method_id" })
  paymentMethodId: number;

  @Column({ name: "payment_status_id" })
  paymentStatusId: number;

  @Column({ name: "reference_number", nullable: true })
  referenceNumber?: string;

  @Column({ name: "authorization_code", nullable: true })
  authorizationCode?: string;

  @Column({ name: "transaction_id", nullable: true })
  transactionId?: string;

  @Column({ type: "text", nullable: true })
  notes?: string;

  @Column({ name: "processed_by", nullable: true })
  processedBy?: string;

  @Column({ name: "invoice_id" })
  invoiceId: number;

  @ManyToOne(() => Invoice, (invoice) => invoice.payments)
  @JoinColumn({ name: "invoice_id" })
  invoice: Invoice;

  @ManyToOne(() => PaymentMethod)
  @JoinColumn({ name: "payment_method_id" })
  paymentMethod: PaymentMethod;

  @ManyToOne(() => PaymentStatus)
  @JoinColumn({ name: "payment_status_id" })
  paymentStatus: PaymentStatus;
}

// Re-export entities for backward compatibility
export { InvoiceStatus } from "./invoice-status.entity";
export { PaymentMethod } from "./payment-method.entity";
export { InvoiceType } from "./invoice-type.entity";
export { PaymentStatus } from "./payment-status.entity";
export { DiscountType } from "./discount-type.entity";
