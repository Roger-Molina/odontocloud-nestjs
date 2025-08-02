import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "../../../common/entities/base.entity";
import { Clinic } from "../../clinics/entities/clinic.entity";
import { ItemCategory } from "./item-category.entity";
import { Supplier } from "./supplier.entity";
import { InventoryBatch } from "./inventory-batch.entity";

// Mantener enums para compatibilidad hacia atrás
export enum ItemCategory_Old {
  MEDICINE = "MEDICINE",
  MEDICAL_SUPPLY = "MEDICAL_SUPPLY",
  EQUIPMENT = "EQUIPMENT",
  DENTAL_SUPPLY = "DENTAL_SUPPLY",
  CONSUMABLE = "CONSUMABLE",
  OTHER = "OTHER",
}

export enum ItemStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DISCONTINUED = "DISCONTINUED",
}

export enum MovementType {
  ENTRY = "ENTRY",
  EXIT = "EXIT",
  ADJUSTMENT = "ADJUSTMENT",
  TRANSFER = "TRANSFER",
}

@Entity("inventory_items")
export class InventoryItem extends BaseEntity {
  @Column({ name: "item_code", unique: true })
  itemCode: string;

  @Column()
  name: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "enum", enum: ItemCategory_Old })
  category: ItemCategory_Old;

  @Column({ nullable: true })
  brand?: string;

  @Column({ nullable: true })
  manufacturer?: string;

  @Column({ name: "unit_of_measure" })
  unitOfMeasure: string;

  @Column({
    name: "unit_cost",
    type: "decimal",
    precision: 10,
    scale: 2,
    default: 0,
  })
  unitCost: number;

  @Column({
    name: "selling_price",
    type: "decimal",
    precision: 10,
    scale: 2,
    default: 0,
  })
  sellingPrice: number;

  @Column({ name: "current_stock", type: "int", default: 0 })
  currentStock: number;

  @Column({ name: "minimum_stock", type: "int", default: 0 })
  minimumStock: number;

  @Column({ name: "maximum_stock", type: "int", default: 0 })
  maximumStock: number;

  @Column({ name: "reorder_point", type: "int", default: 0 })
  reorderPoint: number;

  @Column({ type: "enum", enum: ItemStatus, default: ItemStatus.ACTIVE })
  status: ItemStatus;

  @Column({ name: "expiration_date", type: "date", nullable: true })
  expirationDate?: Date;

  @Column({ name: "batch_number", nullable: true })
  batchNumber?: string;

  @Column({ name: "storage_location", nullable: true })
  storageLocation?: string;

  @Column({ name: "requires_prescription", type: "boolean", default: false })
  requiresPrescription: boolean;

  // Nuevas columnas para mejorar el sistema
  @Column({ name: "category_id", nullable: true })
  categoryId?: number;

  @Column({ name: "default_supplier_id", nullable: true })
  defaultSupplierId?: number;

  @Column({ name: "requires_batch_control", type: "boolean", default: false })
  requiresBatchControl: boolean;

  @Column({ name: "auto_reorder", type: "boolean", default: false })
  autoReorder: boolean;

  // Nuevas relaciones
  @ManyToOne(() => ItemCategory, { nullable: true })
  @JoinColumn({ name: "category_id" })
  categoryNew?: ItemCategory;

  @ManyToOne(() => Supplier, { nullable: true })
  @JoinColumn({ name: "default_supplier_id" })
  defaultSupplier?: Supplier;

  @OneToMany(() => InventoryBatch, (batch) => batch.item)
  batches: InventoryBatch[];

  @OneToMany(() => InventoryMovement, (movement) => movement.item)
  movements: InventoryMovement[];
}

@Entity("inventory_movements")
export class InventoryMovement extends BaseEntity {
  @Column({ name: "movement_number", unique: true })
  movementNumber: string;

  @Column({ type: "enum", enum: MovementType })
  type: MovementType;

  @Column({ type: "int" })
  quantity: number;

  @Column({
    name: "unit_cost",
    type: "decimal",
    precision: 10,
    scale: 2,
    nullable: true,
  })
  unitCost?: number;

  @Column({ name: "movement_date", type: "date" })
  movementDate: Date;

  @Column({ type: "text", nullable: true })
  reason?: string;

  @Column({ type: "text", nullable: true })
  notes?: string;

  @Column({ name: "reference_number", nullable: true })
  referenceNumber?: string;

  @Column({ name: "item_id" })
  itemId: number;

  @Column({ name: "clinic_id" })
  clinicId: number;

  // Nuevas columnas para mejorar trazabilidad
  @Column({ name: "batch_id", nullable: true })
  batchId?: number;

  @Column({ name: "invoice_item_id", nullable: true })
  invoiceItemId?: number;

  @Column({ name: "treatment_id", nullable: true })
  treatmentId?: number;

  @ManyToOne(() => InventoryItem, (item) => item.movements)
  @JoinColumn({ name: "item_id" })
  item: InventoryItem;

  @ManyToOne(() => Clinic)
  @JoinColumn({ name: "clinic_id" })
  clinic: Clinic;

  // Nuevas relaciones
  @ManyToOne(() => InventoryBatch, { nullable: true })
  @JoinColumn({ name: "batch_id" })
  batch?: InventoryBatch;

  // Las relaciones con InvoiceItem y Treatment se agregarán cuando creemos esas conexiones
  // @ManyToOne(() => InvoiceItem, { nullable: true })
  // @JoinColumn({ name: 'invoice_item_id' })
  // invoiceItem?: InvoiceItem;

  // @ManyToOne(() => Treatment, { nullable: true })
  // @JoinColumn({ name: 'treatment_id' })
  // treatment?: Treatment;
}
