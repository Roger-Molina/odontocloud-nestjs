import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AppointmentsService } from "./appointments.service";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { UpdateAppointmentDto } from "./dto/update-appointment.dto";
import { AppointmentStatus } from "./entities/appointment.entity";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { User, UserRole } from "../users/entities/user.entity";

@Controller("appointments")
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  async create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @CurrentUser() user: User,
  ) {
    if (!user.clinicId) {
      throw new Error("No clinic context for user");
    }
    return this.appointmentsService.create(createAppointmentDto, user.clinicId);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  findAll(
    @CurrentUser() user: User,
    @Query("status") status?: AppointmentStatus,
    @Query("limit") limit?: number,
    @Query("offset") offset?: number,
    @Query("doctorId") doctorId?: number,
    @Query("date") date?: string,
  ) {
    if (!user.clinicId) {
      throw new Error("No clinic context for user");
    }
    return this.appointmentsService.findAll(user.clinicId, {
      status,
      limit,
      offset,
      doctorId,
      date,
    });
  }

  @Get("patient/:patientId")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  findByPatient(
    @Param("patientId", ParseIntPipe) patientId: number,
    @CurrentUser() user: User,
  ) {
    if (!user.clinicId) {
      throw new Error("No clinic context for user");
    }
    return this.appointmentsService.findByPatient(patientId, user.clinicId);
  }

  @Get("doctor/:doctorId")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  findByDoctor(
    @Param("doctorId", ParseIntPipe) doctorId: number,
    @CurrentUser() user: User,
  ) {
    if (!user.clinicId) {
      throw new Error("No clinic context for user");
    }
    return this.appointmentsService.findByDoctor(doctorId, user.clinicId);
  }
  @Get(":id")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  findOne(@Param("id", ParseIntPipe) id: number, @CurrentUser() user: User) {
    if (!user.clinicId) {
      throw new Error("No clinic context for user");
    }
    return this.appointmentsService.findOne(id, user.clinicId);
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
    @CurrentUser() user: User,
  ) {
    if (!user.clinicId) {
      throw new Error("No clinic context for user");
    }
    return this.appointmentsService.update(
      id,
      updateAppointmentDto,
      user.clinicId,
    );
  }

  @Patch(":id/confirm")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  confirm(@Param("id", ParseIntPipe) id: number, @CurrentUser() user: User) {
    if (!user.clinicId) {
      throw new Error("No clinic context for user");
    }
    return this.appointmentsService.confirm(id, user.clinicId);
  }

  @Patch(":id/cancel")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  cancel(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: User,
    @Body("reason") reason?: string,
  ) {
    if (!user.clinicId) {
      throw new Error("No clinic context for user");
    }
    return this.appointmentsService.cancel(id, user.clinicId, reason);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  remove(@Param("id", ParseIntPipe) id: number, @CurrentUser() user: User) {
    if (!user.clinicId) {
      throw new Error("No clinic context for user");
    }
    return this.appointmentsService.remove(id, user.clinicId);
  }
}
