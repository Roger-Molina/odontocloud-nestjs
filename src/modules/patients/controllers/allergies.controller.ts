import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
} from "@nestjs/common";
import { AllergiesService } from "../services/allergies.service";
import { Allergy } from "../entities/allergy.entity";
import { Roles } from "../../auth/decorators/roles.decorator";
import { UserRole } from "../../users/entities/user.entity";

@Controller("allergies")
export class AllergiesController {
  constructor(private readonly allergiesService: AllergiesService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  findAll(): Promise<Allergy[]> {
    return this.allergiesService.findAll();
  }

  @Get("/search")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  async searchAllergies(
    @Query("q") q: string = "",
    @Query("limit") limit: number = 15,
  ): Promise<Allergy[]> {
    // Si no viene parámetro de búsqueda, solo retornar los primeros 'limit' registros
    if (typeof q !== "string" || q.trim() === "" || q === "NaN") {
      return this.allergiesService.search(undefined, limit);
    }
    return this.allergiesService.search(q, limit);
  }

  @Get(":id")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  findOne(@Param("id") id: string): Promise<Allergy | null> {
    return this.allergiesService.findOne(Number(id));
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  create(@Body() data: Partial<Allergy>): Promise<Allergy> {
    return this.allergiesService.create(data);
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  update(
    @Param("id") id: string,
    @Body() data: Partial<Allergy>,
  ): Promise<Allergy> {
    return this.allergiesService.update(Number(id), data);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  remove(@Param("id") id: string): Promise<void> {
    return this.allergiesService.remove(Number(id));
  }
}
