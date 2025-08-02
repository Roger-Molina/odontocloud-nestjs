import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import { SpecialtiesService } from "./specialties.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../users/entities/user.entity";

@Controller("specialties")
//@UseGuards(JwtAuthGuard, RolesGuard)
export class SpecialtiesController {
  constructor(private readonly specialtiesService: SpecialtiesService) {}

  @Post()
  //@Roles(UserRole.ADMIN, UserRole.DOCTOR)
  create(@Body() body: any) {
    return this.specialtiesService.create(body);
  }

  @Get()
  //@Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  findAll(
    @Query("limit") limit?: number,
    @Query("page") page?: number,
    @Query("search") search?: string,
  ) {
    return this.specialtiesService.findAll({
      limit: limit ? Number(limit) : 10,
      page: page ? Number(page) : 1,
      search: search || "",
    });
  }

  @Get(":id")
  //@Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE)
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.specialtiesService.findOne(id);
  }

  @Patch(":id")
  //@Roles(UserRole.ADMIN)
  update(@Param("id", ParseIntPipe) id: number, @Body() body: any) {
    return this.specialtiesService.update(id, body);
  }

  @Delete(":id")
  //@Roles(UserRole.ADMIN)
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.specialtiesService.remove(id);
  }
}
