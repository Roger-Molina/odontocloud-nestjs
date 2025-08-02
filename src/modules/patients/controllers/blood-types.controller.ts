import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from "@nestjs/common";
import { BloodTypesService } from "../services/blood-types.service";
import { BloodType } from "../entities/blood-type.entity";
import { Roles } from "../../auth/decorators/roles.decorator";
import { UserRole } from "../../users/entities/user.entity";

@Controller("blood-types")
export class BloodTypesController {
  constructor(private readonly bloodTypesService: BloodTypesService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  findAll(): Promise<BloodType[]> {
    return this.bloodTypesService.findAll();
  }

  @Get(":id")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  findOne(@Param("id") id: string): Promise<BloodType | null> {
    return this.bloodTypesService.findOne(Number(id));
  }

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() data: Partial<BloodType>): Promise<BloodType> {
    return this.bloodTypesService.create(data);
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN)
  update(
    @Param("id") id: string,
    @Body() data: Partial<BloodType>,
  ): Promise<BloodType> {
    return this.bloodTypesService.update(Number(id), data);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  remove(@Param("id") id: string): Promise<void> {
    return this.bloodTypesService.remove(Number(id));
  }
}
