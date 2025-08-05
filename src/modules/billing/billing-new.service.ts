import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, LessThan, MoreThan, In } from "typeorm";
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

    // Get invoice type
    const invoiceType = await this.invoiceTypeRepository.findOne({
      where: { id: createInvoiceDto.invoiceTypeId },
    });
    if (!invoiceType) {
      throw new NotFoundException("Invoice type not found");
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
          invoiceId: (savedInvoice as any).id,
        }),
      );
      await this.invoiceItemRepository.save(invoiceItems);
    }

    return this.findInvoiceById((savedInvoice as any).id);
  }

  async findAllInvoices(
    clinicId?: number,
    patientId?: number,
    doctorId?: number,
    statusId?: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Invoice[]; total: number }> {
    const queryBuilder = this.invoiceRepository
      .createQueryBuilder("invoice")
      .leftJoinAndSelect("invoice.items", "items")
      .leftJoinAndSelect("invoice.payments", "payments")
      .leftJoinAndSelect("invoice.status", "status")
      .leftJoinAndSelect("invoice.invoiceType", "invoiceType")
      .leftJoinAndSelect("invoice.discountType", "discountType")
      .leftJoinAndSelect("invoice.patient", "patient")
      .leftJoinAndSelect("invoice.doctor", "doctor")
      .leftJoinAndSelect("invoice.clinic", "clinic");

    if (clinicId) {
      queryBuilder.andWhere("invoice.clinicId = :clinicId", { clinicId });
    }

    if (patientId) {
      queryBuilder.andWhere("invoice.patientId = :patientId", { patientId });
    }

    if (doctorId) {
      queryBuilder.andWhere("invoice.doctorId = :doctorId", { doctorId });
    }

    if (statusId) {
      queryBuilder.andWhere("invoice.statusId = :statusId", { statusId });
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
        "status",
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

    // Check if invoice can be updated (not paid or cancelled)
    const paidStatus = await this.invoiceStatusRepository.findOne({
      where: { code: "PAID" },
    });
    const cancelledStatus = await this.invoiceStatusRepository.findOne({
      where: { code: "CANCELLED" },
    });

    if (invoice.invoiceStatusId === paidStatus?.id || invoice.invoiceStatusId === cancelledStatus?.id) {
      throw new BadRequestException("Cannot update paid or cancelled invoice");
    }

    const { items, ...invoiceData } = updateInvoiceDto;

    await this.invoiceRepository.update(id, invoiceData);

    if (items) {
      // Remove existing items and add new ones
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
    const invoice = await this.findInvoiceById(id);

    // Check if invoice can be deleted (only drafts)
    const draftStatus = await this.invoiceStatusRepository.findOne({
      where: { code: "DRAFT" },
    });

    if (invoice.invoiceStatusId !== draftStatus?.id) {
      throw new BadRequestException("Only draft invoices can be deleted");
    }

    await this.invoiceRepository.softDelete(id);
  }

  async markInvoiceAsPaid(id: number): Promise<Invoice> {
    const invoice = await this.findInvoiceById(id);

    const paidStatus = await this.invoiceStatusRepository.findOne({
      where: { code: "PAID" },
    });
    if (!paidStatus) {
      throw new NotFoundException("Paid status not found");
    }

    await this.invoiceRepository.update(id, {
      invoiceStatusId: paidStatus.id,
      paidAt: new Date(),
    });

    return this.findInvoiceById(id);
  }

  async cancelInvoice(id: number): Promise<Invoice> {
    const invoice = await this.findInvoiceById(id);

    const paidStatus = await this.invoiceStatusRepository.findOne({
      where: { code: "PAID" },
    });

    if (invoice.invoiceStatusId === paidStatus?.id) {
      throw new BadRequestException("Cannot cancel paid invoice");
    }

    const cancelledStatus = await this.invoiceStatusRepository.findOne({
      where: { code: "CANCELLED" },
    });
    if (!cancelledStatus) {
      throw new NotFoundException("Cancelled status not found");
    }

    await this.invoiceRepository.update(id, {
      invoiceStatusId: cancelledStatus.id,
    });

    return this.findInvoiceById(id);
  }

  async duplicateInvoice(id: number): Promise<Invoice> {
    const originalInvoice = await this.findInvoiceById(id);

    const paidStatus = await this.invoiceStatusRepository.findOne({
      where: { code: "PAID" },
    });

    if (originalInvoice.invoiceStatusId !== paidStatus?.id) {
      throw new BadRequestException("Can only duplicate paid invoices");
    }

    const { id: _, invoiceNumber, paidAt, ...invoiceData } = originalInvoice;

    return this.createInvoice({
      ...invoiceData,
      invoiceDate: invoiceData.invoiceDate.toISOString().split("T")[0],
      dueDate: invoiceData.dueDate.toISOString().split("T")[0],
      items: originalInvoice.items?.map(({ id, invoiceId, ...item }) => item) || [],
    });
  }

  // Payment methods
  async createPayment(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const invoice = await this.findInvoiceById(createPaymentDto.invoiceId);

    const paidStatus = await this.invoiceStatusRepository.findOne({
      where: { code: "PAID" },
    });

    if (invoice.invoiceStatusId === paidStatus?.id) {
      throw new BadRequestException("Invoice is already paid");
    }

    // Get default pending payment status
    const pendingPaymentStatus = await this.paymentStatusRepository.findOne({
      where: { code: "PENDING" },
    });
    if (!pendingPaymentStatus) {
      throw new NotFoundException("Default pending payment status not found");
    }

    const payment = this.paymentRepository.create({
      ...createPaymentDto,
      paymentStatusId: pendingPaymentStatus.id,
    });

    const savedPayment = await this.paymentRepository.save(payment);

    // Check if invoice is fully paid
    const totalPaid = await this.calculateTotalPaid(createPaymentDto.invoiceId);
    if (totalPaid >= invoice.totalAmount) {
      await this.markInvoiceAsPaid(createPaymentDto.invoiceId);
    }

    return this.findPaymentById(savedPayment.id);
  }

  async findAllPayments(
    invoiceId?: number,
    clinicId?: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Payment[]; total: number }> {
    const queryBuilder = this.paymentRepository
      .createQueryBuilder("payment")
      .leftJoinAndSelect("payment.invoice", "invoice")
      .leftJoinAndSelect("payment.paymentMethod", "paymentMethod")
      .leftJoinAndSelect("payment.status", "status");

    if (invoiceId) {
      queryBuilder.andWhere("payment.invoiceId = :invoiceId", { invoiceId });
    }

    if (clinicId) {
      queryBuilder.andWhere("invoice.clinicId = :clinicId", { clinicId });
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
      relations: ["invoice", "paymentMethod", "status"],
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
    category?: string,
    status?: string,
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

    if (category) {
      queryBuilder.andWhere("expense.category = :category", { category });
    }

    if (status) {
      queryBuilder.andWhere("expense.status = :status", { status });
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

  private async calculateTotalPaid(invoiceId: number): Promise<number> {
    const completedStatus = await this.paymentStatusRepository.findOne({
      where: { code: "COMPLETED" },
    });

    if (!completedStatus) {
      return 0;
    }

    const result = await this.paymentRepository
      .createQueryBuilder("payment")
      .select("SUM(payment.amount)", "total")
      .where("payment.invoiceId = :invoiceId", { invoiceId })
      .andWhere("payment.paymentStatusId = :statusId", {
        statusId: completedStatus.id,
      })
      .getRawOne();

    return parseFloat(result?.total || "0");
  }

  async updateOverdueInvoices(): Promise<void> {
    const overdueStatus = await this.invoiceStatusRepository.findOne({
      where: { code: "OVERDUE" },
    });
    const pendingStatus = await this.invoiceStatusRepository.findOne({
      where: { code: "PENDING" },
    });
    const partiallyPaidStatus = await this.invoiceStatusRepository.findOne({
      where: { code: "PARTIALLY_PAID" },
    });

    if (!overdueStatus || !pendingStatus || !partiallyPaidStatus) {
      return;
    }

    await this.invoiceRepository
      .createQueryBuilder()
      .update(Invoice)
      .set({ invoiceStatusId: overdueStatus.id })
      .where("dueDate < :today", { today: new Date() })
      .andWhere("statusId IN (:...statuses)", {
        statuses: [pendingStatus.id, partiallyPaidStatus.id],
      })
      .execute();
  }

  // Dashboard methods
  async getDashboardStats(clinicId: number): Promise<any> {
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    // Get invoice statistics
    const totalInvoices = await this.invoiceRepository.count({
      where: { clinicId },
    });

    const monthlyInvoices = await this.invoiceRepository.count({
      where: {
        clinicId,
        createdAt: MoreThan(currentMonth),
      },
    });

    const paidStatus = await this.invoiceStatusRepository.findOne({
      where: { code: "PAID" },
    });

    const monthlyRevenue = await this.invoiceRepository
      .createQueryBuilder("invoice")
      .select("SUM(invoice.totalAmount)", "total")
      .where("invoice.clinicId = :clinicId", { clinicId })
      .andWhere("invoice.statusId = :statusId", { statusId: paidStatus?.id })
      .andWhere("invoice.paidAt >= :startDate", { startDate: currentMonth })
      .andWhere("invoice.paidAt < :endDate", { endDate: nextMonth })
      .getRawOne();

    const pendingStatus = await this.invoiceStatusRepository.findOne({
      where: { code: "PENDING" },
    });

    const pendingInvoices = await this.invoiceRepository.count({
      where: {
        clinicId,
        invoiceStatusId: pendingStatus?.id,
      },
    });

    // Get expense statistics
    const monthlyExpenses = await this.expenseRepository
      .createQueryBuilder("expense")
      .select("SUM(expense.amount)", "total")
      .where("expense.clinicId = :clinicId", { clinicId })
      .andWhere("expense.expenseDate >= :startDate", {
        startDate: currentMonth,
      })
      .andWhere("expense.expenseDate < :endDate", { endDate: nextMonth })
      .getRawOne();

    return {
      totalInvoices,
      monthlyInvoices,
      monthlyRevenue: parseFloat(monthlyRevenue?.total || "0"),
      pendingInvoices,
      monthlyExpenses: parseFloat(monthlyExpenses?.total || "0"),
    };
  }
}
