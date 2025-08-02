import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from "typeorm";
import { Doctor } from "./doctor.entity";

@Entity("specialties")
export class Specialty {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToMany(() => Doctor, (doctor) => doctor.specialties)
  doctors: Doctor[];
}
