import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, QueryRunner, DataSource } from "typeorm";
import {
  Invoice,
  InvoiceItem,
  Payment,
  InvoiceStatus,
} from "./entities/billing.entity";
import { CreateInvoiceDto } from "./dto/create-invoice.dto";
import { UpdateInvoiceDto } from "./dto/update-invoice.dto";
import { CreatePaymentDto } from "./dto/billing-additional.dto";

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    @InjectRepository(InvoiceItem)
    private invoiceItemRepository: Repository<InvoiceItem>,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private dataSource: DataSource,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Calculate totals
      const subtotal = createInvoiceDto.items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0,
      );
      const totalAmount =
        subtotal +
        (createInvoiceDto.taxAmount || 0) -
        (createInvoiceDto.discountAmount || 0);

      // Generate invoice number
      const invoiceNumber = `INV-${Date.now()}`;

      // Create invoice
      const invoice = queryRunner.manager.create(Invoice, {
        invoiceNumber,
        patientId: createInvoiceDto.patientId,
        clinicId: createInvoiceDto.clinicId,
        invoiceDate: new Date(),
        dueDate:
          createInvoiceDto.dueDate ||
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        subtotal,
        taxAmount: createInvoiceDto.taxAmount || 0,
        discountAmount: createInvoiceDto.discountAmount || 0,
        totalAmount,
        paidAmount: 0,
        balanceDue: totalAmount,
        status: InvoiceStatus.PENDING,
        notes: createInvoiceDto.notes,
      });

      const savedInvoice = await queryRunner.manager.save(Invoice, invoice);

      // Create invoice items
      const items = createInvoiceDto.items.map((item) =>
        queryRunner.manager.create(InvoiceItem, {
          ...item,
          invoice: savedInvoice,
        }),
      );

      await queryRunner.manager.save(InvoiceItem, items);

      await queryRunner.commitTransaction();

      return this.findOne(savedInvoice.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(options?: {
    status?: InvoiceStatus;
    clinicId?: number;
    patientId?: number;
    startDate?: Date;
    endDate?: Date;
  }): Promise<Invoice[]> {
    const queryBuilder = this.invoiceRepository.createQueryBuilder("invoice");

    if (options?.status) {
      queryBuilder.andWhere("invoice.status = :status", {
        status: options.status,
      });
    }

    if (options?.clinicId) {
      queryBuilder.andWhere("invoice.clinicId = :clinicId", {
        clinicId: options.clinicId,
      });
    }

    if (options?.patientId) {
      queryBuilder.andWhere("invoice.patientId = :patientId", {
        patientId: options.patientId,
      });
    }

    if (options?.startDate && options?.endDate) {
      queryBuilder.andWhere(
        "invoice.invoiceDate BETWEEN :startDate AND :endDate",
        {
          startDate: options.startDate,
          endDate: options.endDate,
        },
      );
    }

    return queryBuilder
      .leftJoinAndSelect("invoice.items", "items")
      .leftJoinAndSelect("invoice.payments", "payments")
      .orderBy("invoice.invoiceDate", "DESC")
      .getMany();
  }

  async findOne(id: number, clinicId?: number): Promise<Invoice> {
    const where: Record<string, any> = { id };

    if (clinicId) {
      where.clinicId = clinicId;
    }

    const invoice = await this.invoiceRepository.findOne({
      where,
      relations: ["items", "payments"],
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    return invoice;
  }

  async findByPatient(
    patientId: number,
    clinicId?: number,
  ): Promise<Invoice[]> {
    const where: Record<string, any> = { patientId };

    if (clinicId) {
      where.clinicId = clinicId;
    }

    return this.invoiceRepository.find({
      where,
      relations: ["items", "payments"],
      order: { invoiceDate: "DESC" },
    });
  }

  async findByStatus(
    status: InvoiceStatus,
    clinicId?: number,
  ): Promise<Invoice[]> {
    const where: Record<string, any> = { status };

    if (clinicId) {
      where.clinicId = clinicId;
    }

    return this.invoiceRepository.find({
      where,
      relations: ["items", "payments"],
      order: { invoiceDate: "DESC" },
    });
  }

  async update(
    id: number,
    updateInvoiceDto: UpdateInvoiceDto,
    clinicId?: number,
  ): Promise<Invoice> {
    const invoice = await this.findOne(id, clinicId);

    if (invoice.status !== InvoiceStatus.PENDING) {
      throw new BadRequestException("Only pending invoices can be updated");
    }

    await this.invoiceRepository.update(id, updateInvoiceDto);
    return this.findOne(id, clinicId);
  }

  async markAsPaid(
    id: number,
    _paymentDto?: Partial<CreatePaymentDto>,
    clinicId?: number,
  ): Promise<Invoice> {
    const invoice = await this.findOne(id, clinicId);

    if (invoice.status === InvoiceStatus.PAID) {
      throw new BadRequestException("Invoice is already paid");
    }

    if (invoice.status === InvoiceStatus.CANCELLED) {
      throw new BadRequestException("Cannot pay a cancelled invoice");
    }

    await this.invoiceRepository.update(id, {
      status: InvoiceStatus.PAID,
      paidAt: new Date(),
    });

    return this.findOne(id, clinicId);
  }

  async cancel(
    id: number,
    _reason?: string,
    clinicId?: number,
  ): Promise<Invoice> {
    const invoice = await this.findOne(id, clinicId);

    if (invoice.status === InvoiceStatus.PAID) {
      throw new BadRequestException("Cannot cancel a paid invoice");
    }

    await this.invoiceRepository.update(id, {
      status: InvoiceStatus.CANCELLED,
    });

    return this.findOne(id, clinicId);
  }

  async remove(id: number, clinicId?: number): Promise<void> {
    const invoice = await this.findOne(id, clinicId);

    if (invoice.status === InvoiceStatus.PAID) {
      throw new BadRequestException("Cannot delete a paid invoice");
    }

    await this.invoiceRepository.softRemove(invoice);
  }

  async createPayment(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const payment = this.paymentRepository.create({
      ...createPaymentDto,
      paymentNumber: `PAY-${Date.now()}`,
      paymentDate: new Date(createPaymentDto.paymentDate),
    });

    return this.paymentRepository.save(payment);
  }

  async createFromTreatments(createDto: {
    clinicId?: number;
    notes?: string;
    treatments?: any[];
  }): Promise<Invoice> {
    const invoiceData: CreateInvoiceDto = {
      patientId: 1,
      clinicId: createDto.clinicId || 1,
      items: [
        {
          description: "Treatment services",
          quantity: 1,
          unitPrice: 100,
          totalPrice: 100,
        },
      ],
      notes: createDto.notes || "Invoice generated from treatments",
    };

    return this.create(invoiceData);
  }

  async getBillingStats(
    clinicId?: number,
    startDate?: string,
    endDate?: string,
  ) {
    const queryBuilder = this.invoiceRepository.createQueryBuilder("invoice");

    if (clinicId) {
      queryBuilder.andWhere("invoice.clinicId = :clinicId", { clinicId });
    }

    if (startDate && endDate) {
      queryBuilder.andWhere(
        "invoice.invoiceDate BETWEEN :startDate AND :endDate",
        {
          startDate,
          endDate,
        },
      );
    }

    const invoices = await queryBuilder.getMany();

    return {
      totalInvoices: invoices.length,
      totalAmount: invoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
      totalPaid: invoices.reduce((sum, inv) => sum + inv.paidAmount, 0),
      totalPending: invoices.reduce((sum, inv) => sum + inv.balanceDue, 0),
    };
  }

  async markOverdueInvoices(): Promise<{ updated: number }> {
    const overdueDate = new Date();
    overdueDate.setHours(0, 0, 0, 0);

    const result = await this.invoiceRepository
      .createQueryBuilder()
      .update(Invoice)
      .set({ status: InvoiceStatus.OVERDUE })
      .where("dueDate < :overdueDate", { overdueDate })
      .andWhere("status IN (:...statuses)", {
        statuses: [InvoiceStatus.PENDING, InvoiceStatus.PARTIALLY_PAID],
      })
      .execute();

    return { updated: result.affected || 0 };
  }
}
