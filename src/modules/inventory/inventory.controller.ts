import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
} from "@nestjs/common";
import { InventoryService } from "./inventory.service";
import { CreateInventoryItemDto } from "./dto/create-inventory-item.dto";
import { UpdateInventoryItemDto } from "./dto/update-inventory-item.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { UserRole } from "../users/entities/user.entity";

@Controller("inventory")
@UseGuards(JwtAuthGuard, RolesGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post("items")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  createItem(
    @Body() createInventoryItemDto: CreateInventoryItemDto,
    @CurrentUser() user: any,
  ) {
    return this.inventoryService.create(createInventoryItemDto);
  }

  @Get("items")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  findAllItems(
    @Query("category") category?: string,
    @CurrentUser() user?: any,
  ) {
    if (category) {
      return this.inventoryService.findByCategory(category);
    }
    return this.inventoryService.findAll();
  }

  @Get("items/active")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  findActiveItems(@CurrentUser() user: any) {
    return this.inventoryService.findActive();
  }

  @Get("items/low-stock")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  findLowStockItems(@CurrentUser() user: any) {
    return this.inventoryService.findLowStock();
  }

  @Get("items/:id")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  findOneItem(@Param("id", ParseIntPipe) id: number, @CurrentUser() user: any) {
    return this.inventoryService.findOne(id);
  }

  @Patch("items/:id")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  updateItem(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateInventoryItemDto: UpdateInventoryItemDto,
    @CurrentUser() user: any,
  ) {
    return this.inventoryService.update(id, updateInventoryItemDto);
  }

  @Patch("items/:id/adjust-stock")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  adjustStock(
    @Param("id", ParseIntPipe) id: number,
    @Body("quantity") quantity: number,
    @Body("reason") reason?: string,
    @CurrentUser() user?: any,
  ) {
    return this.inventoryService.adjustStock(id, quantity, reason);
  }

  @Delete("items/:id")
  @Roles(UserRole.ADMIN)
  removeItem(@Param("id", ParseIntPipe) id: number, @CurrentUser() user: any) {
    return this.inventoryService.remove(id);
  }

  // Endpoints para Suppliers
  @Post("suppliers")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  createSupplier(@Body() supplierData: any, @CurrentUser() user: any) {
    return this.inventoryService.createSupplier(supplierData);
  }

  @Get("suppliers")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  findAllSuppliers(@CurrentUser() user: any) {
    return this.inventoryService.findAllSuppliers();
  }

  @Get("suppliers/:id")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  findOneSupplier(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return this.inventoryService.findOneSupplier(id);
  }

  @Patch("suppliers/:id")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  updateSupplier(
    @Param("id", ParseIntPipe) id: number,
    @Body() supplierData: any,
    @CurrentUser() user: any,
  ) {
    return this.inventoryService.updateSupplier(id, supplierData);
  }

  @Delete("suppliers/:id")
  @Roles(UserRole.ADMIN)
  removeSupplier(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return this.inventoryService.removeSupplier(id);
  }

  // Endpoints para Categories
  @Post("categories")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  createCategory(@Body() categoryData: any, @CurrentUser() user: any) {
    return this.inventoryService.createCategory(categoryData);
  }

  @Get("categories")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  findAllCategories(@CurrentUser() user: any) {
    return this.inventoryService.findAllCategories();
  }

  @Get("categories/:id")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  findOneCategory(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return this.inventoryService.findOneCategory(id);
  }

  @Patch("categories/:id")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  updateCategory(
    @Param("id", ParseIntPipe) id: number,
    @Body() categoryData: any,
    @CurrentUser() user: any,
  ) {
    return this.inventoryService.updateCategory(id, categoryData);
  }

  @Delete("categories/:id")
  @Roles(UserRole.ADMIN)
  removeCategory(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return this.inventoryService.removeCategory(id);
  }
}
