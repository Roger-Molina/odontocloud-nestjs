import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import { MedicalRecordsService } from "./medical-records.service";
import { MedicalRecord } from "./entities/medical-record.entity";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { User, UserRole } from "../users/entities/user.entity";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("medical-records")
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

  // Listar todos los registros médicos de la clínica del usuario (opcional, para admin)
  @Get()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  findAll(
    @CurrentUser() user: User,
    @Query("limit") limit?: number,
    @Query("offset") offset?: number,
  ) {
    return this.medicalRecordsService.findAll(user.clinicId!, {
      limit,
      offset,
    });
  }

  // Crear registro médico general (requiere patientId en el body)
  @Post()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async create(@CurrentUser() user: User, @Body() dto: Partial<MedicalRecord>) {
    if (!dto.patientId) {
      throw new Error("Patient ID is required");
    }

    // Obtener el doctor correspondiente al usuario
    const doctor = await this.medicalRecordsService.findDoctorByUserId(
      user.id,
      user.clinicId!,
    );
    if (!doctor) {
      throw new Error("Doctor profile not found for user");
    }

    return this.medicalRecordsService.create(
      {
        ...dto,
        doctorId: doctor.id, // Usar el ID del doctor, no del usuario
      },
      user.clinicId!,
      user.id,
    );
  }

  // Listar registros médicos de un paciente SOLO de la clínica del usuario
  @Get("/patient/:patientId")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  async findByPatient(
    @CurrentUser() user: User,
    @Param("patientId", ParseIntPipe) patientId: number,
    @Query("limit") limit?: number,
    @Query("offset") offset?: number,
    @Query("type") type?: string,
    @Query("search") search?: string,
  ) {
    const records = await this.medicalRecordsService.findByPatient(
      patientId,
      user.clinicId!,
      {
        limit,
        offset,
        type,
        search,
      },
    );
    // Siempre devolver un array JSON válido
    return Array.isArray(records) ? records : [];
  }

  // Crear registro médico para un paciente (solo en la clínica del usuario)
  @Post("/patient/:patientId")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async createForPatient(
    @CurrentUser() user: User,
    @Param("patientId", ParseIntPipe) patientId: number,
    @Body() dto: Partial<MedicalRecord>,
  ) {
    // Obtener el doctor correspondiente al usuario
    const doctor = await this.medicalRecordsService.findDoctorByUserId(
      user.id,
      user.clinicId!,
    );
    if (!doctor) {
      throw new Error("Doctor profile not found for user");
    }

    // Forzar la clínica del usuario
    return this.medicalRecordsService.create(
      {
        ...dto,
        patientId,
        doctorId: doctor.id, // Usar el ID del doctor, no del usuario
      },
      user.clinicId!,
      user.id,
    );
  }

  // Obtener detalle de un registro médico (solo si pertenece a la clínica del usuario)
  @Get(":id")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  findOne(@CurrentUser() user: User, @Param("id", ParseIntPipe) id: number) {
    if (!user.clinicId) {
      throw new Error("No clinic context for user");
    }
    return this.medicalRecordsService.findOne(id, user.clinicId);
  }

  // Editar registro médico (solo si pertenece a la clínica del usuario)
  @Put(":id")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  update(
    @CurrentUser() user: User,
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: Partial<MedicalRecord>,
  ) {
    if (!user.clinicId) {
      throw new Error("No clinic context for user");
    }
    return this.medicalRecordsService.update(id, dto, user.clinicId);
  }

  // Eliminar registro médico (solo si pertenece a la clínica del usuario)
  @Delete(":id")
  @Roles(UserRole.ADMIN)
  remove(@CurrentUser() user: User, @Param("id", ParseIntPipe) id: number) {
    if (!user.clinicId) {
      throw new Error("No clinic context for user");
    }
    return this.medicalRecordsService.remove(id, user.clinicId);
  }
}
