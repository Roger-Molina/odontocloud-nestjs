import { IsOptional, IsDateString, IsEnum, IsInt, Min } from "class-validator";
import { Transform } from "class-transformer";

export enum ReportPeriod {
  DAY = "day",
  WEEK = "week",
  MONTH = "month",
  QUARTER = "quarter",
  YEAR = "year",
  CUSTOM = "custom",
}

export class DoctorReportQueryDto {
  @IsOptional()
  @IsEnum(ReportPeriod)
  period?: ReportPeriod = ReportPeriod.MONTH;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value as string))
  @IsInt()
  @Min(1)
  clinicId?: number;

  @IsOptional()
  includePatientDetails?: boolean = false;

  @IsOptional()
  includeFinancialData?: boolean = true;

  @IsOptional()
  includeAppointmentDetails?: boolean = true;
}

// Interfaces para las estadísticas del reporte
export interface AppointmentStats {
  total: number;
  completed: number;
  cancelled: number;
  noShow: number;
  inProgress: number;
  scheduled: number;
  completionRate: number;
  cancellationRate: number;
  noShowRate: number;
}

export interface RevenueStats {
  totalRevenue: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  averageInvoiceAmount: number;
  totalInvoices: number;
  collectionRate: number;
}

export interface PatientStats {
  newPatients: number;
  returningPatients: number;
  totalUniquePatients: number;
  averageAgeGroup: string;
  genderDistribution: {
    male: number;
    female: number;
    other: number;
  };
}

export interface PerformanceMetrics {
  appointmentsPerDay: number;
  averageConsultationTime: number; // en minutos
  revenuePerHour: number;
  utilizationRate: number; // porcentaje
}

export interface TreatmentSummary {
  treatmentName: string;
  count: number;
  totalRevenue: number;
  averagePrice: number;
}

export interface MonthlyTrend {
  month: string;
  appointments: number;
  revenue: number;
  patients: number;
}

export interface ReportSummary {
  totalWorkingDays: number;
  totalWorkingHours: number;
  busiestDay: string;
  mostCommonAppointmentType: string;
}

export class DoctorReportResponseDto {
  doctorId: number;
  doctorName: string;
  clinicName: string;
  period: string;
  generatedAt: Date;
  appointmentStats: AppointmentStats;
  revenueStats: RevenueStats;
  patientStats: PatientStats;
  performanceMetrics: PerformanceMetrics;
  topTreatments: TreatmentSummary[];
  monthlyTrends: MonthlyTrend[];
  summary: ReportSummary;
}

// DTO para reportes generales de la clínica
export class ClinicReportQueryDto {
  @IsOptional()
  @IsEnum(ReportPeriod)
  period?: ReportPeriod = ReportPeriod.MONTH;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  includeDoctorBreakdown?: boolean = true;

  @IsOptional()
  includePatientDemographics?: boolean = false;
}

export interface ClinicStats {
  totalDoctors: number;
  activeDoctors: number;
  totalAppointments: number;
  totalRevenue: number;
  totalPatients: number;
  occupancyRate: number;
}

export interface DoctorPerformance {
  doctorId: number;
  doctorName: string;
  appointments: number;
  revenue: number;
  patientsSeen: number;
  averageRating: number;
}

export class ClinicReportResponseDto {
  clinicId: number;
  clinicName: string;
  period: string;
  generatedAt: Date;
  clinicStats: ClinicStats;
  doctorPerformances: DoctorPerformance[];
  patientStats: PatientStats;
  revenueStats: RevenueStats;
  summary: {
    bestPerformingDoctor: string;
    busiesPeriod: string;
    totalWorkingHours: number;
    patientSatisfactionRate: number;
  };
}
