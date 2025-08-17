import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from "typeorm";
import { BaseEntity } from "../../../common/entities/base.entity";
import { User } from "../../users/entities/user.entity";
import { DocumentType } from "./document-type.entity";
import { BloodType as BloodTypeEntity } from "./blood-type.entity";
import { Allergy } from "./allergy.entity";
import { PatientDocument } from "./patient-document.entity";

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

@Entity("patients")
export class Patient extends BaseEntity {
  @Column({ name: "patient_code", unique: true })
  patientCode: string;

  @Column({ name: "first_name" })
  firstName: string;

  @Column({ name: "second_name", nullable: true })
  secondName?: string;

  @Column({ name: "first_last_name" })
  firstLastName: string;

  @Column({ name: "second_last_name", nullable: true })
  secondLastName?: string;

  @Column({ name: "document_type_id" })
  documentTypeId: number;

  @ManyToOne(() => DocumentType)
  @JoinColumn({ name: "document_type_id" })
  documentType: DocumentType;

  @Column({ name: "document_number" })
  documentNumber: string;

  @Column({ type: "date", name: "birth_date" })
  birthDate: Date;

  @Column({ type: "enum", enum: Gender })
  gender: Gender;

  @Column()
  address: string;

  @Column({ name: "phone_number" })
  phoneNumber: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ name: "emergency_contact_name" })
  emergencyContactName: string;

  @Column({ name: "emergency_contact_phone" })
  emergencyContactPhone: string;

  @Column({ name: "blood_type_id", nullable: true })
  bloodTypeId?: number;

  @ManyToOne(() => BloodTypeEntity, { nullable: true })
  @JoinColumn({ name: "blood_type_id" })
  bloodType?: BloodTypeEntity;

  @Column({ name: "user_id", nullable: true })
  userId?: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "user_id" })
  user?: User;

  @ManyToMany(() => Allergy, { cascade: true })
  @JoinTable({
    name: "patient_allergies",
    joinColumn: { name: "patient_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "allergy_id", referencedColumnName: "id" },
  })
  allergies?: Allergy[];

  @OneToMany(() => PatientDocument, (document) => document.patient)
  documents?: PatientDocument[];

  @Column({ name: "clinic_id", nullable: true })
  clinicId?: number;

  @Column({ name: "profile_photo_path", nullable: true })
  profilePhotoPath?: string;

  @Column({ type: "text", name: "medical_alerts", nullable: true })
  medicalAlerts?: string;
}
