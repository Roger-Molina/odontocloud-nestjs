import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { TreatmentsService } from "./treatments.service";
import { TreatmentCategory } from "./entities/treatment.entity";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { User, UserRole } from "../users/entities/user.entity";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("treatments")
export class TreatmentsController {
  constructor(private readonly treatmentsService: TreatmentsService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  findAll(
    @CurrentUser() user: User,
    @Query("category") category?: TreatmentCategory,
  ) {
    return this.treatmentsService.findAll(user.clinicId!, category);
  }

  @Get("by-category")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  findByCategory(
    @CurrentUser() user: User,
    @Query("category") category: TreatmentCategory,
  ) {
    return this.treatmentsService.findByCategory(user.clinicId!, category);
  }
}
