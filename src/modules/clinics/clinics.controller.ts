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
} from "@nestjs/common";
import { ClinicsService } from "./clinics.service";
import { CreateClinicDto } from "./dto/create-clinic.dto";
import { UpdateClinicDto } from "./dto/update-clinic.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { UserRole } from "../users/entities/user.entity";

@Controller("clinics")
//@UseGuards(JwtAuthGuard, RolesGuard)
export class ClinicsController {
  constructor(private readonly clinicsService: ClinicsService) {}

  @Post()
  ////@Roles(UserRole.ADMIN)
  create(@Body() createClinicDto: CreateClinicDto, @CurrentUser() user: any) {
    return this.clinicsService.create(createClinicDto);
  }

  @Get()
  ////@Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  findAll(@CurrentUser() user: any) {
    return this.clinicsService.findAll();
  }

  @Get("active")
  //@Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  findActive(@CurrentUser() user: any) {
    return this.clinicsService.findActive();
  }

  @Get(":id")
  //@Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  findOne(@Param("id", ParseIntPipe) id: number, @CurrentUser() user: any) {
    return this.clinicsService.findOne(id);
  }

  // findByCode eliminado porque clinicCode ya no existe

  @Patch(":id")
  //@Roles(UserRole.ADMIN)
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateClinicDto: UpdateClinicDto,
    @CurrentUser() user: any,
  ) {
    return this.clinicsService.update(id, updateClinicDto);
  }

  @Delete(":id")
  //@Roles(UserRole.ADMIN)
  remove(@Param("id", ParseIntPipe) id: number, @CurrentUser() user: any) {
    return this.clinicsService.remove(id);
  }
}
