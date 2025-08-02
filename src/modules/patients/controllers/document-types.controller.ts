import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from "@nestjs/common";
import { DocumentTypesService } from "../services/document-types.service";
import { DocumentType } from "../entities/document-type.entity";
import { Roles } from "../../auth/decorators/roles.decorator";
import { UserRole } from "../../users/entities/user.entity";

@Controller("document-types")
export class DocumentTypesController {
  constructor(private readonly documentTypesService: DocumentTypesService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  findAll(): Promise<DocumentType[]> {
    return this.documentTypesService.findAll();
  }

  @Get(":id")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  findOne(@Param("id") id: string): Promise<DocumentType | null> {
    return this.documentTypesService.findOne(Number(id));
  }

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() data: Partial<DocumentType>): Promise<DocumentType> {
    return this.documentTypesService.create(data);
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN)
  update(
    @Param("id") id: string,
    @Body() data: Partial<DocumentType>,
  ): Promise<DocumentType> {
    return this.documentTypesService.update(Number(id), data);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  remove(@Param("id") id: string): Promise<void> {
    return this.documentTypesService.remove(Number(id));
  }
}
