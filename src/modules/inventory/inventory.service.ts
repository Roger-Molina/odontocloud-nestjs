import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { InventoryItem, ItemStatus } from "./entities/inventory.entity";
import { Supplier } from "./entities/supplier.entity";
import { ItemCategory } from "./entities/item-category.entity";
import { CreateInventoryItemDto } from "./dto/create-inventory-item.dto";
import { UpdateInventoryItemDto } from "./dto/update-inventory-item.dto";

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryItem)
    private inventoryRepository: Repository<InventoryItem>,
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
    @InjectRepository(ItemCategory)
    private categoryRepository: Repository<ItemCategory>,
  ) {}

  async create(
    createInventoryItemDto: CreateInventoryItemDto,
  ): Promise<InventoryItem> {
    try {
      // Crear el objeto de manera explícita para evitar problemas de tipos
      const itemData: Partial<InventoryItem> = {
        itemCode: createInventoryItemDto.itemCode,
        name: createInventoryItemDto.name,
        description: createInventoryItemDto.description,
        category: createInventoryItemDto.category as any, // Cast temporal
        brand: createInventoryItemDto.brand,
        manufacturer: createInventoryItemDto.manufacturer,
        unitOfMeasure: createInventoryItemDto.unitOfMeasure,
        unitCost: createInventoryItemDto.unitCost,
        sellingPrice: createInventoryItemDto.sellingPrice,
        currentStock: createInventoryItemDto.currentStock,
        minimumStock: createInventoryItemDto.minimumStock,
        maximumStock: createInventoryItemDto.maximumStock,
        reorderPoint: createInventoryItemDto.reorderPoint,
        status: createInventoryItemDto.status,
        storageLocation: createInventoryItemDto.storageLocation,
        requiresPrescription: createInventoryItemDto.requiresPrescription,
        categoryId: createInventoryItemDto.categoryId,
        defaultSupplierId: createInventoryItemDto.defaultSupplierId,
        requiresBatchControl: createInventoryItemDto.requiresBatchControl,
        autoReorder: createInventoryItemDto.autoReorder,
      };

      const item = this.inventoryRepository.create(itemData);
      return await this.inventoryRepository.save(item);
    } catch (error) {
      if (error.code === "23505") {
        throw new ConflictException("Ya existe un artículo con este código");
      }
      throw error;
    }
  }

  async findAll(): Promise<InventoryItem[]> {
    return await this.inventoryRepository.find({
      order: { name: "ASC" },
    });
  }

  async findOne(id: number): Promise<InventoryItem> {
    const item = await this.inventoryRepository.findOne({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException(`Artículo con ID ${id} no encontrado`);
    }

    return item;
  }

  async findByCategory(category: string): Promise<InventoryItem[]> {
    return await this.inventoryRepository.find({
      where: { category: category as any },
      order: { name: "ASC" },
    });
  }

  async findLowStock(): Promise<InventoryItem[]> {
    return await this.inventoryRepository
      .createQueryBuilder("item")
      .where("item.currentStock <= item.minimumStock")
      .orderBy("item.currentStock", "ASC")
      .getMany();
  }

  async findActive(): Promise<InventoryItem[]> {
    return await this.inventoryRepository.find({
      where: { status: ItemStatus.ACTIVE },
      order: { name: "ASC" },
    });
  }

  async update(
    id: number,
    updateInventoryItemDto: UpdateInventoryItemDto,
  ): Promise<InventoryItem> {
    const item = await this.findOne(id);

    try {
      Object.assign(item, updateInventoryItemDto);
      return await this.inventoryRepository.save(item);
    } catch (error) {
      if (error.code === "23505") {
        throw new ConflictException("Ya existe un artículo con este código");
      }
      throw error;
    }
  }

  async adjustStock(
    id: number,
    quantity: number,
    reason?: string,
  ): Promise<InventoryItem> {
    const item = await this.findOne(id);
    item.currentStock += quantity;

    if (item.currentStock < 0) {
      item.currentStock = 0;
    }

    return await this.inventoryRepository.save(item);
  }

  async remove(id: number): Promise<void> {
    const item = await this.findOne(id);
    await this.inventoryRepository.softRemove(item);
  }

  // Métodos para Suppliers
  async createSupplier(supplierData: Partial<Supplier>): Promise<Supplier> {
    try {
      const supplier = this.supplierRepository.create(supplierData);
      return await this.supplierRepository.save(supplier);
    } catch (error) {
      if (error.code === "23505") {
        throw new ConflictException(
          "Ya existe un proveedor con este código o email",
        );
      }
      throw error;
    }
  }

  async findAllSuppliers(): Promise<Supplier[]> {
    return await this.supplierRepository.find({
      where: { active: true },
      order: { companyName: "ASC" },
    });
  }

  async findOneSupplier(id: number): Promise<Supplier> {
    const supplier = await this.supplierRepository.findOne({
      where: { id, active: true },
    });

    if (!supplier) {
      throw new NotFoundException(`Proveedor con ID ${id} no encontrado`);
    }

    return supplier;
  }

  async updateSupplier(
    id: number,
    supplierData: Partial<Supplier>,
  ): Promise<Supplier> {
    const supplier = await this.findOneSupplier(id);
    Object.assign(supplier, supplierData);
    return await this.supplierRepository.save(supplier);
  }

  async removeSupplier(id: number): Promise<void> {
    const supplier = await this.findOneSupplier(id);
    supplier.active = false;
    await this.supplierRepository.save(supplier);
  }

  // Métodos para Categories
  async createCategory(
    categoryData: Partial<ItemCategory>,
  ): Promise<ItemCategory> {
    try {
      const category = this.categoryRepository.create(categoryData);
      return await this.categoryRepository.save(category);
    } catch (error) {
      if (error.code === "23505") {
        throw new ConflictException("Ya existe una categoría con este nombre");
      }
      throw error;
    }
  }

  async findAllCategories(): Promise<ItemCategory[]> {
    return await this.categoryRepository.find({
      where: { active: true },
      order: { name: "ASC" },
    });
  }

  async findOneCategory(id: number): Promise<ItemCategory> {
    const category = await this.categoryRepository.findOne({
      where: { id, active: true },
    });

    if (!category) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }

    return category;
  }

  async updateCategory(
    id: number,
    categoryData: Partial<ItemCategory>,
  ): Promise<ItemCategory> {
    const category = await this.findOneCategory(id);
    Object.assign(category, categoryData);
    return await this.categoryRepository.save(category);
  }

  async removeCategory(id: number): Promise<void> {
    const category = await this.findOneCategory(id);
    category.active = false;
    await this.categoryRepository.save(category);
  }
}
