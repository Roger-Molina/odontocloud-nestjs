import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Budget, BudgetStatus } from "./budget.entity";
import { BudgetItem } from "./budget-item.entity";
import { CreateBudgetDto } from "./dto/create-budget.dto";
import { UpdateBudgetDto } from "./dto/update-budget.dto";

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(Budget)
    private budgetRepository: Repository<Budget>,
    @InjectRepository(BudgetItem)
    private budgetItemRepository: Repository<BudgetItem>,
  ) {}

  async create(createBudgetDto: CreateBudgetDto): Promise<Budget> {
    const budgetNumber = await this.generateBudgetNumber();

    // Calculate totals
    const subtotal = createBudgetDto.items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );
    const discountAmount = createBudgetDto.items.reduce((sum, item) => {
      const itemDiscountAmount = (item.unitPrice * item.discount) / 100;
      return sum + itemDiscountAmount * item.quantity;
    }, 0);
    const totalAmount = subtotal - discountAmount;

    // Create budget
    const budget = this.budgetRepository.create({
      ...createBudgetDto,
      budgetNumber,
      subtotal,
      discountAmount,
      totalAmount,
      status: BudgetStatus.DRAFT,
    });

    const savedBudget = await this.budgetRepository.save(budget);

    // Create budget items
    const budgetItems = createBudgetDto.items.map((item) =>
      this.budgetItemRepository.create({
        ...item,
        budgetId: savedBudget.id,
      }),
    );

    await this.budgetItemRepository.save(budgetItems);

    return this.findOne(savedBudget.id);
  }

  async findByPatient(patientId: number): Promise<Budget[]> {
    return this.budgetRepository.find({
      where: { patientId },
      order: { createdAt: "DESC" },
    });
  }

  async findOne(id: number): Promise<Budget> {
    const budget = await this.budgetRepository.findOne({
      where: { id },
      relations: ["items", "patient"],
    });

    if (!budget) {
      throw new NotFoundException(`Presupuesto con ID ${id} no encontrado`);
    }

    return budget;
  }

  async findOneForPdf(id: number): Promise<Budget> {
    const budget = await this.budgetRepository.findOne({
      where: { id },
      relations: ["items", "patient"],
    });

    if (!budget) {
      throw new NotFoundException(`Presupuesto con ID ${id} no encontrado`);
    }

    return budget;
  }

  async update(id: number, updateBudgetDto: UpdateBudgetDto): Promise<Budget> {
    const budget = await this.findOne(id);

    // Check if budget can be updated
    if (budget.status === BudgetStatus.APPROVED) {
      throw new BadRequestException("No se puede editar un presupuesto aprobado");
    }

    // Separar los items del resto de los datos
    const { items, ...budgetUpdateData } = updateBudgetDto;

    // If items are provided, recalculate totals
    if (items && items.length > 0) {
      // Delete existing items
      await this.budgetItemRepository.delete({ budgetId: id });

      // Calculate new totals
      const subtotal = items.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0,
      );
      const discountAmount = items.reduce((sum, item) => {
        const itemDiscountAmount = (item.unitPrice * item.discount) / 100;
        return sum + itemDiscountAmount * item.quantity;
      }, 0);
      const totalAmount = subtotal - discountAmount;

      // Update budget with new totals (sin los items)
      await this.budgetRepository.update(id, {
        ...budgetUpdateData,
        subtotal,
        discountAmount,
        totalAmount,
      });

      // Create new items
      const budgetItems = items.map((item) =>
        this.budgetItemRepository.create({
          ...item,
          budgetId: id,
        }),
      );

      await this.budgetItemRepository.save(budgetItems);
    } else {
      // Update only non-item fields
      await this.budgetRepository.update(id, budgetUpdateData);
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const budget = await this.findOne(id);

    if (budget.status === BudgetStatus.APPROVED) {
      throw new BadRequestException("No se puede eliminar un presupuesto aprobado");
    }

    await this.budgetRepository.remove(budget);
  }

  async approve(id: number): Promise<Budget> {
    const budget = await this.findOne(id);

    if (budget.status !== BudgetStatus.SENT) {
      throw new BadRequestException("Solo se pueden aprobar presupuestos enviados");
    }

    await this.budgetRepository.update(id, { status: BudgetStatus.APPROVED });
    return this.findOne(id);
  }

  async reject(id: number, reason?: string): Promise<Budget> {
    const budget = await this.findOne(id);

    if (budget.status !== BudgetStatus.SENT) {
      throw new BadRequestException("Solo se pueden rechazar presupuestos enviados");
    }

    await this.budgetRepository.update(id, {
      status: BudgetStatus.REJECTED,
      rejectionReason: reason,
    });
    return this.findOne(id);
  }

  async send(id: number): Promise<Budget> {
    const budget = await this.findOne(id);

    if (budget.status !== BudgetStatus.DRAFT) {
      throw new BadRequestException("Solo se pueden enviar presupuestos en borrador");
    }

    await this.budgetRepository.update(id, { status: BudgetStatus.SENT });
    return this.findOne(id);
  }

  private async generateBudgetNumber(): Promise<string> {
    const currentYear = new Date().getFullYear();
    
    // Usar LIKE para buscar presupuestos del año actual
    const count = await this.budgetRepository
      .createQueryBuilder('budget')
      .where('budget.budgetNumber LIKE :pattern', { 
        pattern: `${currentYear}-%` 
      })
      .getCount();

    const nextNumber = String(count + 1).padStart(4, "0");
    const budgetNumber = `${currentYear}-${nextNumber}`;
    
    // Verificar si ya existe (doble verificación por seguridad)
    const existing = await this.budgetRepository.findOne({
      where: { budgetNumber }
    });
    
    if (existing) {
      // Si existe, usar timestamp para garantizar unicidad
      const timestamp = Date.now().toString().slice(-4);
      return `${currentYear}-${nextNumber}-${timestamp}`;
    }
    
    return budgetNumber;
  }

  // Mark expired budgets (to be called by a cron job)
  async markExpiredBudgets(): Promise<void> {
    const now = new Date();
    await this.budgetRepository
      .createQueryBuilder()
      .update(Budget)
      .set({ status: BudgetStatus.EXPIRED })
      .where("validUntil < :now", { now: now.toISOString().split("T")[0] })
      .andWhere("status = :status", { status: BudgetStatus.SENT })
      .execute();
  }

  // Métodos para cupones (implementación temporal)
  async validateCoupon(code: string, amount: number) {
    // Implementación temporal con cupones hardcodeados
    const validCoupons: { [key: string]: number } = {
      'DESCUENTO10': 10,
      'DESCUENTO15': 15,
      'DESCUENTO20': 20,
      'PROMO25': 25,
      'NAVIDAD2024': 30
    };

    if (validCoupons[code.toUpperCase()]) {
      const discountPercentage = validCoupons[code.toUpperCase()];
      const discount = (amount * discountPercentage) / 100;
      
      return {
        valid: true,
        discount,
        message: `Cupón aplicado: ${discountPercentage}% de descuento`
      };
    }

    return {
      valid: false,
      discount: 0,
      message: 'El código de cupón no es válido'
    };
  }

  async applyCouponToBudget(code: string, amount: number) {
    const validation = await this.validateCoupon(code, amount);
    
    if (!validation.valid) {
      throw new BadRequestException(validation.message);
    }

    return {
      coupon: { code: code.toUpperCase() },
      discount: validation.discount
    };
  }
}
