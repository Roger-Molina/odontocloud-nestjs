/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between } from "typeorm";
import { CreateInvoiceDto } from "./dto/create-invoice.dto";
import { Invoice, InvoiceItem, Payment } from "./entities/billing.entity";
import { Expense } from "./entities/expense.entity";
import { InvoiceStatus } from "./entities/invoice-status.entity";
import { PaymentMethod } from "./entities/payment-method.entity";
import { InvoiceType } from "./entities/invoice-type.entity";
import { PaymentStatus } from "./entities/payment-status.entity";
import { DiscountType } from "./entities/discount-type.entity";
import { ExpenseCategory } from "./entities/expense-category.entity";
import { ExpenseStatus } from "./entities/expense-status.entity";
import { PdfService } from "../../common/services/pdf.service";

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    @InjectRepository(InvoiceItem)
    private invoiceItemRepository: Repository<InvoiceItem>,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
    @InjectRepository(InvoiceStatus)
    private invoiceStatusRepository: Repository<InvoiceStatus>,
    @InjectRepository(PaymentMethod)
    private paymentMethodRepository: Repository<PaymentMethod>,
    @InjectRepository(InvoiceType)
    private invoiceTypeRepository: Repository<InvoiceType>,
    @InjectRepository(PaymentStatus)
    private paymentStatusRepository: Repository<PaymentStatus>,
    @InjectRepository(DiscountType)
    private discountTypeRepository: Repository<DiscountType>,
    @InjectRepository(ExpenseCategory)
    private expenseCategoryRepository: Repository<ExpenseCategory>,
    @InjectRepository(ExpenseStatus)
    private expenseStatusRepository: Repository<ExpenseStatus>,
    private pdfService: PdfService,
  ) {}

  async createInvoice(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    // Buscar el status "DRAFT" dinámicamente
    const draftStatus = await this.invoiceStatusRepository.findOne({
      where: { code: "DRAFT" },
    });
    
    if (!draftStatus) {
      throw new Error("Draft status not found in catalog");
    }

    const invoice = this.invoiceRepository.create({
      ...createInvoiceDto,
      invoiceNumber: await this.generateInvoiceNumber(),
      invoiceStatusId: draftStatus.id,
    });

    const savedInvoice = await this.invoiceRepository.save(invoice);

    // Crear los items con el totalPrice calculado
    for (const itemDto of createInvoiceDto.items) {
      const totalPrice = Number(itemDto.quantity) * Number(itemDto.unitPrice);
      
      const item = this.invoiceItemRepository.create({
        description: itemDto.description,
        quantity: itemDto.quantity,
        unitPrice: itemDto.unitPrice,
        totalPrice: totalPrice,
        discountAmount: 0, // Por defecto
        treatmentId: itemDto.treatmentId || undefined,
        invoiceId: savedInvoice.id,
      });
      
      await this.invoiceItemRepository.save(item);
    }

    return this.findOne(savedInvoice.id, createInvoiceDto.clinicId);
  }

  async findAll(options: any): Promise<Invoice[]> {
    return this.invoiceRepository.find({
      where: options,
      relations: ["items", "invoiceStatus", "invoiceType"]
    });
  }

  async findOne(id: number, clinicId: number): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id, clinicId },
      relations: ["items", "invoiceStatus", "invoiceType", "payments", "patient"]
    });

    if (!invoice) {
      throw new NotFoundException("Factura no encontrada");
    }

    return invoice;
  }

  async update(id: number, updateData: any, clinicId: number): Promise<Invoice> {
    // Verificar que la factura existe
    const existingInvoice = await this.findOne(id, clinicId);
    
    // Extraer los items de updateData si existen
    const { items, ...invoiceData } = updateData;
    
    // Actualizar los datos básicos de la factura (sin items)
    if (Object.keys(invoiceData).length > 0) {
      await this.invoiceRepository.update(id, invoiceData);
    }
    
    // Si hay items para actualizar, manejarlos por separado
    if (items && Array.isArray(items)) {
      // Eliminar todos los items existentes
      await this.invoiceItemRepository.delete({ invoiceId: id });
      
      // Crear los nuevos items
      const itemsToCreate = items.map(item => ({
        ...item,
        invoiceId: id
      }));
      
      if (itemsToCreate.length > 0) {
        await this.invoiceItemRepository.save(itemsToCreate);
      }
    }
    
    // Retornar la factura actualizada con todas sus relaciones
    return this.findOne(id, clinicId);
  }

  async remove(id: number, clinicId: number): Promise<void> {
    const invoice = await this.findOne(id, clinicId);
    await this.invoiceRepository.remove(invoice);
  }

  async createFromTreatments(data: any): Promise<Invoice> {
    throw new Error("Método no implementado");
  }

  async findByPatient(patientId: number, clinicId: number): Promise<Invoice[]> {
    return this.invoiceRepository.find({
      where: { patientId, clinicId },
      relations: ["items", "invoiceStatus", "invoiceType", "payments"]
    });
  }

  async findByStatus(statusName: string, clinicId: number): Promise<Invoice[]> {
    const status = await this.invoiceStatusRepository.findOne({
      where: { name: statusName }
    });

    if (!status) {
      throw new NotFoundException("Estado no encontrado");
    }

    return this.invoiceRepository.find({
      where: { invoiceStatusId: status.id, clinicId },
      relations: ["items", "invoiceStatus", "invoiceType", "payments"]
    });
  }

  async markAsPaid(
    id: number,
    paymentData: any,
    clinicId: number,
  ): Promise<Invoice> {
    const invoice = await this.findOne(id, clinicId);
    
    // Buscar el status "COMPLETED" para payments
    const completedPaymentStatus = await this.paymentStatusRepository.findOne({
      where: { code: "COMPLETED" },
    });
    
    // Generar número de pago único
    const paymentNumber = await this.generatePaymentNumber();
    
    const payment = this.paymentRepository.create({
      paymentNumber,
      invoiceId: id,
      amount: paymentData.amount || invoice.totalAmount,
      paymentDate: new Date(),
      paymentMethodId: paymentData.paymentMethodId || 1,
      paymentStatusId: completedPaymentStatus?.id || 1,
      notes: paymentData.notes,
    });

    await this.paymentRepository.save(payment);

    const paidStatus = await this.invoiceStatusRepository.findOne({
      where: { code: "PAID" },
    });

    await this.invoiceRepository.update(id, {
      invoiceStatusId: paidStatus?.id || 2
    });

    return this.findOne(id, clinicId);
  }

  async cancel(id: number, reason: string, clinicId: number): Promise<Invoice> {
    const invoice = await this.findOne(id, clinicId);
    
    const cancelledStatus = await this.invoiceStatusRepository.findOne({
      where: { code: "CANCELLED" },
    });

    await this.invoiceRepository.update(id, {
      invoiceStatusId: cancelledStatus?.id || 4,
      notes: `${invoice.notes || ""}\nCancelada: ${reason}`
    });

    return this.findOne(id, clinicId);
  }

  async getBillingStats(clinicId: number, startDate?: string, endDate?: string): Promise<any> {
    const where: any = { clinicId };
    
    if (startDate && endDate) {
      where.invoiceDate = Between(new Date(startDate), new Date(endDate));
    }

    const invoices = await this.invoiceRepository.find({
      where,
      relations: ["invoiceStatus"],
    });

    const totalAmount = invoices.reduce(
      (sum, inv) => sum + parseFloat(String(inv.totalAmount || 0)),
      0,
    );
    const paidAmount = invoices
      .filter((inv) => inv.invoiceStatus?.name === "Pagada")
      .reduce((sum, inv) => sum + parseFloat(String(inv.totalAmount || 0)), 0);
    const pendingAmount = invoices
      .filter((inv) => inv.invoiceStatus?.name === "Pendiente")
      .reduce((sum, inv) => sum + parseFloat(String(inv.totalAmount || 0)), 0);

    return {
      totalInvoices: invoices.length,
      totalAmount: Math.round(totalAmount * 100) / 100, // Round to 2 decimal places
      paidAmount: Math.round(paidAmount * 100) / 100,
      pendingAmount: Math.round(pendingAmount * 100) / 100,
    };
  }

  async markOverdueInvoices(): Promise<void> {
    // Implementación simplificada
  }

  async findAllExpenses(options: any): Promise<Expense[]> {
    return this.expenseRepository.find({
      where: { clinicId: options.clinicId },
      relations: ["expenseCategory", "expenseStatus", "clinic", "doctor"],
      order: { expenseDate: "DESC" },
    });
  }

  async createPayment(paymentData: any): Promise<Payment> {
    return this.paymentRepository.save(paymentData);
  }

  private async generateInvoiceNumber(): Promise<string> {
    const currentYear = new Date().getFullYear();
    const prefix = `INV-${currentYear}-`;

    const lastInvoice = await this.invoiceRepository
      .createQueryBuilder("invoice")
      .where("invoice.invoiceNumber LIKE :prefix", { prefix: `${prefix}%` })
      .orderBy("invoice.invoiceNumber", "DESC")
      .getOne();

    let nextNumber = 1;
    if (lastInvoice) {
      const lastNumber = parseInt(
        lastInvoice.invoiceNumber.replace(prefix, ""),
        10,
      );
      nextNumber = lastNumber + 1;
    }

    return `${prefix}${nextNumber.toString().padStart(6, "0")}`;
  }

  // Métodos de catálogos
  async findAllInvoiceStatuses(): Promise<InvoiceStatus[]> {
    return this.invoiceStatusRepository.find({
      where: { isActive: true },
      order: { displayOrder: "ASC" }
    });
  }

  async findAllPaymentMethods(): Promise<PaymentMethod[]> {
    return this.paymentMethodRepository.find({
      where: { isActive: true },
      order: { displayOrder: "ASC" }
    });
  }

  async findAllInvoiceTypes(): Promise<InvoiceType[]> {
    return this.invoiceTypeRepository.find({
      where: { isActive: true },
      order: { displayOrder: "ASC" }
    });
  }

  async findAllPaymentStatuses(): Promise<PaymentStatus[]> {
    return this.paymentStatusRepository.find({
      where: { isActive: true },
      order: { displayOrder: "ASC" }
    });
  }

  async findAllDiscountTypes(): Promise<DiscountType[]> {
    return this.discountTypeRepository.find({
      where: { isActive: true },
      order: { displayOrder: "ASC" }
    });
  }

  // Métodos de expenses
  async createExpense(createExpenseDto: any): Promise<Expense> {
    // Buscar el status "DRAFT" y categoría por defecto dinámicamente
    const draftStatus = await this.expenseStatusRepository.findOne({
      where: { code: "DRAFT" },
    });
    
    if (!draftStatus) {
      throw new Error("Draft expense status not found in catalog");
    }

    // Si no viene expenseCategoryId, usar la categoría "OTHER" por defecto
    let expenseCategoryId = createExpenseDto.expenseCategoryId;
    if (!expenseCategoryId) {
      const defaultCategory = await this.expenseCategoryRepository.findOne({
        where: { code: "OTHER" },
      });
      expenseCategoryId = defaultCategory?.id || 1;
    }

    const expense = this.expenseRepository.create({
      ...createExpenseDto,
      expenseNumber: await this.generateExpenseNumber(),
      expenseStatusId: draftStatus.id,
      expenseCategoryId,
    });
    const savedExpense = await this.expenseRepository.save(expense);
    return Array.isArray(savedExpense) ? savedExpense[0] : savedExpense;
  }

  async findExpenseById(id: number): Promise<Expense> {
    const expense = await this.expenseRepository.findOne({
      where: { id }
    });

    if (!expense) {
      throw new NotFoundException("Gasto no encontrado");
    }

    return expense;
  }

  async updateExpense(id: number, updateExpenseDto: any): Promise<Expense> {
    await this.findExpenseById(id);
    await this.expenseRepository.update(id, updateExpenseDto);
    return this.findExpenseById(id);
  }

  async markExpenseAsPaid(id: number, clinicId: number): Promise<Expense> {
    const expense = await this.findExpenseById(id);
    
    // Verificar que el egreso pertenezca a la clínica
    if (expense.clinicId !== clinicId) {
      throw new ForbiddenException('No tienes permisos para marcar este egreso como pagado');
    }

    // Verificar que el egreso no esté ya pagado o cancelado
    if (expense.expenseStatus.code === 'PAID') {
      throw new BadRequestException('El egreso ya está marcado como pagado');
    }
    
    if (expense.expenseStatus.code === 'CANCELLED') {
      throw new BadRequestException('No se puede marcar como pagado un egreso cancelado');
    }

    // Obtener el estado "PAID"
    const paidStatus = await this.expenseStatusRepository.findOne({
      where: { code: 'PAID', isActive: true }
    });

    if (!paidStatus) {
      throw new NotFoundException('Estado PAID no encontrado');
    }

    // Actualizar el egreso
    await this.expenseRepository.update(id, {
      expenseStatusId: paidStatus.id,
      updatedAt: new Date()
    });

    return this.findExpenseById(id);
  }

  async cancelExpense(id: number, clinicId: number): Promise<Expense> {
    const expense = await this.findExpenseById(id);
    
    // Verificar que el egreso pertenezca a la clínica
    if (expense.clinicId !== clinicId) {
      throw new ForbiddenException('No tienes permisos para cancelar este egreso');
    }

    // Verificar que el egreso no esté ya pagado o cancelado
    if (expense.expenseStatus.code === 'PAID') {
      throw new BadRequestException('No se puede cancelar un egreso que ya está pagado');
    }
    
    if (expense.expenseStatus.code === 'CANCELLED') {
      throw new BadRequestException('El egreso ya está cancelado');
    }

    // Obtener el estado "CANCELLED"
    const cancelledStatus = await this.expenseStatusRepository.findOne({
      where: { code: 'CANCELLED', isActive: true }
    });

    if (!cancelledStatus) {
      throw new NotFoundException('Estado CANCELLED no encontrado');
    }

    // Actualizar el egreso
    await this.expenseRepository.update(id, {
      expenseStatusId: cancelledStatus.id,
      updatedAt: new Date()
    });

    return this.findExpenseById(id);
  }

  async deleteExpense(id: number): Promise<void> {
    const expense = await this.findExpenseById(id);
    await this.expenseRepository.remove(expense);
  }

  // Métodos para catálogos de expenses
  async getExpenseCategories(): Promise<ExpenseCategory[]> {
    return this.expenseCategoryRepository.find({
      where: { isActive: true },
      order: { name: "ASC" },
    });
  }

  async getExpenseStatuses(): Promise<ExpenseStatus[]> {
    return this.expenseStatusRepository.find({
      where: { isActive: true },
      order: { name: "ASC" },
    });
  }

  // Export invoice to PDF
  async exportInvoiceToPDF(id: number): Promise<Buffer> {
    try {
      // Obtener la factura con la relación del paciente
      const invoice = await this.invoiceRepository.findOne({
        where: { id },
        relations: ['patient', 'items']
      });

      if (!invoice) {
        throw new NotFoundException(`Invoice with ID ${id} not found`);
      }

      // Formatear los datos para el PDF
      const formattedInvoice = {
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        createdAt: invoice.createdAt,
        patient: invoice.patient,
        items: invoice.items || [],
        subtotal: invoice.subtotal,
        discountAmount: invoice.discountAmount,
        taxAmount: invoice.taxAmount,
        totalAmount: invoice.totalAmount,
        notes: invoice.notes
      };

      // Generar el PDF usando el servicio de PDF
      return await this.pdfService.generateInvoicePdf(formattedInvoice);
    } catch (error) {
      console.error('[BillingService] Error exporting invoice to PDF:', error);
      throw new InternalServerErrorException('Error exporting invoice to PDF');
    }
  }

  private async generateExpenseNumber(): Promise<string> {
    const currentYear = new Date().getFullYear();
    const prefix = `EXP-${currentYear}-`;

    const lastExpense = await this.expenseRepository
      .createQueryBuilder("expense")
      .where("expense.expenseNumber LIKE :prefix", { prefix: `${prefix}%` })
      .orderBy("expense.expenseNumber", "DESC")
      .getOne();

    let nextNumber = 1;
    if (lastExpense) {
      const lastNumber = parseInt(
        lastExpense.expenseNumber.replace(prefix, ""),
        10,
      );
      nextNumber = lastNumber + 1;
    }

    return `${prefix}${nextNumber.toString().padStart(6, "0")}`;
  }

  private async generatePaymentNumber(): Promise<string> {
    const currentYear = new Date().getFullYear();
    const prefix = `PAY-${currentYear}-`;

    const lastPayment = await this.paymentRepository
      .createQueryBuilder("payment")
      .where("payment.paymentNumber LIKE :prefix", { prefix: `${prefix}%` })
      .orderBy("payment.paymentNumber", "DESC")
      .getOne();

    let nextNumber = 1;
    if (lastPayment) {
      const lastNumber = parseInt(
        lastPayment.paymentNumber.replace(prefix, ""),
        10,
      );
      nextNumber = lastNumber + 1;
    }

    return `${prefix}${nextNumber.toString().padStart(6, "0")}`;
  }
}
