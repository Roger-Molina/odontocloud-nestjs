import {
  Controller,
  Get,
  UseGuards,
  Query,
} from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { UserRole } from "../users/entities/user.entity";

@Controller("dashboard")
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get("doctor")
  @Roles(UserRole.DOCTOR)
  getDoctorDashboard(
    @CurrentUser() user: any,
    @Query("clinicId") clinicId?: number,
    @Query("period") period?: "day" | "week" | "month" | "year",
  ) {
    return this.dashboardService.getDoctorDashboard(
      user.id,
      clinicId,
      period || "month",
    );
  }

  @Get("admin")
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  getAdminDashboard(
    @CurrentUser() user: any,
    @Query("clinicId") clinicId?: number,
    @Query("period") period?: "day" | "week" | "month" | "year",
  ) {
    return this.dashboardService.getAdminDashboard(
      clinicId,
      period || "month",
    );
  }

  @Get("overview")
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  getOverviewStats(
    @CurrentUser() user: any,
    @Query("clinicId") clinicId?: number,
  ) {
    return this.dashboardService.getOverviewStats(clinicId);
  }
}
