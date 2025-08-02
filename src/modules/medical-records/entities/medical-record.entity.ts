import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { BaseEntity } from "../../../common/entities/base.entity";
import { Patient } from "../../patients/entities/patient.entity";
import { Doctor } from "../../doctors/entities/doctor.entity";
import { Appointment } from "../../appointments/entities/appointment.entity";
import { RecordType } from "../../record-types/entities/record-type.entity";
import { Treatment } from "../../treatments/entities/treatment.entity";
import { Diagnosis } from "../../diagnoses/entities/diagnosis.entity";

export enum RecordTypeEnum {
  CONSULTATION = "consultation",
  TREATMENT = "treatment",
  DIAGNOSIS = "diagnosis",
  PROCEDURE = "procedure",
  FOLLOW_UP = "follow_up",
  PREVENTION = "prevention",
  EMERGENCY = "emergency",
  CLEANING = "cleaning",
  RESTORATION = "restoration",
  ENDODONTICS = "endodontics",
  PERIODONTICS = "periodontics",
  SURGERY = "surgery",
  ORTHODONTICS = "orthodontics",
  PROSTHETICS = "prosthetics",
  IMPLANTS = "implants",
}

export enum ToothCondition {
  HEALTHY = "healthy",
  CARIES = "caries",
  FILLED = "filled",
  CROWNED = "crowned",
  MISSING = "missing",
  EXTRACTED = "extracted",
  FRACTURED = "fractured",
  ROOT_CANAL = "root_canal",
  IMPLANT = "implant",
}

export enum ProcedureStatus {
  PLANNED = "planned",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  POSTPONED = "postponed",
}

@Entity("medical_records")
export class MedicalRecord extends BaseEntity {
  @Column({ name: "record_code", unique: true, nullable: true })
  recordCode: string;

  // Mantener enum para retrocompatibilidad
  @Column({ type: "enum", enum: RecordTypeEnum })
  type: RecordTypeEnum;

  // Nueva relación con RecordType (opcional para funcionalidad avanzada)
  @Column({ name: "record_type_id", nullable: true })
  recordTypeId?: number;

  @ManyToOne(() => RecordType, (recordType) => recordType.medicalRecords, {
    nullable: true,
  })
  @JoinColumn({ name: "record_type_id" })
  recordType?: RecordType;

  @Column({ nullable: true })
  title: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "text", nullable: true })
  diagnosis?: string;

  @Column({ type: "text", nullable: true })
  treatment?: string;

  @Column({ type: "text", nullable: true })
  prescription?: string;

  @Column({ type: "text", nullable: true })
  notes?: string;

  // Signos vitales específicos para odontología
  @Column({ name: "vital_signs", type: "json", nullable: true })
  vitalSigns?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    weight?: number;
    height?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
    painLevel?: number; // Escala del 1-10
    allergies?: string[];
  };

  // Resultados de laboratorio y radiografías
  @Column({ name: "lab_results", type: "json", nullable: true })
  labResults?: {
    testName: string;
    result: string;
    normalRange: string;
    unit: string;
    date: Date;
    imageUrl?: string; // Para radiografías
  }[];

  // Archivos adjuntos (radiografías, fotografías, documentos)
  @Column({ name: "attachments", type: "json", nullable: true })
  attachments?: {
    filename: string;
    url: string;
    type: string; // 'radiography', 'photo', 'document', 'prescription'
    description?: string;
    uploadedAt: Date;
  }[];

  @Column({ name: "follow_up_date", type: "date", nullable: true })
  followUpDate?: Date;

  // --- Campos específicos para multiclinicas odontológicas ---

  // Clínica donde se realizó el procedimiento (REQUERIDO para segmentación)
  @Column({ name: "clinic_id" })
  clinicId: number;

  // Dientes específicos afectados (puede ser múltiple)
  @Column({ name: "tooth_numbers", type: "json", nullable: true })
  toothNumbers?: string[]; // ['11', '12', '21'] - Notación FDI

  // Superficies del diente afectadas
  @Column({ name: "tooth_surfaces", type: "json", nullable: true })
  toothSurfaces?: {
    toothNumber: string;
    surfaces: string[]; // ['mesial', 'distal', 'oclusal', 'vestibular', 'lingual']
    condition: ToothCondition;
  }[];

  // Datos específicos del odontograma
  @Column({ name: "odontogram_data", type: "json", nullable: true })
  odontogramData?: {
    toothNumber: string;
    procedures: {
      type: string;
      status: ProcedureStatus;
      date: Date;
      cost?: number;
      notes?: string;
    }[];
    conditions: {
      condition: ToothCondition;
      severity?: "mild" | "moderate" | "severe";
      notes?: string;
    }[];
  }[];

  // Código del procedimiento odontológico
  @Column({ name: "procedure_code", nullable: true })
  procedureCode?: string;

  // Estado del procedimiento
  @Column({
    name: "procedure_status",
    type: "enum",
    enum: ProcedureStatus,
    default: ProcedureStatus.COMPLETED,
  })
  procedureStatus: ProcedureStatus;

  // Costo del procedimiento
  @Column({
    name: "procedure_cost",
    type: "decimal",
    precision: 10,
    scale: 2,
    nullable: true,
  })
  procedureCost?: number;

  // Duración del procedimiento en minutos
  @Column({ name: "procedure_duration", nullable: true })
  procedureDuration?: number;

  // Material utilizado
  @Column({ name: "materials_used", type: "json", nullable: true })
  materialsUsed?: {
    name: string;
    quantity: number;
    unit: string;
    cost?: number;
  }[];

  // Usuario que creó el registro
  @Column({ name: "created_by" })
  createdBy: number;

  // Relaciones
  @Column({ name: "patient_id" })
  patientId: number;

  @Column({ name: "doctor_id" })
  doctorId: number;

  @Column({ name: "appointment_id", nullable: true })
  appointmentId?: number;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: "patient_id" })
  patient: Patient;

  @ManyToOne(() => Doctor)
  @JoinColumn({ name: "doctor_id" })
  doctor: Doctor;

  @ManyToOne(() => Appointment, { nullable: true })
  @JoinColumn({ name: "appointment_id" })
  appointment?: Appointment;

  // Relaciones many-to-many con tratamientos y diagnósticos
  @ManyToMany(() => Treatment, (treatment) => treatment.medicalRecords)
  @JoinTable({
    name: "medical_record_treatments",
    joinColumn: { name: "medical_record_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "treatment_id", referencedColumnName: "id" },
  })
  treatments?: Treatment[];

  @ManyToMany(() => Diagnosis, (diagnosis) => diagnosis.medicalRecords)
  @JoinTable({
    name: "medical_record_diagnoses",
    joinColumn: { name: "medical_record_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "diagnosis_id", referencedColumnName: "id" },
  })
  diagnoses?: Diagnosis[];

  // Método para generar código automáticamente
  @BeforeInsert()
  generateRecordCode() {
    if (!this.recordCode) {
      const timestamp = Date.now().toString();
      const clinicPrefix = this.clinicId.toString().padStart(2, "0");
      // Usar recordTypeId si no hay recordType cargado
      const typePrefix =
        this.recordType?.code?.substring(0, 3).toUpperCase() || "GEN";
      this.recordCode = `${clinicPrefix}-${typePrefix}-${timestamp.slice(-8)}`;
    }
  }
}
