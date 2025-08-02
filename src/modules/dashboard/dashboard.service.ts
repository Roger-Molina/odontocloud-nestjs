import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between } from "typeorm";
import { OdontogramaService } from "../odontograma/odontograma.service";
import { BillingService } from "../billing/billing.service";
import { MedicalRecordsService } from "../medical-records/medical-records.service";
import { AppointmentsService } from "../appointments/appointments.service";
import { PatientsService } from "../patients/patients.service";
import { Appointment } from "../appointments/entities/appointment.entity";
import { Patient } from "../patients/entities/patient.entity";
import { MedicalRecord } from "../medical-records/entities/medical-record.entity";
import { User, UserRole } from "../users/entities/user.entity";
import { Doctor } from "../doctors/entities/doctor.entity";
import { Clinic, ClinicStatus } from "../clinics/entities/clinic.entity";

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    @InjectRepository(MedicalRecord)
    private medicalRecordRepository: Repository<MedicalRecord>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    @InjectRepository(Clinic)
    private clinicRepository: Repository<Clinic>,
    private odontogramaService: OdontogramaService,
    private billingService: BillingService,
    private medicalRecordsService: MedicalRecordsService,
    private appointmentsService: AppointmentsService,
    private patientsService: PatientsService,
  ) {}

  async getDoctorDashboard(
    doctorId: number,
    clinicId?: number,
    period: "day" | "week" | "month" | "year" = "month",
  ) {
    const today = new Date();
    const startDate = this.getStartDate(today, period);

    // Obtener estadísticas de citas del doctor
    const appointmentStats = await this.getDoctorAppointmentStats(
      doctorId,
      startDate,
      today,
      clinicId,
    );

    // Obtener estadísticas de pacientes del doctor
    const patientStats = await this.getDoctorPatientStats(
      doctorId,
      startDate,
      today,
      clinicId,
    );

    // Obtener estadísticas de facturación del doctor
    const billingStats = await this.getDoctorBillingStats(
      doctorId,
      startDate,
      today,
      clinicId,
    );

    // Obtener estadísticas de odontogramas
    const odontogramStats = await this.odontogramaService.getStatistics(clinicId);

    // Obtener próximas citas
    const upcomingAppointments = await this.getDoctorUpcomingAppointments(doctorId, clinicId);

    // Obtener registros médicos recientes
    const recentMedicalRecords = await this.getDoctorRecentMedicalRecords(doctorId, clinicId);

    return {
      period,
      dateRange: {
        start: startDate,
        end: today,
      },
      appointments: appointmentStats,
      patients: patientStats,
      billing: billingStats,
      odontograms: odontogramStats,
      upcomingAppointments,
      recentMedicalRecords,
      summary: {
        totalAppointments: appointmentStats.total,
        completedAppointments: appointmentStats.completed,
        cancelledAppointments: appointmentStats.cancelled,
        totalPatients: patientStats.total,
        newPatients: patientStats.new,
        totalRevenue: billingStats.totalRevenue,
        pendingBills: billingStats.pending,
      },
    };
  }

  async getAdminDashboard(
    clinicId?: number,
    period: "day" | "week" | "month" | "year" = "month",
  ) {
    const today = new Date();
    const startDate = this.getStartDate(today, period);

    // Estadísticas generales del sistema
    const systemStats = await this.getSystemStats(startDate, today);
    
    // Estadísticas de clínicas
    const clinicStats = await this.getClinicStats(startDate, today, clinicId);
    
    // Estadísticas de usuarios y doctores
    const userStats = await this.getUserStats(startDate, today, clinicId);
    
    // Estadísticas de citas globales
    const appointmentStats = await this.getAppointmentStats(
      startDate,
      today,
      clinicId,
    );

    // Estadísticas de pacientes globales
    const patientStats = await this.getPatientStats(startDate, today, clinicId);

    // Estadísticas financieras
    const billingStats = await this.billingService.getBillingStats(
      clinicId,
      period,
    );

    // Estadísticas de odontogramas
    const odontogramStats = await this.odontogramaService.getStatistics(clinicId);

    // Top performers y métricas avanzadas
    const performanceStats = await this.getPerformanceStats(startDate, today, clinicId);

    return {
      period,
      dateRange: {
        start: startDate,
        end: today,
      },
      system: systemStats,
      clinics: clinicStats,
      users: userStats,
      appointments: appointmentStats,
      patients: patientStats,
      billing: billingStats,
      odontograms: odontogramStats,
      performance: performanceStats,
      summary: {
        totalClinics: clinicStats.total,
        totalUsers: userStats.total,
        totalDoctors: userStats.doctors,
        totalAppointments: appointmentStats.total,
        totalPatients: patientStats.total,
        totalRevenue: billingStats.totalAmount || 0,
        growthRate: performanceStats.growthRate,
      },
    };
  }

  async getOverviewStats(clinicId?: number) {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const appointmentStats = await this.getAppointmentStats(
      startOfMonth,
      today,
      clinicId,
    );

    const patientStats = await this.getPatientStats(startOfMonth, today, clinicId);

    const billingStats = await this.billingService.getBillingStats(
      clinicId,
      "month",
    );

    const odontogramStats = await this.odontogramaService.getStatistics(clinicId);

    return {
      appointments: appointmentStats,
      patients: patientStats,
      billing: billingStats,
      odontograms: odontogramStats,
      summary: {
        totalAppointments: appointmentStats.total,
        totalPatients: patientStats.total,
        totalRevenue: billingStats.totalAmount,
      },
    };
  }

  private getStartDate(today: Date, period: string): Date {
    const date = new Date(today);
    
    switch (period) {
      case "day":
        date.setHours(0, 0, 0, 0);
        break;
      case "week": {
        const dayOfWeek = date.getDay();
        const diff = date.getDate() - dayOfWeek;
        date.setDate(diff);
        date.setHours(0, 0, 0, 0);
        break;
      }
      case "month":
        date.setDate(1);
        date.setHours(0, 0, 0, 0);
        break;
      case "year":
        date.setMonth(0, 1);
        date.setHours(0, 0, 0, 0);
        break;
      default:
        date.setDate(1);
        date.setHours(0, 0, 0, 0);
    }
    
    return date;
  }

  // Métodos específicos del doctor
  private async getDoctorAppointmentStats(
    doctorId: number,
    startDate: Date,
    endDate: Date,
    clinicId?: number,
  ) {
    const whereConditions: any = {
      doctorId,
      appointmentDate: Between(startDate, endDate),
    };

    if (clinicId) {
      whereConditions.clinicId = clinicId;
    }

    const total = await this.appointmentRepository.count({
      where: whereConditions,
    });

    const completed = await this.appointmentRepository.count({
      where: {
        ...whereConditions,
        status: "completed",
      },
    });

    const cancelled = await this.appointmentRepository.count({
      where: {
        ...whereConditions,
        status: "cancelled",
      },
    });

    const pending = await this.appointmentRepository.count({
      where: {
        ...whereConditions,
        status: "scheduled",
      },
    });

    return {
      total,
      completed,
      cancelled,
      pending,
    };
  }

  private async getDoctorPatientStats(
    doctorId: number,
    startDate: Date,
    endDate: Date,
    clinicId?: number,
  ) {
    // Por ahora retornamos estadísticas básicas
    // En el futuro se puede expandir para incluir relaciones doctor-paciente
    const whereConditions: any = {
      createdAt: Between(startDate, endDate),
    };

    if (clinicId) {
      whereConditions.clinicId = clinicId;
    }

    const total = await this.patientRepository.count({
      where: whereConditions,
    });

    const newPatients = await this.patientRepository.count({
      where: {
        ...whereConditions,
        createdAt: Between(startDate, endDate),
      },
    });

    return {
      total,
      new: newPatients,
      returning: total - newPatients,
    };
  }

  private async getDoctorBillingStats(
    doctorId: number,
    startDate: Date,
    endDate: Date,
    clinicId?: number,
  ) {
    // Implementación básica - se puede expandir
    return {
      totalRevenue: 0,
      pending: 0,
      completed: 0,
    };
  }

  private async getDoctorUpcomingAppointments(doctorId: number, clinicId?: number) {
    const whereConditions: any = {
      doctorId,
      appointmentDate: Between(new Date(), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
      status: "scheduled",
    };

    if (clinicId) {
      whereConditions.clinicId = clinicId;
    }

    return await this.appointmentRepository.find({
      where: whereConditions,
      relations: ["patient"],
      order: { appointmentDate: "ASC" },
      take: 10,
    });
  }

  private async getDoctorRecentMedicalRecords(doctorId: number, clinicId?: number) {
    const whereConditions: any = {
      doctorId,
    };

    if (clinicId) {
      whereConditions.clinicId = clinicId;
    }

    return await this.medicalRecordRepository.find({
      where: whereConditions,
      relations: ["patient", "recordType"],
      order: { createdAt: "DESC" },
      take: 10,
    });
  }

  // Métodos para estadísticas generales
  private async getAppointmentStats(
    startDate: Date,
    endDate: Date,
    clinicId?: number,
  ) {
    const whereConditions: any = {
      appointmentDate: Between(startDate, endDate),
    };

    if (clinicId) {
      whereConditions.clinicId = clinicId;
    }

    const total = await this.appointmentRepository.count({
      where: whereConditions,
    });

    const completed = await this.appointmentRepository.count({
      where: {
        ...whereConditions,
        status: "completed",
      },
    });

    const cancelled = await this.appointmentRepository.count({
      where: {
        ...whereConditions,
        status: "cancelled",
      },
    });

    return {
      total,
      completed,
      cancelled,
      pending: total - completed - cancelled,
    };
  }

  private async getPatientStats(
    startDate: Date,
    endDate: Date,
    clinicId?: number,
  ) {
    const whereConditions: any = {};

    if (clinicId) {
      whereConditions.clinicId = clinicId;
    }

    const total = await this.patientRepository.count({
      where: whereConditions,
    });

    const newPatients = await this.patientRepository.count({
      where: {
        ...whereConditions,
        createdAt: Between(startDate, endDate),
      },
    });

    return {
      total,
      new: newPatients,
      returning: total - newPatients,
    };
  }

  // Métodos específicos del administrador
  private async getSystemStats(startDate: Date, endDate: Date) {
    const totalUsers = await this.userRepository.count();
    const newUsers = await this.userRepository.count({
      where: {
        createdAt: Between(startDate, endDate),
      },
    });

    const totalClinics = await this.clinicRepository.count();
    const activeClinics = await this.clinicRepository.count({
      where: {
        status: ClinicStatus.ACTIVE,
      },
    });

    return {
      totalUsers,
      newUsers,
      totalClinics,
      activeClinics,
      systemUptime: "99.9%",
      lastBackup: new Date(),
    };
  }

  private async getClinicStats(
    startDate: Date,
    endDate: Date,
    clinicId?: number,
  ) {
    if (clinicId) {
      const clinic = await this.clinicRepository.findOne({
        where: { id: clinicId },
      });

      if (!clinic) {
        throw new Error("Clínica no encontrada");
      }

      return {
        total: 1,
        active: clinic.status === ClinicStatus.ACTIVE ? 1 : 0,
        clinicDetails: {
          id: clinic.id,
          name: clinic.name,
          address: clinic.address,
          phone: clinic.phoneNumber,
          status: clinic.status,
          email: clinic.email,
        },
      };
    }

    const total = await this.clinicRepository.count();
    const active = await this.clinicRepository.count({
      where: { status: ClinicStatus.ACTIVE },
    });

    const topClinics = await this.clinicRepository.find({
      take: 5,
      order: { createdAt: "DESC" },
    });

    return {
      total,
      active,
      inactive: total - active,
      topPerforming: topClinics.map((clinic) => ({
        id: clinic.id,
        name: clinic.name,
        status: clinic.status,
      })),
    };
  }

  private async getUserStats(
    startDate: Date,
    endDate: Date,
    clinicId?: number,
  ) {
    let whereCondition = {};

    if (clinicId) {
      whereCondition = { clinicId };
    }

    const total = await this.userRepository.count({ where: whereCondition });

    const doctors = await this.userRepository.count({
      where: { ...whereCondition, role: UserRole.DOCTOR },
    });

    const nurses = await this.userRepository.count({
      where: { ...whereCondition, role: UserRole.NURSE },
    });

    const admins = await this.userRepository.count({
      where: { ...whereCondition, role: UserRole.ADMIN },
    });

    const newUsers = await this.userRepository.count({
      where: {
        ...whereCondition,
        createdAt: Between(startDate, endDate),
      },
    });

    const activeUsers = total; // Por ahora asumimos que todos están activos

    return {
      total,
      doctors,
      nurses,
      admins,
      newUsers,
      activeUsers,
      inactiveUsers: total - activeUsers,
      distribution: {
        doctors: total > 0 ? Math.round((doctors / total) * 100) : 0,
        nurses: total > 0 ? Math.round((nurses / total) * 100) : 0,
        admins: total > 0 ? Math.round((admins / total) * 100) : 0,
      },
    };
  }

  private async getPerformanceStats(
    startDate: Date,
    endDate: Date,
    clinicId?: number,
  ) {
    // Calcular crecimiento mes a mes
    const previousPeriodStart = new Date(startDate);
    previousPeriodStart.setMonth(previousPeriodStart.getMonth() - 1);
    const previousPeriodEnd = new Date(endDate);
    previousPeriodEnd.setMonth(previousPeriodEnd.getMonth() - 1);

    const currentAppointments = await this.appointmentRepository.count({
      where: {
        appointmentDate: Between(startDate, endDate),
        ...(clinicId && { clinicId }),
      },
    });

    const previousAppointments = await this.appointmentRepository.count({
      where: {
        appointmentDate: Between(previousPeriodStart, previousPeriodEnd),
        ...(clinicId && { clinicId }),
      },
    });

    const growthRate = previousAppointments > 0 
      ? Math.round(((currentAppointments - previousAppointments) / previousAppointments) * 100)
      : 0;

    // Top doctores por citas
    const topDoctors = await this.appointmentRepository
      .createQueryBuilder("appointment")
      .innerJoin("appointment.doctor", "doctor")
      .innerJoin("doctor.user", "user")
      .select([
        "user.id as doctorId",
        "user.firstName as firstName",
        "user.lastName as lastName",
        "COUNT(appointment.id) as appointmentsCount",
      ])
      .where("appointment.appointmentDate BETWEEN :startDate AND :endDate", {
        startDate,
        endDate,
      })
      .andWhere(clinicId ? "appointment.clinicId = :clinicId" : "1=1", { clinicId })
      .groupBy("user.id, user.firstName, user.lastName")
      .orderBy("appointmentsCount", "DESC")
      .limit(5)
      .getRawMany();

    return {
      growthRate,
      topDoctors: topDoctors.map(doctor => ({
        id: doctor.doctorId,
        name: `${doctor.firstName} ${doctor.lastName}`,
        appointmentsCount: parseInt(doctor.appointmentsCount),
      })),
      trends: {
        appointments: {
          current: currentAppointments,
          previous: previousAppointments,
          growth: growthRate,
        },
      },
    };
  }
}
