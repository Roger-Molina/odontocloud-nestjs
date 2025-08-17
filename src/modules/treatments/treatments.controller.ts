import { Controller, Get, Query, UseGuards, Post, Body } from "@nestjs/common";
import { TreatmentsService } from "./treatments.service";
import { TreatmentCategory } from "./entities/treatment.entity";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../users/entities/user.entity";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("treatments")
export class TreatmentsController {
  constructor(private readonly treatmentsService: TreatmentsService) {}

  @Post("seed")
  async seedTreatments() {
    return await this.treatmentsService.seedBasicTreatments();
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  async findAll(
    @Query("category") category?: TreatmentCategory,
    @Query("search") search?: string,
    @Query("status") status?: string,
    @Query("page") page?: number,
    @Query("limit") limit?: number,
  ) {
    const treatments = await this.treatmentsService.findAll(
      category,
      search,
      status,
    );
    return {
      data: treatments,
      total: treatments.length,
      page: page || 1,
      limit: limit || 50,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get("by-category")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  findByCategory(@Query("category") category: TreatmentCategory) {
    return this.treatmentsService.findByCategory(category);
  }
}
