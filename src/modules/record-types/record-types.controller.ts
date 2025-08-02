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
import { RecordTypesService } from "./record-types.service";
import { CreateRecordTypeDto } from "./dto/create-record-type.dto";
import { UpdateRecordTypeDto } from "./dto/update-record-type.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../users/entities/user.entity";

@Controller("record-types")
@UseGuards(JwtAuthGuard, RolesGuard)
export class RecordTypesController {
  constructor(private readonly recordTypesService: RecordTypesService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createRecordTypeDto: CreateRecordTypeDto) {
    return this.recordTypesService.create(createRecordTypeDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  findAll(@Query("includeInactive") includeInactive?: boolean) {
    return this.recordTypesService.findAll(includeInactive);
  }

  @Get("category/:category")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  findByCategory(@Param("category") category: string) {
    return this.recordTypesService.findByCategory(category);
  }

  @Get("code/:code")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  findByCode(@Param("code") code: string) {
    return this.recordTypesService.findByCode(code);
  }

  @Get(":id")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.recordTypesService.findOne(id);
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN)
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateRecordTypeDto: UpdateRecordTypeDto,
  ) {
    return this.recordTypesService.update(id, updateRecordTypeDto);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.recordTypesService.remove(id);
  }

  @Post("seed")
  @Roles(UserRole.ADMIN)
  seedDefaultTypes() {
    return this.recordTypesService.seedDefaultTypes();
  }
}
