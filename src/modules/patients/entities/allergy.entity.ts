import { Entity, Column } from "typeorm";
import { BaseEntity } from "../../../common/entities/base.entity";

@Entity("allergies")
export class Allergy extends BaseEntity {
  @Column({ name: "name", unique: true })
  name: string;

  @Column({ name: "description", nullable: true })
  description?: string;
}
