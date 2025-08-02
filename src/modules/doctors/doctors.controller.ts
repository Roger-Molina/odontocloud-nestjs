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
import { DoctorsService } from "./doctors.service";
import { CreateDoctorDto } from "./dto/create-doctor.dto";
import { UpdateDoctorDto } from "./dto/update-doctor.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { UserRole } from "../users/entities/user.entity";

@Controller("doctors")
@UseGuards(JwtAuthGuard, RolesGuard)
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  create(@Body() createDoctorDto: CreateDoctorDto, @CurrentUser() user: any) {
    return this.doctorsService.create(createDoctorDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  findAll(@CurrentUser() user: any) {
    return this.doctorsService.findAllIncludingUsers();
  }

  @Get("active")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  findActive(@CurrentUser() user: any) {
    return this.doctorsService.findActive();
  }

  // findBySpecialization endpoint removed - use specialties filter instead

  @Get(":id")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  findOne(@Param("id", ParseIntPipe) id: number, @CurrentUser() user: any) {
    return this.doctorsService.findOne(id);
  }

  @Get("code/:code")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  findByCode(@Param("code") code: string, @CurrentUser() user: any) {
    return this.doctorsService.findByCode(code);
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateDoctorDto: UpdateDoctorDto,
    @CurrentUser() user: any,
  ) {
    return this.doctorsService.update(id, updateDoctorDto);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  remove(@Param("id", ParseIntPipe) id: number, @CurrentUser() user: any) {
    return this.doctorsService.remove(id);
  }
}
