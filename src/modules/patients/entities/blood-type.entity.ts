import { Entity, Column } from "typeorm";
import { BaseEntity } from "../../../common/entities/base.entity";

@Entity("blood_types")
export class BloodType extends BaseEntity {
  @Column({ name: "code", unique: true })
  code: string;

  @Column({ name: "description" })
  description: string;
}
