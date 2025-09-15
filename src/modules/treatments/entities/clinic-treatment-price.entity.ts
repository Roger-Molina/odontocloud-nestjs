import { Entity, Column, ManyToOne, JoinColumn, Unique, Index } from "typeorm";
import { BaseEntity } from "../../../common/entities/base.entity";
import { Treatment } from "./treatment.entity";
import { Clinic } from "../../clinics/entities/clinic.entity";

@Entity("clinic_treatment_prices")
@Unique("UQ_clinic_treatment", ["clinicId", "treatmentId"])
@Index(["clinicId", "treatmentId"])
export class ClinicTreatmentPrice extends BaseEntity {
  @Column({
    name: "base_price",
    type: "decimal",
    precision: 10,
    scale: 2,
  })
  basePrice: number;

  @Column({
    name: "insurance_price",
    type: "decimal",
    precision: 10,
    scale: 2,
    nullable: true,
    comment: "Precio para pacientes con seguro",
  })
  insurancePrice?: number;

  @Column({
    name: "promotional_price",
    type: "decimal",
    precision: 10,
    scale: 2,
    nullable: true,
    comment: "Precio promocional temporal",
  })
  promotionalPrice?: number;

  @Column({
    name: "promotional_start_date",
    type: "date",
    nullable: true,
  })
  promotionalStartDate?: Date;

  @Column({
    name: "promotional_end_date",
    type: "date",
    nullable: true,
  })
  promotionalEndDate?: Date;

  @Column({
    name: "min_duration_minutes",
    type: "int",
    nullable: true,
    comment: "Duración mínima estimada en minutos",
  })
  minDurationMinutes?: number;

  @Column({
    name: "max_duration_minutes",
    type: "int",
    nullable: true,
    comment: "Duración máxima estimada en minutos",
  })
  maxDurationMinutes?: number;

  @Column({
    name: "cost_per_session",
    type: "decimal",
    precision: 10,
    scale: 2,
    nullable: true,
    comment: "Costo por sesión si el tratamiento requiere múltiples sesiones",
  })
  costPerSession?: number;

  @Column({
    name: "estimated_sessions",
    type: "int",
    default: 1,
    comment: "Número estimado de sesiones requeridas",
  })
  estimatedSessions: number;

  @Column({
    name: "requires_anesthesia",
    default: false,
    comment: "Si el tratamiento requiere anestesia",
  })
  requiresAnesthesia: boolean;

  @Column({
    name: "anesthesia_cost",
    type: "decimal",
    precision: 10,
    scale: 2,
    nullable: true,
    comment: "Costo adicional por anestesia",
  })
  anesthesiaCost?: number;

  @Column({
    name: "material_cost",
    type: "decimal",
    precision: 10,
    scale: 2,
    nullable: true,
    comment: "Costo estimado de materiales",
  })
  materialCost?: number;

  @Column({
    name: "is_active",
    default: true,
    comment: "Si el precio está activo para esta clínica",
  })
  isActive: boolean;

  @Column({
    name: "effective_from",
    type: "date",
    comment: "Fecha desde la cual este precio es efectivo",
  })
  effectiveFrom: Date;

  @Column({
    name: "effective_until",
    type: "date",
    nullable: true,
    comment: "Fecha hasta la cual este precio es efectivo",
  })
  effectiveUntil?: Date;

  @Column({
    type: "text",
    nullable: true,
    comment: "Notas específicas del precio para esta clínica",
  })
  notes?: string;

  // Foreign Keys
  @Column({ name: "clinic_id" })
  clinicId: number;

  @Column({ name: "treatment_id" })
  treatmentId: number;

  // Relations
  @ManyToOne(() => Clinic, { eager: true })
  @JoinColumn({ name: "clinic_id" })
  clinic: Clinic;

  @ManyToOne(() => Treatment, { eager: true })
  @JoinColumn({ name: "treatment_id" })
  treatment: Treatment;
}
