import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { BaseEntity } from "../../../common/entities/base.entity";
import { User } from "../../users/entities/user.entity";
import { Clinic } from "../../clinics/entities/clinic.entity";
import { Specialty } from "./specialty.entity";

export enum DoctorStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  ON_LEAVE = "on_leave",
}

@Entity("doctors")
export class Doctor extends BaseEntity {
  @ManyToMany(() => Specialty, (specialty) => specialty.doctors, {
    cascade: true,
  })
  @JoinTable({ name: "doctor_specialties" })
  specialties?: Specialty[];

  @Column({ name: "doctor_code", unique: true })
  doctorCode: string;

  @Column({ name: "medical_license", unique: true })
  medicalLicense: string;

  @Column({ name: "years_experience", type: "int" })
  yearsExperience: number;

  @Column({ type: "enum", enum: DoctorStatus, default: DoctorStatus.ACTIVE })
  status: DoctorStatus;

  @Column({ type: "text", nullable: true })
  biography?: string;

  @Column({
    name: "consultation_fee",
    type: "decimal",
    precision: 10,
    scale: 2,
  })
  consultationFee: number;

  @Column({ name: "consultation_duration", type: "int", default: 30 })
  consultationDuration: number; // in minutes

  @Column({ name: "user_id" })
  userId: number;

  @Column({ name: "clinic_id" })
  clinicId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Clinic)
  @JoinColumn({ name: "clinic_id" })
  clinic: Clinic;
}
