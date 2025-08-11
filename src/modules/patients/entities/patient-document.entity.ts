import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Patient } from "./patient.entity";

export enum DocumentCategory {
  MEDICAL_HISTORY = "medical_history",
  LAB_RESULTS = "lab_results",
  XRAYS = "xrays",
  PRESCRIPTIONS = "prescriptions",
  CONSENT_FORMS = "consent_forms",
  INSURANCE = "insurance",
  IDENTIFICATION = "identification",
  OTHER = "other",
}

@Entity("patient_documents")
export class PatientDocument {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  originalName: string;

  @Column({ type: "varchar", length: 255 })
  fileName: string;

  @Column({ type: "varchar", length: 500 })
  filePath: string;

  @Column({ type: "varchar", length: 100 })
  mimeType: string;

  @Column({ type: "bigint" })
  fileSize: number;

  @Column({
    type: "enum",
    enum: DocumentCategory,
    default: DocumentCategory.OTHER,
  })
  category: DocumentCategory;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  uploadedBy?: string;

  @ManyToOne(() => Patient, (patient) => patient.documents, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "patient_id" })
  patient: Patient;

  @Column({ name: "patient_id" })
  patientId: number;

  @Column({ name: "clinic_id", nullable: true })
  clinicId?: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
