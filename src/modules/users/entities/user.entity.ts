import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "../../../common/entities/base.entity";
import { Clinic } from "../../clinics/entities/clinic.entity";

export enum UserRole {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  DOCTOR = "doctor",
  NURSE = "nurse",
  RECEPTIONIST = "receptionist",
  PATIENT = "patient",
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
}

@Entity("users")
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ name: "first_name" })
  firstName: string;

  @Column({ name: "middle_name", nullable: true })
  middleName?: string;

  @Column({ name: "last_name" })
  lastName: string;

  @Column({ name: "second_last_name", nullable: true })
  secondLastName?: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.PATIENT })
  role: UserRole;

  @Column({ type: "enum", enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Column({ name: "phone_number", nullable: true })
  phoneNumber?: string;

  @Column({ name: "profile_picture", nullable: true })
  profilePicture?: string;

  @Column({ name: "email_verified_at", type: "timestamp", nullable: true })
  emailVerifiedAt?: Date;

  @Column({ name: "last_login_at", type: "timestamp", nullable: true })
  lastLoginAt?: Date;

  @Column({ name: "clinic_id", nullable: true })
  clinicId?: number;

  // Computed property for isActive based on status
  get isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  @ManyToOne(() => Clinic, { nullable: true })
  @JoinColumn({ name: "clinic_id" })
  clinic?: Clinic;
}
