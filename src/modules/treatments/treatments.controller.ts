import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { TreatmentsService } from "./treatments.service";
import { TreatmentCategory } from "./entities/treatment.entity";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../users/entities/user.entity";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("treatments")
export class TreatmentsController {
  constructor(private readonly treatmentsService: TreatmentsService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  findAll(@Query("category") category?: TreatmentCategory) {
    return this.treatmentsService.findAll(category);
  }

  @Get("by-category")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  findByCategory(@Query("category") category: TreatmentCategory) {
    return this.treatmentsService.findByCategory(category);
  }
}
