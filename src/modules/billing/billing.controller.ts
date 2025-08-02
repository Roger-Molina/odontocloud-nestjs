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
    return this.billingService.create(invoiceData);
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
    @Param("status") status: InvoiceStatus,
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
    return this.billingService.cancel(id, reason, req.user.clinicId);
  }

  @Delete("invoices/:id")
  @Roles(UserRole.ADMIN)
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
}
