import { Entity, Column, ManyToOne, JoinColumn, Unique } from "typeorm";
import { BaseEntity } from "../../../common/entities/base.entity";
import { InventoryItem } from "./inventory.entity";
import { Clinic } from "../../clinics/entities/clinic.entity";

@Entity("inventory_clinic_stock")
@Unique(["inventoryItemId", "clinicId"])
export class InventoryClinicStock extends BaseEntity {
  @Column({ name: "current_stock", type: "int", default: 0 })
  currentStock: number;

  @Column({ name: "minimum_stock", type: "int", default: 0 })
  minimumStock: number;

  @Column({ name: "maximum_stock", type: "int", default: 0 })
  maximumStock: number;

  @Column({ name: "reorder_point", type: "int", default: 0 })
  reorderPoint: number;

  @Column({ name: "storage_location", nullable: true })
  storageLocation?: string;

  @Column({
    name: "last_updated",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  lastUpdated: Date;

  @Column({ name: "inventory_item_id" })
  inventoryItemId: number;

  @Column({ name: "clinic_id" })
  clinicId: number;

  @ManyToOne(() => InventoryItem)
  @JoinColumn({ name: "inventory_item_id" })
  inventoryItem: InventoryItem;

  @ManyToOne(() => Clinic)
  @JoinColumn({ name: "clinic_id" })
  clinic: Clinic;
}
