import { Entity, Column, ManyToOne, JoinColumn, Unique } from "typeorm";
import { BaseEntity } from "../../../common/entities/base.entity";
import { Patient } from "./patient.entity";
import { Clinic } from "../../clinics/entities/clinic.entity";

export enum PatientClinicStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  TRANSFERRED = "transferred",
}

@Entity("patient_clinics")
@Unique(["patientId", "clinicId"]) // Un paciente puede estar en múltiples clínicas
export class PatientClinic extends BaseEntity {
  @Column({ name: "patient_code_clinic", unique: true })
  patientCodeClinic: string; // Código único del paciente en esta clínica específica

  @Column({ name: "registration_date", type: "date" })
  registrationDate: Date;

  @Column({
    type: "enum",
    enum: PatientClinicStatus,
    default: PatientClinicStatus.ACTIVE,
  })
  status: PatientClinicStatus;

  @Column({ type: "text", nullable: true })
  notes?: string; // Notas específicas de esta clínica

  @Column({ name: "referring_doctor", nullable: true })
  referringDoctor?: string; // Doctor que refirió al paciente

  @Column({ name: "insurance_info", type: "json", nullable: true })
  insuranceInfo?: {
    provider: string;
    policyNumber: string;
    validUntil: Date;
    coverage: string;
  };

  @Column({ name: "patient_id" })
  patientId: number;

  @Column({ name: "clinic_id" })
  clinicId: number;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: "patient_id" })
  patient: Patient;

  @ManyToOne(() => Clinic)
  @JoinColumn({ name: "clinic_id" })
  clinic: Clinic;
}
