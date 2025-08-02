import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { BaseEntity } from "../../../common/entities/base.entity";
import { InventoryItem } from "./inventory.entity";

@Entity("item_categories")
export class ItemCategory extends BaseEntity {
  @Column({ name: "category_code", unique: true })
  categoryCode: string;

  @Column()
  name: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ name: "parent_id", nullable: true })
  parentId?: number;

  @Column({ type: "boolean", default: true })
  active: boolean;

  @Column({ type: "int", default: 0 })
  sortOrder: number;

  @ManyToOne(() => ItemCategory, { nullable: true })
  @JoinColumn({ name: "parent_id" })
  parent?: ItemCategory;

  @OneToMany(() => ItemCategory, (category) => category.parent)
  children: ItemCategory[];

  @OneToMany(() => InventoryItem, (item) => item.category)
  items: InventoryItem[];
}
