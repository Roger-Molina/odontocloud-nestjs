import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "../../../common/entities/base.entity";
import { Patient } from "../../patients/entities/patient.entity";
import { Doctor } from "../../doctors/entities/doctor.entity";
import { Clinic } from "../../clinics/entities/clinic.entity";

export enum AppointmentStatus {
  SCHEDULED = "scheduled",
  CONFIRMED = "confirmed",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  NO_SHOW = "no_show",
}

export enum AppointmentType {
  CONSULTATION = "consultation",
  FOLLOW_UP = "follow_up",
  EMERGENCY = "emergency",
  PROCEDURE = "procedure",
  SURGERY = "surgery",
}

@Entity("appointments")
export class Appointment extends BaseEntity {
  @Column({ name: "appointment_code", unique: true })
  appointmentCode: string;

  @Column({ name: "appointment_date", type: "date" })
  appointmentDate: Date;

  @Column({ name: "appointment_time", type: "time" })
  appointmentTime: string;

  @Column({ name: "duration_minutes", type: "int", default: 30 })
  durationMinutes: number;

  @Column({
    type: "enum",
    enum: AppointmentStatus,
    default: AppointmentStatus.SCHEDULED,
  })
  status: AppointmentStatus;

  @Column({
    type: "enum",
    enum: AppointmentType,
    default: AppointmentType.CONSULTATION,
  })
  type: AppointmentType;

  @Column({ type: "text", nullable: true })
  notes?: string;

  @Column({ type: "text", nullable: true })
  reason?: string;

  @Column({
    name: "consultation_fee",
    type: "decimal",
    precision: 10,
    scale: 2,
  })
  consultationFee: number;

  @Column({ name: "patient_id" })
  patientId: number;

  @Column({ name: "doctor_id" })
  doctorId: number;

  @Column({ name: "clinic_id" })
  clinicId: number;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: "patient_id" })
  patient: Patient;

  @ManyToOne(() => Doctor)
  @JoinColumn({ name: "doctor_id" })
  doctor: Doctor;

  @ManyToOne(() => Clinic)
  @JoinColumn({ name: "clinic_id" })
  clinic: Clinic;

  @Column({ name: "confirmed_at", type: "timestamp", nullable: true })
  confirmedAt?: Date;

  @Column({ name: "cancelled_at", type: "timestamp", nullable: true })
  cancelledAt?: Date;

  @Column({ name: "cancellation_reason", nullable: true })
  cancellationReason?: string;
}
