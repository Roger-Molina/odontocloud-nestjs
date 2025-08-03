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
  async getDoctorDashboard(
    @CurrentUser() user: any,
    @Query("clinicId") clinicId?: number,
    @Query("period") period?: "day" | "week" | "month" | "year",
  ) {
    console.log('[DashboardController] User:', user);
    console.log('[DashboardController] Params - clinicId:', clinicId, 'period:', period);
    
    const result = await this.dashboardService.getDoctorDashboard(
      user.id, // Pasamos el userId, el service se encargará de obtener el doctorId
      clinicId,
      period || "month",
    );
    
    console.log('[DashboardController] Dashboard result:', JSON.stringify(result, null, 2));
    return result;
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
