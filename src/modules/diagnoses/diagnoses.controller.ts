import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { DiagnosesService } from "./diagnoses.service";
import {
  DiagnosisCategory,
  DiagnosisSeverity,
} from "./entities/diagnosis.entity";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { User, UserRole } from "../users/entities/user.entity";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("diagnoses")
export class DiagnosesController {
  constructor(private readonly diagnosesService: DiagnosesService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  findAll(
    @CurrentUser() user: User,
    @Query("category") category?: DiagnosisCategory,
  ) {
    return this.diagnosesService.findAll(user.clinicId!, category);
  }

  @Get("by-category")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  findByCategory(
    @CurrentUser() user: User,
    @Query("category") category: DiagnosisCategory,
  ) {
    return this.diagnosesService.findByCategory(user.clinicId!, category);
  }

  @Get("by-severity")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  findBySeverity(
    @CurrentUser() user: User,
    @Query("severity") severity: DiagnosisSeverity,
  ) {
    return this.diagnosesService.findBySeverity(user.clinicId!, severity);
  }
}
