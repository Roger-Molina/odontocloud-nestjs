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
  HttpCode,
  HttpStatus,
  Request,
} from "@nestjs/common";

interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    clinicId: number;
    role: string;
  };
}
import { BillingService } from "./billing.service";
import { CreateInvoiceDto } from "./dto/create-invoice.dto";
import { UpdateInvoiceDto } from "./dto/update-invoice.dto";
import {
  CreatePaymentDto,
  CreateInvoiceFromTreatmentDto,
} from "./dto/billing-additional.dto";
import { InvoiceStatus } from "./entities/billing.entity";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../users/entities/user.entity";

@Controller("billing")
@UseGuards(JwtAuthGuard, RolesGuard)
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  /* ============================================
   * INVOICE ENDPOINTS
   * ============================================ */

  @Post("invoices")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  createInvoice(
    @Request() req: AuthenticatedRequest,
    @Body() createInvoiceDto: CreateInvoiceDto,
  ) {
    // Set clinicId from authenticated user, not from request body
    const invoiceData = {
      ...createInvoiceDto,
      clinicId: req.user.clinicId, // Use user's clinic
    };
    return this.billingService.createInvoice(invoiceData);
  }

  @Post("invoices/from-treatments")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  createInvoiceFromTreatments(
    @Body() createInvoiceFromTreatmentDto: CreateInvoiceFromTreatmentDto,
  ) {
    return this.billingService.createFromTreatments(
      createInvoiceFromTreatmentDto,
    );
  }

  @Get("invoices")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  findAllInvoices(
    @Request() req: AuthenticatedRequest,
    @Query("status") status?: InvoiceStatus,
    @Query("patientId") patientId?: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
  ) {
    const options = {
      status,
      clinicId: req.user.clinicId, // Filter by user's clinic
      patientId: patientId ? parseInt(patientId) : undefined,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };

    return this.billingService.findAll(options);
  }

  @Get("invoices/patient/:patientId")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  findInvoicesByPatient(
    @Request() req: AuthenticatedRequest,
    @Param("patientId", ParseIntPipe) patientId: number,
  ) {
    return this.billingService.findByPatient(
      patientId,
      req.user.clinicId, // Filter by user's clinic
    );
  }

  @Get("invoices/status/:status")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  findInvoicesByStatus(
    @Request() req: AuthenticatedRequest,
    @Param("status") status: string,
  ) {
    return this.billingService.findByStatus(
      status,
      req.user.clinicId, // Filter by user's clinic
    );
  }

  @Get("invoices/:id")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  findOneInvoice(
    @Request() req: AuthenticatedRequest,
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.billingService.findOne(id, req.user.clinicId);
  }

  @Patch("invoices/:id")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  updateInvoice(
    @Request() req: AuthenticatedRequest,
    @Param("id", ParseIntPipe) id: number,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
  ) {
    return this.billingService.update(id, updateInvoiceDto, req.user.clinicId);
  }

  @Patch("invoices/:id/pay")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  markAsPaid(
    @Request() req: AuthenticatedRequest,
    @Param("id", ParseIntPipe) id: number,
    @Body() paymentDto?: Partial<CreatePaymentDto>,
  ) {
    return this.billingService.markAsPaid(id, paymentDto, req.user.clinicId);
  }

  @Patch("invoices/:id/cancel")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  cancelInvoice(
    @Request() req: AuthenticatedRequest,
    @Param("id", ParseIntPipe) id: number,
    @Body("reason") reason?: string,
  ) {
    return this.billingService.cancel(id, reason || "Cancelada por el usuario", req.user.clinicId);
  }

  @Delete("invoices/:id")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  removeInvoice(
    @Request() req: AuthenticatedRequest,
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.billingService.remove(id, req.user.clinicId);
  }

  /* ============================================
   * PAYMENT ENDPOINTS
   * ============================================ */

  @Post("payments")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return this.billingService.createPayment(createPaymentDto);
  }

  /* ============================================
   * STATISTICS AND REPORTING ENDPOINTS
   * ============================================ */

  @Get("stats")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  getBillingStats(
    @Request() req: AuthenticatedRequest,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
  ) {
    return this.billingService.getBillingStats(
      req.user.clinicId, // Filter by user's clinic
      startDate,
      endDate,
    );
  }

  @Post("invoices/mark-overdue")
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  markOverdueInvoices() {
    return this.billingService.markOverdueInvoices();
  }

  /* ============================================
   * CATALOG ENDPOINTS
   * ============================================ */

  @Get("catalog/invoice-statuses")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  findAllInvoiceStatuses() {
    return this.billingService.findAllInvoiceStatuses();
  }

  @Get("catalog/payment-methods")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  findAllPaymentMethods() {
    return this.billingService.findAllPaymentMethods();
  }

  @Get("catalog/invoice-types")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  findAllInvoiceTypes() {
    return this.billingService.findAllInvoiceTypes();
  }

  @Get("catalog/payment-statuses")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  findAllPaymentStatuses() {
    return this.billingService.findAllPaymentStatuses();
  }

  @Get("catalog/discount-types")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  findAllDiscountTypes() {
    return this.billingService.findAllDiscountTypes();
  }

  @Get("catalog/expense-categories")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  findAllExpenseCategories() {
    return this.billingService.getExpenseCategories();
  }

  @Get("catalog/expense-statuses")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  findAllExpenseStatuses() {
    return this.billingService.getExpenseStatuses();
  }

  /* ============================================
   * EXPENSE ENDPOINTS
   * ============================================ */

  @Post("expenses")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  createExpense(
    @Request() req: AuthenticatedRequest,
    @Body() createExpenseDto: any,
  ) {
    return this.billingService.createExpense({
      ...createExpenseDto,
      clinicId: req.user.clinicId,
      doctorId: req.user.role === UserRole.DOCTOR ? req.user.id : undefined,
    });
  }

  @Get("expenses")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  findAllExpenses(
    @Request() req: AuthenticatedRequest,
    @Query("category") category?: string,
    @Query("status") status?: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
  ) {
    const options = {
      clinicId: req.user.clinicId,
      category,
      status,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };

    return this.billingService.findAllExpenses(options);
  }

  @Get("expenses/:id")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  findExpenseById(@Param("id", ParseIntPipe) id: number) {
    return this.billingService.findExpenseById(id);
  }

  @Patch("expenses/:id")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  updateExpense(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateExpenseDto: any,
  ) {
    return this.billingService.updateExpense(id, updateExpenseDto);
  }

  // Mark expense as paid
  @Patch("expenses/:id/pay")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  markExpenseAsPaid(@Param("id", ParseIntPipe) id: number, @Request() req: any) {
    return this.billingService.markExpenseAsPaid(id, req.user.clinicId);
  }

  // Cancel expense
  @Patch("expenses/:id/cancel")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  cancelExpense(@Param("id", ParseIntPipe) id: number, @Request() req: any) {
    return this.billingService.cancelExpense(id, req.user.clinicId);
  }

  @Delete("expenses/:id")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  deleteExpense(@Param("id", ParseIntPipe) id: number) {
    return this.billingService.deleteExpense(id);
  }
}
