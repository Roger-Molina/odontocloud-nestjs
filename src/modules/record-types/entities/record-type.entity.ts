import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from "typeorm";
import { MedicalRecord } from "../../medical-records/entities/medical-record.entity";

@Entity("record_types")
export class RecordType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  code: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ length: 50, nullable: true })
  category?: string; // general, dental, emergency, etc.

  @Column({ length: 20, default: "#6c757d" })
  color: string; // Color para la UI

  @Column({ length: 20, nullable: true })
  icon?: string; // Icono para la UI

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  sortOrder: number;

  // Configuración específica para odontología
  @Column({ default: false })
  requiresTeeth: boolean; // Si requiere selección de dientes

  @Column({ default: false })
  allowsOdontogram: boolean; // Si permite usar odontograma

  @Column({ type: "simple-array", nullable: true })
  requiredFields?: string[]; // Campos obligatorios específicos

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  // Relaciones
  @OneToMany(() => MedicalRecord, (record) => record.recordType)
  medicalRecords: MedicalRecord[];
}
