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
  @Column({ name: "treatment_code", unique: true })
  treatmentCode: string;

  @Column()
  name: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "enum", enum: TreatmentCategory })
  category: TreatmentCategory;

  @Column({
    name: "base_cost",
    type: "decimal",
    precision: 10,
    scale: 2,
    nullable: true,
  })
  baseCost?: number;

  @Column({
    name: "estimated_duration",
    type: "int",
    nullable: true,
    comment: "Duration in minutes",
  })
  estimatedDuration?: number;

  @Column({
    name: "requires_anesthesia",
    type: "boolean",
    default: false,
  })
  requiresAnesthesia: boolean;

  @Column({
    name: "tooth_specific",
    type: "boolean",
    default: false,
    comment: "Whether this treatment is applied to specific teeth",
  })
  toothSpecific: boolean;

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
