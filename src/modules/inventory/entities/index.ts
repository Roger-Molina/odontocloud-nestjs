// Entidades principales
export {
  InventoryItem,
  InventoryMovement,
  ItemStatus,
  MovementType,
} from "./inventory.entity";
export { InventoryClinicStock } from "./inventory-clinic-stock.entity";

// Nuevas entidades del sistema mejorado
export { Supplier } from "./supplier.entity";
export { ItemCategory } from "./item-category.entity";
export { PurchaseOrder, PurchaseOrderStatus } from "./purchase-order.entity";
export { PurchaseOrderItem } from "./purchase-order-item.entity";
export { InventoryBatch } from "./inventory-batch.entity";
