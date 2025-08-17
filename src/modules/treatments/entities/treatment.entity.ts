import { Entity, Column, ManyToMany } from "typeorm";
import { BaseEntity } from "../../../common/entities/base.entity";
import { MedicalRecord } from "../../medical-records/entities/medical-record.entity";

export enum TreatmentCategory {
  PREVENTIVE = "preventive",
  RESTORATIVE = "restorative",
  ENDODONTIC = "endodontic",
  PERIODONTIC = "periodontic",
  ORTHODONTIC = "orthodontic",
  ORAL_SURGERY = "oral_surgery",
  PROSTHODONTIC = "prosthodontic",
  COSMETIC = "cosmetic",
  EMERGENCY = "emergency",
  CONSULTATION = "consultation",
}

export enum TreatmentStatus {
  AVAILABLE = "available",
  DEPRECATED = "deprecated",
  RESTRICTED = "restricted",
}

@Entity("treatments")
export class Treatment extends BaseEntity {
  @Column({ name: "treatment_code", unique: true, nullable: true })
  treatmentCode?: string;

  @Column()
  name: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({
    type: "enum",
    enum: TreatmentCategory,
    nullable: true,
  })
  category?: TreatmentCategory;

  @Column({
    type: "enum",
    enum: TreatmentStatus,
    default: TreatmentStatus.AVAILABLE,
  })
  status: TreatmentStatus;

  // Relación many-to-many con registros médicos
  @ManyToMany(() => MedicalRecord, (medicalRecord) => medicalRecord.treatments)
  medicalRecords?: MedicalRecord[];
}
