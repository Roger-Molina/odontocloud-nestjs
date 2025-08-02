import { Entity, Column } from "typeorm";
import { BaseEntity } from "../../../common/entities/base.entity";

export enum ClinicStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  MAINTENANCE = "maintenance",
}

@Entity("clinics")
export class Clinic extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column({ name: "postal_code" })
  postalCode: string;

  @Column()
  country: string;

  @Column({ name: "phone_number" })
  phoneNumber: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ type: "enum", enum: ClinicStatus, default: ClinicStatus.ACTIVE })
  status: ClinicStatus;

  @Column({ name: "opening_hours", type: "json", nullable: true })
  openingHours?: {
    monday?: { open: string; close: string };
    tuesday?: { open: string; close: string };
    wednesday?: { open: string; close: string };
    thursday?: { open: string; close: string };
    friday?: { open: string; close: string };
    saturday?: { open: string; close: string };
    sunday?: { open: string; close: string };
  };

  @Column({ name: "emergency_contact", nullable: true })
  emergencyContact?: string;

  @Column({ name: "license_number", unique: true, nullable: true })
  licenseNumber?: string;

  @Column({ name: "tax_id", unique: true, nullable: true })
  taxId?: string;
}
