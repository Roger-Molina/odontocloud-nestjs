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
  Request,
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
    return this.patientsService.create(createPatientDto);
  }

  @Post("clinic/:clinicId")
  @UseGuards(ClinicAccessGuard)
  @ApiOperation({ summary: "Register patient in clinic" })
  @ApiResponse({ status: 201, description: "Patient registered in clinic" })
  createInClinic(
    @Param("clinicId", ParseIntPipe) clinicId: number,
    @Body() createPatientDto: CreatePatientDto,
    @Request() req: any,
  ) {
    // Verificar que el doctor pertenece a esta clínica
    if (req.user.role === "doctor" && req.user.doctor?.clinicId !== clinicId) {
      throw new Error("Cannot register patient in different clinic");
    }
    return this.patientsService.createPatientInClinic(
      createPatientDto,
      clinicId,
    );
  }

  @Get("clinic/:clinicId")
  @UseGuards(ClinicAccessGuard)
  @ApiOperation({ summary: "Get patients by clinic" })
  @ApiResponse({ status: 200, description: "List of patients in clinic" })
  findByClinic(
    @Param("clinicId", ParseIntPipe) clinicId: number,
    @Request() req: any,
  ) {
    // Verificar que el doctor pertenece a esta clínica
    if (req.user.role === "doctor" && req.user.doctor?.clinicId !== clinicId) {
      throw new Error("Cannot access patients from different clinic");
    }
    return this.patientsService.findPatientsByClinic(clinicId);
  }

  @Get("clinic/:clinicId/patient/:patientId")
  @UseGuards(ClinicAccessGuard)
  @ApiOperation({ summary: "Get patient in specific clinic" })
  @ApiResponse({ status: 200, description: "Patient found in clinic" })
  findInClinic(
    @Param("clinicId", ParseIntPipe) clinicId: number,
    @Param("patientId", ParseIntPipe) patientId: number,
    @Request() req: any,
  ) {
    // Verificar que el doctor pertenece a esta clínica
    if (req.user.role === "doctor" && req.user.doctor?.clinicId !== clinicId) {
      throw new Error("Cannot access patient from different clinic");
    }
    return this.patientsService.findPatientInClinic(patientId, clinicId);
  }

  @Get()
  @ApiOperation({ summary: "Get all patients" })
  @ApiResponse({ status: 200, description: "List of patients" })
  findAll() {
    return this.patientsService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a patient by ID" })
  @ApiResponse({ status: 200, description: "Patient found" })
  @ApiResponse({ status: 404, description: "Patient not found" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.patientsService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a patient" })
  @ApiResponse({ status: 200, description: "Patient updated successfully" })
  @ApiResponse({ status: 404, description: "Patient not found" })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updatePatientDto: UpdatePatientDto,
  ) {
    return this.patientsService.update(id, updatePatientDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a patient" })
  @ApiResponse({ status: 200, description: "Patient deleted successfully" })
  @ApiResponse({ status: 404, description: "Patient not found" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.patientsService.remove(id);
  }
}
