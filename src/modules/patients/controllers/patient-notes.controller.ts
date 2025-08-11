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
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { PatientNotesService } from "../services/patient-notes.service";
import { CreatePatientNoteDto } from "../dto/create-patient-note.dto";
import { UpdatePatientNoteDto } from "../dto/update-patient-note.dto";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import { UserRole, User } from "../../users/entities/user.entity";

@ApiTags("patient-notes")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("patients/:patientId/notes")
export class PatientNotesController {
  constructor(private readonly patientNotesService: PatientNotesService) {}

  @Get("count")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: "Get total count of notes for a patient" })
  @ApiParam({ name: "patientId", description: "Patient ID" })
  @ApiResponse({ status: 200, description: "Count retrieved successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "Patient not found" })
  async countByPatient(
    @Param("patientId", ParseIntPipe) patientId: number,
    @CurrentUser() user: User,
  ) {
    const count = await this.patientNotesService.countByPatient(
      patientId,
      user.clinicId || undefined,
    );
    return { count };
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: "Create a new patient note" })
  @ApiParam({ name: "patientId", description: "Patient ID" })
  @ApiResponse({ status: 201, description: "Note created successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "Patient not found" })
  async create(
    @Param("patientId", ParseIntPipe) patientId: number,
    @Body() createPatientNoteDto: CreatePatientNoteDto,
    @CurrentUser() user: User,
  ) {
    // Asegurar que el patientId del parámetro coincida con el del body
    const noteDto = {
      ...createPatientNoteDto,
      patientId,
    };

    return this.patientNotesService.create(
      noteDto,
      user.id,
      user.clinicId || undefined,
    );
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: "Get notes for a patient with pagination" })
  @ApiParam({ name: "patientId", description: "Patient ID" })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Number of notes per page (default: 15)",
  })
  @ApiQuery({
    name: "offset",
    required: false,
    description: "Number of notes to skip (default: 0)",
  })
  @ApiResponse({ status: 200, description: "Notes found successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "Patient not found" })
  async findByPatient(
    @Param("patientId", ParseIntPipe) patientId: number,
    @CurrentUser() user: User,
    @Query("limit") limit?: string,
    @Query("offset") offset?: string,
  ) {
    const options = {
      limit: limit ? parseInt(limit) : 15,
      offset: offset ? parseInt(offset) : 0,
    };

    return this.patientNotesService.findByPatient(
      patientId,
      options,
      user.clinicId || undefined,
    );
  }

  @Get(":noteId")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: "Get a specific patient note" })
  @ApiParam({ name: "patientId", description: "Patient ID" })
  @ApiParam({ name: "noteId", description: "Note ID" })
  @ApiResponse({ status: 200, description: "Note found successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "Note not found" })
  async findOne(
    @Param("patientId", ParseIntPipe) patientId: number,
    @Param("noteId", ParseIntPipe) noteId: number,
    @CurrentUser() user: User,
  ) {
    return this.patientNotesService.findOne(noteId, user.clinicId || undefined);
  }

  @Patch(":noteId")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: "Update a patient note" })
  @ApiParam({ name: "patientId", description: "Patient ID" })
  @ApiParam({ name: "noteId", description: "Note ID" })
  @ApiResponse({ status: 200, description: "Note updated successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "Note not found" })
  async update(
    @Param("patientId", ParseIntPipe) patientId: number,
    @Param("noteId", ParseIntPipe) noteId: number,
    @Body() updatePatientNoteDto: UpdatePatientNoteDto,
    @CurrentUser() user: User,
  ) {
    return this.patientNotesService.update(
      noteId,
      updatePatientNoteDto,
      user.id,
      user.clinicId || undefined,
    );
  }

  @Delete(":noteId")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: "Delete a patient note" })
  @ApiParam({ name: "patientId", description: "Patient ID" })
  @ApiParam({ name: "noteId", description: "Note ID" })
  @ApiResponse({ status: 200, description: "Note deleted successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "Note not found" })
  async remove(
    @Param("patientId", ParseIntPipe) patientId: number,
    @Param("noteId", ParseIntPipe) noteId: number,
    @CurrentUser() user: User,
  ) {
    await this.patientNotesService.remove(
      noteId,
      user.id,
      user.clinicId || undefined,
    );
    return { message: "Note deleted successfully" };
  }
}
