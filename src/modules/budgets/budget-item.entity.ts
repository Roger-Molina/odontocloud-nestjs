import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { Budget } from "./budget.entity";
import { Treatment } from "../treatments/entities/treatment.entity";
import { ClinicTreatmentPrice } from "../treatments/entities/clinic-treatment-price.entity";

@Entity("budget_items")
export class BudgetItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  treatmentName: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "int", default: 1 })
  quantity: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
  discount: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  total: number;

  // Nuevos campos para sincronización con odontograma
  @Column({ name: "tooth_numbers", type: "json", nullable: true })
  toothNumbers?: number[];

  @Column({ name: "tooth_surfaces", type: "json", nullable: true })
  toothSurfaces?: string[];

  @Column({ name: "odontogram_tooth_record_id", nullable: true })
  odontogramToothRecordId?: number;

  @Column({ name: "clinic_treatment_price_id", nullable: true })
  clinicTreatmentPriceId?: number;

  @Column({
    name: "sessions_required",
    type: "int",
    default: 1,
    comment: "Número de sesiones requeridas para este tratamiento",
  })
  sessionsRequired: number;

  @Column({
    name: "sessions_completed",
    type: "int",
    default: 0,
    comment: "Número de sesiones completadas",
  })
  sessionsCompleted: number;

  @Column({
    name: "estimated_duration_minutes",
    type: "int",
    nullable: true,
    comment: "Duración estimada total en minutos",
  })
  estimatedDurationMinutes?: number;

  @Column({
    name: "priority_level",
    type: "int",
    default: 1,
    comment: "1=Baja, 2=Media, 3=Alta, 4=Urgente",
  })
  priorityLevel: number;

  @Column({
    name: "requires_anesthesia",
    default: false,
  })
  requiresAnesthesia: boolean;

  @Column({
    name: "treatment_notes",
    type: "text",
    nullable: true,
    comment: "Notas específicas del tratamiento",
  })
  treatmentNotes?: string;

  // Relations
  @Column()
  budgetId: number;

  @ManyToOne(() => Budget, (budget) => budget.items, { onDelete: "CASCADE" })
  @JoinColumn({ name: "budgetId" })
  budget: Budget;

  @Column({ nullable: true })
  treatmentId: number;

  @ManyToOne(() => Treatment, { eager: true, nullable: true })
  @JoinColumn({ name: "treatmentId" })
  treatment: Treatment;

  @ManyToOne(() => ClinicTreatmentPrice, { nullable: true })
  @JoinColumn({ name: "clinic_treatment_price_id" })
  clinicTreatmentPrice?: ClinicTreatmentPrice;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
