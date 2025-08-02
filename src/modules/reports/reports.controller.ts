import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from "@nestjs/common";
import { ReportsService } from "./reports.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../users/entities/user.entity";
import { DoctorReportQueryDto } from "./dto/doctor-report.dto";

@Controller("reports")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get("doctor/:doctorId")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async getDoctorReport(
    @Param("doctorId", ParseIntPipe) doctorId: number,
    @Query() query: DoctorReportQueryDto,
  ) {
    return this.reportsService.getDoctorReport(doctorId, query);
  }

  @Get("doctor/:doctorId/summary")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async getDoctorSummary(
    @Param("doctorId", ParseIntPipe) doctorId: number,
    @Query() query: DoctorReportQueryDto,
  ) {
    const report = await this.reportsService.getDoctorReport(doctorId, query);
    return {
      doctorName: report.doctorName,
      clinicName: report.clinicName,
      period: report.period,
      summary: report.summary,
      appointmentStats: {
        total: report.appointmentStats.total,
        completed: report.appointmentStats.completed,
        completionRate: report.appointmentStats.completionRate,
      },
      patientStats: {
        totalUniquePatients: report.patientStats.totalUniquePatients,
        newPatients: report.patientStats.newPatients,
      },
    };
  }

  @Get("doctor/:doctorId/performance")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async getDoctorPerformance(
    @Param("doctorId", ParseIntPipe) doctorId: number,
    @Query() query: DoctorReportQueryDto,
  ) {
    const report = await this.reportsService.getDoctorReport(doctorId, query);
    return {
      doctorName: report.doctorName,
      period: report.period,
      performanceMetrics: report.performanceMetrics,
      appointmentStats: report.appointmentStats,
      summary: report.summary,
    };
  }

  @Get("doctor/:doctorId/statistics")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async getDoctorStatistics(
    @Param("doctorId", ParseIntPipe) doctorId: number,
    @Query() query: DoctorReportQueryDto,
  ) {
    const report = await this.reportsService.getDoctorReport(doctorId, query);
    return {
      doctorId: report.doctorId,
      doctorName: report.doctorName,
      clinicName: report.clinicName,
      period: report.period,
      generatedAt: report.generatedAt,
      appointmentStats: report.appointmentStats,
      patientStats: report.patientStats,
      performanceMetrics: report.performanceMetrics,
      summary: report.summary,
    };
  }
}
