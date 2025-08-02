import { Entity, Column } from "typeorm";
import { BaseEntity } from "../../../common/entities/base.entity";

@Entity("document_types")
export class DocumentType extends BaseEntity {
  @Column({ name: "code", unique: true })
  code: string;

  @Column({ name: "description" })
  description: string;
}
