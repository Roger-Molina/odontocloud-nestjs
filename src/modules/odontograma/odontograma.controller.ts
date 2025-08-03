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
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { OdontogramaService } from "./odontograma.service";
import { CreateOdontogramDto } from "./dto/create-odontogram.dto";
import { UpdateOdontogramDto } from "./dto/update-odontogram.dto";
import { UpdateOdontogramStatusDto } from "./dto/update-status.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { UserRole } from "../users/entities/user.entity";

@Controller("odontograma")
@UseGuards(JwtAuthGuard, RolesGuard)
export class OdontogramaController {
  constructor(private readonly odontogramaService: OdontogramaService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createOdontogramDto: CreateOdontogramDto,
    @CurrentUser() user: any,
  ) {
    return this.odontogramaService.create(createOdontogramDto, user);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  findAll(
    @CurrentUser() user: any,
    @Query("status") status?: string,
    @Query("clinicId") clinicId?: number,
    @Query("limit") limit?: number,
    @Query("offset") offset?: number,
  ) {
    return this.odontogramaService.findAll({
      status,
      clinicId,
      limit,
      offset,
    });
  }

  @Get("active")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  findActive(@CurrentUser() user: any) {
    return this.odontogramaService.findActive();
  }

  @Get("code/:code")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  findByCode(@Param("code") code: string, @CurrentUser() user: any) {
    return this.odontogramaService.findByCode(code);
  }

  @Get("patient/:patientId")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  findByPatient(
    @Param("patientId", ParseIntPipe) patientId: number,
    @CurrentUser() user: any,
  ) {
    return this.odontogramaService.findByPatient(patientId);
  }

  @Get("patient/:patientId/latest")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  findLatestByPatient(
    @Param("patientId", ParseIntPipe) patientId: number,
    @CurrentUser() user: any,
  ) {
    return this.odontogramaService.findLatestByPatient(patientId);
  }

  @Get("statistics/overview")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  getStatistics(
    @CurrentUser() user: any,
    @Query("clinicId") clinicId?: number,
  ) {
    return this.odontogramaService.getStatistics(clinicId);
  }

  @Get(":id")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  findOne(@Param("id", ParseIntPipe) id: number, @CurrentUser() user: any) {
    return this.odontogramaService.findOne(id);
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateOdontogramDto: UpdateOdontogramDto,
    @CurrentUser() user: any,
  ) {
    console.log("[OdontogramaController] Updating odontogram with ID:", id);
    console.log("[OdontogramaController] Update data:", updateOdontogramDto);
    return this.odontogramaService.update(id, updateOdontogramDto, user);
  }

  @Patch(":id/status")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  updateStatus(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateOdontogramStatusDto,
    @CurrentUser() user: any,
  ) {
    return this.odontogramaService.updateStatus(id, updateStatusDto.status);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id", ParseIntPipe) id: number, @CurrentUser() user: any) {
    return this.odontogramaService.remove(id);
  }
}
