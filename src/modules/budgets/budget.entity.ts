import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { Patient } from "../patients/entities/patient.entity";
import { Doctor } from "../doctors/entities/doctor.entity";
import { Clinic } from "../clinics/entities/clinic.entity";
import { BudgetItem } from "./budget-item.entity";

export enum BudgetStatus {
  DRAFT = "draft",
  SENT = "sent",
  APPROVED = "approved",
  REJECTED = "rejected",
  EXPIRED = "expired",
}

@Entity("budgets")
export class Budget {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  budgetNumber: string;

  @Column()
  title: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  subtotal: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  taxAmount: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @Column({
    type: "enum",
    enum: BudgetStatus,
    default: BudgetStatus.DRAFT,
  })
  status: BudgetStatus;

  @Column({ type: "date" })
  validUntil: Date;

  @Column({ type: "text", nullable: true })
  notes: string;

  @Column({ type: "text", nullable: true })
  rejectionReason: string;

  // Descuentos globales
  @Column({ type: "varchar", length: 50, nullable: true })
  couponCode: string;

  @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
  couponDiscount: number;

  @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
  globalDiscount: number;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  finalTotal: number;

  // Relations
  @Column()
  patientId: number;

  @ManyToOne(() => Patient, { eager: true })
  @JoinColumn({ name: "patientId" })
  patient: Patient;

  @Column()
  doctorId: number;

  @ManyToOne(() => Doctor, { eager: true })
  @JoinColumn({ name: "doctorId" })
  doctor: Doctor;

  @Column()
  clinicId: number;

  @ManyToOne(() => Clinic, { eager: true })
  @JoinColumn({ name: "clinicId" })
  clinic: Clinic;

  // Budget Items relation
  @OneToMany(() => BudgetItem, (budgetItem) => budgetItem.budget, {
    cascade: true,
    eager: false,
  })
  items: BudgetItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
