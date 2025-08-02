import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
  Unique,
} from "typeorm";
import { BaseEntity } from "../../../common/entities/base.entity";
import { Patient } from "../../patients/entities/patient.entity";

export enum ToothStatus {
  HEALTHY = "healthy",
  CARIES = "caries",
  FILLED = "filled",
  CROWN = "crown",
  EXTRACTION = "extraction",
  MISSING = "missing",
  IMPLANT = "implant",
  ROOT_CANAL = "root_canal",
  BRIDGE = "bridge",
  FRACTURED = "fractured",
  SENSITIVE = "sensitive",
  ABRASION = "abrasion",
  EROSION = "erosion",
}

export enum ToothSurface {
  MESIAL = "mesial",
  DISTAL = "distal",
  OCCLUSAL = "occlusal",
  BUCCAL = "buccal",
  LINGUAL = "lingual",
  INCISAL = "incisal",
  CERVICAL = "cervical",
}

export enum OdontogramStatus {
  DRAFT = "draft",
  COMPLETED = "completed",
  REVIEWED = "reviewed",
  ARCHIVED = "archived",
}

@Entity("odontograms")
@Index(["patientId", "examinationDate"])
@Index(["odontogramCode"])
@Unique("UQ_odontogram_patient_date", ["patientId", "examinationDate"])
export class Odontogram extends BaseEntity {
  @Column({ name: "odontogram_code", unique: true, length: 50 })
  odontogramCode: string;

  @Column({ name: "examination_date", type: "date" })
  examinationDate: Date;

  @Column({ type: "text", nullable: true })
  generalNotes?: string;

  @Column({ name: "diagnosis", type: "text", nullable: true })
  diagnosis?: string;

  @Column({ name: "treatment_plan", type: "text", nullable: true })
  treatmentPlan?: string;

  @Column({
    type: "enum",
    enum: OdontogramStatus,
    default: OdontogramStatus.DRAFT,
  })
  status: OdontogramStatus;

  @Column({ name: "doctor_notes", type: "text", nullable: true })
  doctorNotes?: string;

  @Column({ name: "next_appointment_date", type: "date", nullable: true })
  nextAppointmentDate?: Date;

  @Column({
    name: "urgency_level",
    type: "int",
    default: 1,
    comment: "1=Low, 2=Medium, 3=High, 4=Urgent",
  })
  urgencyLevel: number;

  @Column({ name: "total_teeth_examined", type: "int", default: 32 })
  totalTeethExamined: number;

  @Column({ name: "healthy_teeth_count", type: "int", default: 0 })
  healthyTeethCount: number;

  @Column({ name: "problematic_teeth_count", type: "int", default: 0 })
  problematicTeethCount: number;

  @Column({ name: "treatment_required_count", type: "int", default: 0 })
  treatmentRequiredCount: number;

  @Column({ name: "patient_id" })
  patientId: number;

  @ManyToOne(() => Patient, { eager: true })
  @JoinColumn({ name: "patient_id" })
  patient: Patient;

  @OneToMany(() => ToothRecord, (toothRecord) => toothRecord.odontogram, {
    cascade: true,
    eager: false,
  })
  toothRecords: ToothRecord[];
}

@Entity("tooth_records")
@Index(["odontogramId", "toothNumber"])
export class ToothRecord extends BaseEntity {
  @Column({ name: "tooth_number", type: "int" })
  toothNumber: number;

  @Column({ type: "enum", enum: ToothStatus, default: ToothStatus.HEALTHY })
  status: ToothStatus;

  @Column({ type: "simple-array", nullable: true })
  affectedSurfaces?: ToothSurface[];

  @Column({ type: "text", nullable: true })
  notes?: string;

  @Column({ name: "treatment_required", default: false })
  treatmentRequired: boolean;

  @Column({ name: "treatment_completed", default: false })
  treatmentCompleted: boolean;

  @Column({ name: "treatment_date", type: "date", nullable: true })
  treatmentDate?: Date;

  @Column({
    name: "cost_estimate",
    type: "decimal",
    precision: 10,
    scale: 2,
    nullable: true,
  })
  costEstimate?: number;

  @Column({
    name: "priority_level",
    type: "int",
    default: 1,
    comment: "1=Low, 2=Medium, 3=High, 4=Urgent",
  })
  priorityLevel: number;

  @Column({ name: "last_modified_by", nullable: true })
  lastModifiedBy?: string;

  @Column({ name: "odontogram_id" })
  odontogramId: number;

  @ManyToOne(() => Odontogram, (odontogram) => odontogram.toothRecords, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "odontogram_id" })
  odontogram: Odontogram;
}
