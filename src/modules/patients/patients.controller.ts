import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Query,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { PatientsService } from "./patients.service";
import { CreatePatientDto } from "./dto/create-patient.dto";
import { UpdatePatientDto } from "./dto/update-patient.dto";
import { ClinicAccessGuard } from "../../common/guards/clinic-access.guard";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { UserRole, User } from "../users/entities/user.entity";

@ApiTags("patients")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("patients")
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: "Create a new patient globally" })
  @ApiResponse({ status: 201, description: "Patient created successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  create(
    @Body() createPatientDto: CreatePatientDto,
    @CurrentUser() user: User,
  ) {
    // Si el usuario autenticado tiene clinicId, asignarla al paciente
    if (user && user.clinicId) {
      const dtoWithClinic = Object.assign({}, createPatientDto, {
        clinicId: user.clinicId,
      });
      return this.patientsService.create(dtoWithClinic);
    }
    return this.patientsService.create(createPatientDto);
  }

  // Nueva ruta: obtener pacientes solo de la clínica del usuario autenticado
  @Get()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: "Get patients for current user clinic" })
  @ApiResponse({ status: 200, description: "Patients found successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  async findByUserClinic(
    @CurrentUser() user: User,
    @Query("limit") limit?: string,
    @Query("offset") offset?: string,
    @Query("search") search?: string,
  ) {
    if (!user.clinicId) {
      return { data: [], total: 0 };
    }

    const options = {
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
      search: search || undefined,
    };

    const patients = await this.patientsService.findPatientsByClinic(
      user.clinicId,
      options,
    );
    const total = await this.patientsService.countPatientsByClinic(
      user.clinicId,
      options,
    );

    return { data: patients, total };
  }

  @Post("clinic/:clinicId")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: "Register patient in clinic" })
  @ApiResponse({ status: 201, description: "Patient registered in clinic" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  createInClinic(
    @Param("clinicId", ParseIntPipe) clinicId: number,
    @Body() createPatientDto: CreatePatientDto,
    @CurrentUser() user: User,
  ) {
    return this.patientsService.createPatientInClinic(
      createPatientDto,
      clinicId,
    );
  }

  @Get(":id")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: "Get patient by ID" })
  @ApiResponse({ status: 200, description: "Patient found successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Patient not found" })
  findOne(@Param("id", ParseIntPipe) id: number, @CurrentUser() user: User) {
    return this.patientsService.findOne(id);
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: "Update patient" })
  @ApiResponse({ status: 200, description: "Patient updated successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "Patient not found" })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updatePatientDto: UpdatePatientDto,
    @CurrentUser() user: User,
  ) {
    return this.patientsService.update(id, updatePatientDto);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Delete patient" })
  @ApiResponse({ status: 200, description: "Patient deleted successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "Patient not found" })
  remove(@Param("id", ParseIntPipe) id: number, @CurrentUser() user: User) {
    return this.patientsService.remove(id);
  }
}
