import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  CreateInvoiceDto,
  UpdateInvoiceDto,
  CreatePaymentDto,
  CreateExpenseDto,
  UpdateExpenseDto,
} from "./dto/billing.dto";
import { Invoice, InvoiceItem, Payment } from "./entities/billing.entity";
import { Expense } from "./entities/expense.entity";
import { InvoiceStatus } from "./entities/invoice-status.entity";
import { PaymentMethod } from "./entities/payment-method.entity";
import { InvoiceType } from "./entities/invoice-type.entity";
import { PaymentStatus } from "./entities/payment-status.entity";
import { DiscountType } from "./entities/discount-type.entity";

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
  ) {}

  // Invoice methods
  async createInvoice(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const { items, ...invoiceData } = createInvoiceDto;

    // Get default pending status
    const pendingStatus = await this.invoiceStatusRepository.findOne({
      where: { code: "PENDING" },
    });
    if (!pendingStatus) {
      throw new NotFoundException("Default pending status not found");
    }

    const invoice = this.invoiceRepository.create({
      ...invoiceData,
      invoiceStatusId: pendingStatus.id,
      invoiceNumber: await this.generateInvoiceNumber(),
    });

    const savedInvoice = await this.invoiceRepository.save(invoice);

    if (items && items.length > 0) {
      const invoiceItems = items.map((item) =>
        this.invoiceItemRepository.create({
          ...item,
          invoiceId: savedInvoice.id,
        }),
      );
      await this.invoiceItemRepository.save(invoiceItems);
    }

    return this.findInvoiceById(savedInvoice.id);
  }

  async findAllInvoices(
    clinicId?: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Invoice[]; total: number }> {
    const queryBuilder = this.invoiceRepository
      .createQueryBuilder("invoice")
      .leftJoinAndSelect("invoice.items", "items")
      .leftJoinAndSelect("invoice.payments", "payments")
      .leftJoinAndSelect("invoice.invoiceStatus", "status")
      .leftJoinAndSelect("invoice.invoiceType", "invoiceType")
      .leftJoinAndSelect("invoice.discountType", "discountType")
      .leftJoinAndSelect("invoice.patient", "patient")
      .leftJoinAndSelect("invoice.doctor", "doctor")
      .leftJoinAndSelect("invoice.clinic", "clinic");

    if (clinicId) {
      queryBuilder.andWhere("invoice.clinicId = :clinicId", { clinicId });
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy("invoice.createdAt", "DESC")
      .getManyAndCount();

    return { data, total };
  }

  async findInvoiceById(id: number): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: [
        "items",
        "payments",
        "invoiceStatus",
        "invoiceType",
        "discountType",
        "patient",
        "doctor",
        "clinic",
      ],
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    return invoice;
  }

  async updateInvoice(
    id: number,
    updateInvoiceDto: UpdateInvoiceDto,
  ): Promise<Invoice> {
    const invoice = await this.findInvoiceById(id);

    const { items, ...invoiceData } = updateInvoiceDto;
    await this.invoiceRepository.update(id, invoiceData);

    if (items) {
      await this.invoiceItemRepository.delete({ invoiceId: id });

      if (items.length > 0) {
        const newItems = items.map((item) => ({
          ...item,
          invoiceId: id,
        }));
        await this.invoiceItemRepository.save(newItems);
      }
    }

    return this.findInvoiceById(id);
  }

  async deleteInvoice(id: number): Promise<void> {
    await this.findInvoiceById(id);
    await this.invoiceRepository.softDelete(id);
  }

  // Payment methods
  async createPayment(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const pendingStatus = await this.paymentStatusRepository.findOne({
      where: { code: "PENDING" },
    });
    if (!pendingStatus) {
      throw new NotFoundException("Default pending payment status not found");
    }

    const payment = this.paymentRepository.create({
      ...createPaymentDto,
      paymentStatusId: pendingStatus.id,
    });

    return this.paymentRepository.save(payment);
  }

  async findAllPayments(
    invoiceId?: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Payment[]; total: number }> {
    const queryBuilder = this.paymentRepository
      .createQueryBuilder("payment")
      .leftJoinAndSelect("payment.invoice", "invoice")
      .leftJoinAndSelect("payment.paymentMethod", "paymentMethod")
      .leftJoinAndSelect("payment.paymentStatus", "status");

    if (invoiceId) {
      queryBuilder.andWhere("payment.invoiceId = :invoiceId", { invoiceId });
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy("payment.createdAt", "DESC")
      .getManyAndCount();

    return { data, total };
  }

  async findPaymentById(id: number): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ["invoice", "paymentMethod", "paymentStatus"],
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return payment;
  }

  // Expense methods
  async createExpense(createExpenseDto: CreateExpenseDto): Promise<Expense> {
    const expense = this.expenseRepository.create({
      ...createExpenseDto,
      expenseNumber: await this.generateExpenseNumber(),
    });

    return this.expenseRepository.save(expense);
  }

  async findAllExpenses(
    clinicId?: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Expense[]; total: number }> {
    const queryBuilder = this.expenseRepository
      .createQueryBuilder("expense")
      .leftJoinAndSelect("expense.clinic", "clinic")
      .leftJoinAndSelect("expense.doctor", "doctor");

    if (clinicId) {
      queryBuilder.andWhere("expense.clinicId = :clinicId", { clinicId });
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy("expense.expenseDate", "DESC")
      .getManyAndCount();

    return { data, total };
  }

  async findExpenseById(id: number): Promise<Expense> {
    const expense = await this.expenseRepository.findOne({
      where: { id },
      relations: ["clinic", "doctor"],
    });

    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    return expense;
  }

  async updateExpense(
    id: number,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<Expense> {
    await this.findExpenseById(id);
    await this.expenseRepository.update(id, updateExpenseDto);
    return this.findExpenseById(id);
  }

  async deleteExpense(id: number): Promise<void> {
    await this.findExpenseById(id);
    await this.expenseRepository.softDelete(id);
  }

  // Catalog methods
  async findAllInvoiceStatuses(): Promise<InvoiceStatus[]> {
    return this.invoiceStatusRepository.find({
      where: { isActive: true },
      order: { displayOrder: "ASC" },
    });
  }

  async findAllPaymentMethods(): Promise<PaymentMethod[]> {
    return this.paymentMethodRepository.find({
      where: { isActive: true },
      order: { displayOrder: "ASC" },
    });
  }

  async findAllInvoiceTypes(): Promise<InvoiceType[]> {
    return this.invoiceTypeRepository.find({
      where: { isActive: true },
      order: { displayOrder: "ASC" },
    });
  }

  async findAllPaymentStatuses(): Promise<PaymentStatus[]> {
    return this.paymentStatusRepository.find({
      where: { isActive: true },
      order: { displayOrder: "ASC" },
    });
  }

  async findAllDiscountTypes(): Promise<DiscountType[]> {
    return this.discountTypeRepository.find({
      where: { isActive: true },
      order: { displayOrder: "ASC" },
    });
  }

  // Utility methods
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

  // Dashboard method
  async getDashboardStats(clinicId: number): Promise<any> {
    const totalInvoices = await this.invoiceRepository.count({
      where: { clinicId },
    });

    const totalExpenses = await this.expenseRepository.count({
      where: { clinicId },
    });

    return {
      totalInvoices,
      totalExpenses,
    };
  }
}
