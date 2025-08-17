import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Res,
} from "@nestjs/common";
import { Response } from "express";
import { BudgetService } from "./budget.service";
import { CreateBudgetDto } from "./dto/create-budget.dto";
import { UpdateBudgetDto } from "./dto/update-budget.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../users/entities/user.entity";
import { PdfService } from "../../common/services/pdf.service";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("budgets")
export class BudgetController {
  constructor(
    private readonly budgetService: BudgetService,
    private readonly pdfService: PdfService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  create(@Body() createBudgetDto: CreateBudgetDto) {
    return this.budgetService.create(createBudgetDto);
  }

  @Get("patient/:patientId")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  findByPatient(@Param("patientId", ParseIntPipe) patientId: number) {
    return this.budgetService.findByPatient(patientId);
  }

  @Get(":id")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.budgetService.findOne(id);
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateBudgetDto: UpdateBudgetDto,
  ) {
    return this.budgetService.update(id, updateBudgetDto);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.budgetService.remove(id);
  }

  @Patch(":id/approve")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  approve(@Param("id", ParseIntPipe) id: number) {
    return this.budgetService.approve(id);
  }

  @Patch(":id/reject")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  reject(
    @Param("id", ParseIntPipe) id: number,
    @Body("reason") reason?: string,
  ) {
    return this.budgetService.reject(id, reason);
  }

  @Patch(":id/send")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  send(@Param("id", ParseIntPipe) id: number) {
    return this.budgetService.send(id);
  }

  // Endpoints para cupones
  @Post("validate-coupon")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  validateCoupon(@Body() { code, amount }: { code: string; amount: number }) {
    return this.budgetService.validateCoupon(code, amount);
  }

  @Post("apply-coupon")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  applyCoupon(@Body() { code, amount }: { code: string; amount: number }) {
    return this.budgetService.applyCouponToBudget(code, amount);
  }

  // Endpoint para generar PDF
  @Get(":id/pdf")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  async generatePdf(
    @Param("id", ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    console.log(`[BudgetController] Generating PDF for budget ID: ${id}`);
    
    try {
      // Obtener el presupuesto con todos sus datos
      console.log(`[BudgetController] Finding budget ${id} for PDF`);
      const budget = await this.budgetService.findOneForPdf(id);
      console.log(`[BudgetController] Budget found:`, budget);
      
      // Generar el PDF
      console.log(`[BudgetController] Generating PDF with PdfService`);
      const pdfBuffer = await this.pdfService.generateBudgetPdf(budget);
      console.log(`[BudgetController] PDF generated, buffer size: ${pdfBuffer.length}`);
      
      // Configurar headers para la descarga
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="presupuesto-${budget.budgetNumber || id}.pdf"`,
        "Content-Length": pdfBuffer.length.toString(),
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      });
      
      console.log(`[BudgetController] Sending PDF response`);
      // Enviar el PDF
      res.send(pdfBuffer);
    } catch (error) {
      console.error(`[BudgetController] Error generating PDF for budget ${id}:`, error);
      console.error(`[BudgetController] Error stack:`, error.stack);
      
      // Verificar si la respuesta ya fue enviada
      if (res.headersSent) {
        console.error(`[BudgetController] Headers already sent, cannot send error response`);
        return;
      }
      
      res.status(500).json({
        message: "Error al generar el PDF",
        error: error.message,
      });
    }
  }
}
