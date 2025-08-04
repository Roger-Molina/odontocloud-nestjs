import { Entity, Column, ManyToMany } from "typeorm";
import { BaseEntity } from "../../../common/entities/base.entity";
import { MedicalRecord } from "../../medical-records/entities/medical-record.entity";

export enum DiagnosisCategory {
  CARIES = "caries",
  PERIODONTAL = "periodontal",
  ENDODONTIC = "endodontic",
  ORTHODONTIC = "orthodontic",
  ORAL_SURGERY = "oral_surgery",
  ORAL_PATHOLOGY = "oral_pathology",
  TMJ = "tmj",
  TRAUMA = "trauma",
  CONGENITAL = "congenital",
  PREVENTIVE = "preventive",
}

export enum DiagnosisSeverity {
  MILD = "mild",
  MODERATE = "moderate",
  SEVERE = "severe",
  CRITICAL = "critical",
}

export enum DiagnosisStatus {
  ACTIVE = "active",
  RESOLVED = "resolved",
  CHRONIC = "chronic",
  INACTIVE = "inactive",
}

@Entity("diagnoses")
export class Diagnosis extends BaseEntity {
  @Column({ name: "diagnosis_code", unique: true })
  diagnosisCode: string; // ICD-10 or custom code

  @Column()
  name: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "enum", enum: DiagnosisCategory })
  category: DiagnosisCategory;

  @Column({ type: "enum", enum: DiagnosisSeverity, nullable: true })
  severity?: DiagnosisSeverity;

  @Column({
    name: "is_chronic",
    type: "boolean",
    default: false,
  })
  isChronic: boolean;

  @Column({
    name: "requires_immediate_attention",
    type: "boolean",
    default: false,
  })
  requiresImmediateAttention: boolean;

  @Column({
    name: "tooth_specific",
    type: "boolean",
    default: false,
    comment: "Whether this diagnosis is related to specific teeth",
  })
  toothSpecific: boolean;

  @Column({
    type: "enum",
    enum: DiagnosisStatus,
    default: DiagnosisStatus.ACTIVE,
  })
  status: DiagnosisStatus;

  // Relación many-to-many con registros médicos
  @ManyToMany(() => MedicalRecord, (medicalRecord) => medicalRecord.diagnoses)
  medicalRecords?: MedicalRecord[];
}
