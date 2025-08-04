import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { DiagnosesService } from "./diagnoses.service";
import {
  DiagnosisCategory,
  DiagnosisSeverity,
} from "./entities/diagnosis.entity";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../users/entities/user.entity";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("diagnoses")
export class DiagnosesController {
  constructor(private readonly diagnosesService: DiagnosesService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  findAll(@Query("category") category?: DiagnosisCategory) {
    return this.diagnosesService.findAll(category);
  }

  @Get("by-category")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  findByCategory(@Query("category") category: DiagnosisCategory) {
    return this.diagnosesService.findByCategory(category);
  }

  @Get("by-severity")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  findBySeverity(@Query("severity") severity: DiagnosisSeverity) {
    return this.diagnosesService.findBySeverity(severity);
  }
}
