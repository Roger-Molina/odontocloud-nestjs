import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "../../../common/entities/base.entity";
import { Patient } from "./patient.entity";
import { User } from "../../users/entities/user.entity";

@Entity("patient_notes")
export class PatientNote extends BaseEntity {
  @Column({ name: "patient_id" })
  patientId: number;

  @ManyToOne(() => Patient, { onDelete: "CASCADE" })
  @JoinColumn({ name: "patient_id" })
  patient: Patient;

  @Column({ type: "text" })
  content: string;

  @Column({ name: "created_by", nullable: true })
  createdBy?: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "created_by" })
  createdByUser?: User;

  @Column({ name: "clinic_id", nullable: true })
  clinicId?: number;
}
