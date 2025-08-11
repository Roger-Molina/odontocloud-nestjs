import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
  Res,
  HttpStatus,
  UseGuards,
  BadRequestException,
  UnauthorizedException,
  Req,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response, Request } from "express";
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { PatientDocumentsService } from "../services/patient-documents.service";
import { CreatePatientDocumentDto } from "../dto/create-patient-document.dto";
import { UpdatePatientDocumentDto } from "../dto/update-patient-document.dto";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import { UserRole, User } from "../../users/entities/user.entity";
import { Public } from "../../auth/decorators/public.decorator";
import { JwtService } from "@nestjs/jwt";

@ApiTags("Patient Documents")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("patient-documents")
export class PatientDocumentsController {
  constructor(
    private readonly patientDocumentsService: PatientDocumentsService,
    private readonly jwtService: JwtService,
  ) {}

  @Get("patient/:patientId")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: "Obtener documentos de un paciente" })
  @ApiResponse({
    status: 200,
    description: "Lista de documentos del paciente",
  })
  async findByPatient(
    @Param("patientId", ParseIntPipe) patientId: number,
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 15,
    @CurrentUser() user: User,
  ) {
    if (!user.clinicId) {
      throw new UnauthorizedException("Usuario no tiene clínica asignada");
    }

    console.log(
      "[PatientDocumentsController] Finding documents for patient:",
      patientId,
      "in clinic:",
      user.clinicId,
    );
    return this.patientDocumentsService.findByPatient(
      patientId,
      user.clinicId,
      Number(page),
      Number(limit),
    );
  }

  @Get(":id")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: "Obtener un documento específico" })
  @ApiResponse({
    status: 200,
    description: "Documento encontrado",
  })
  async findOne(
    @Param("id", ParseIntPipe) id: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @CurrentUser() user: User,
  ) {
    return this.patientDocumentsService.findOne(id);
  }

  @Get(":id/view")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: "Ver archivo del documento en el navegador" })
  @ApiResponse({
    status: 200,
    description: "Archivo para visualización",
  })
  async viewFile(
    @Param("id", ParseIntPipe) id: number,
    @Res() res: Response,
    @CurrentUser() user: User,
  ) {
    if (!user.clinicId) {
      throw new UnauthorizedException("Usuario no tiene clínica asignada");
    }

    const { buffer, mimeType, originalName } =
      await this.patientDocumentsService.getFileBuffer(id, user.clinicId);

    res.set({
      "Content-Type": mimeType,
      "Content-Disposition": `inline; filename="${originalName}"`,
      "Content-Length": buffer.length,
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    });

    res.send(buffer);
  }

  @Public()
  @Get(":id/view-public")
  @ApiOperation({ summary: "Ver archivo del documento con token en URL" })
  @ApiResponse({
    status: 200,
    description: "Archivo para visualización",
  })
  async viewFilePublic(
    @Param("id", ParseIntPipe) id: number,
    @Query("token") token: string,
    @Res() res: Response,
  ) {
    try {
      if (!token) {
        res.status(401).json({ message: "Token requerido" });
        return;
      }

      // Validar token manualmente
      const decoded = (await this.validateToken(token)) as {
        clinicId?: number;
      };
      if (!decoded || !decoded.clinicId) {
        res.status(401).json({ message: "Token inválido o sin clínica" });
        return;
      }

      const { buffer, mimeType, originalName } =
        await this.patientDocumentsService.getFileBuffer(id, decoded.clinicId);

      // Set CORS headers explicitly
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
      res.header("Access-Control-Allow-Headers", "Content-Type");

      res.set({
        "Content-Type": mimeType,
        "Content-Disposition": `inline; filename="${originalName}"`,
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      });

      res.send(buffer);
    } catch (error) {
      console.error("Error viewing document:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  @Get(":id/download")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: "Descargar archivo del documento" })
  @ApiResponse({
    status: 200,
    description: "Archivo descargado",
  })
  async downloadFile(
    @Param("id", ParseIntPipe) id: number,
    @Res() res: Response,
    @CurrentUser() user: User,
  ) {
    if (!user.clinicId) {
      throw new UnauthorizedException("Usuario no tiene clínica asignada");
    }

    console.log("Usuario:", user);
    const { buffer, mimeType, originalName } =
      await this.patientDocumentsService.getFileBuffer(id, user.clinicId);

    res.set({
      "Content-Type": mimeType,
      "Content-Disposition": `attachment; filename="${originalName}"`,
      "Content-Length": buffer.length,
    });

    res.send(buffer);
  }

  @Post("patient/:patientId/upload")
  @UseInterceptors(
    FileInterceptor("file", {
      limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit
      },
    }),
  )
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: "Subir un nuevo documento" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "Archivo y metadatos del documento",
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
        category: {
          type: "string",
          enum: [
            "medical_history",
            "lab_results",
            "xrays",
            "prescriptions",
            "consent_forms",
            "insurance",
            "identification",
            "other",
          ],
        },
        description: {
          type: "string",
        },
        uploadedBy: {
          type: "string",
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "Documento subido exitosamente",
  })
  async uploadDocument(
    @Param("patientId", ParseIntPipe) patientId: number,
    @UploadedFile() file: any,
    @Req() req: Request,
    @CurrentUser() user: User,
  ) {
    console.log("Usuario:", user);
    console.log("[PatientDocumentsController] Upload request received");
    console.log("PatientId:", patientId);
    console.log("File:", file);
    console.log("Request body:", req.body);

    if (!file) {
      throw new BadRequestException("No se proporcionó ningún archivo");
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const body = req.body;

    const documentDto: CreatePatientDocumentDto = {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      originalName: file.originalname,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      category: body.category || "other",
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      description: body.description,
      uploadedBy:
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        (body.uploadedBy as string) ||
        `${user.firstName} ${user.lastName}`.trim(),
      patientId,
      clinicId: user.clinicId, // Usar la clínica del usuario autenticado
    };

    return this.patientDocumentsService.uploadDocument(
      {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        originalname: file.originalname,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        mimetype: file.mimetype,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        size: file.size,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        buffer: file.buffer,
      },
      documentDto,
      user.clinicId, // Pasar la clínica del usuario al servicio
    );
  }

  @Put(":id")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: "Actualizar metadatos de un documento" })
  @ApiResponse({
    status: 200,
    description: "Documento actualizado exitosamente",
  })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateDocumentDto: UpdatePatientDocumentDto,
    @CurrentUser() user: User,
  ) {
    if (!user.clinicId) {
      throw new UnauthorizedException("Usuario no tiene clínica asignada");
    }

    return this.patientDocumentsService.update(
      id,
      updateDocumentDto,
      user.clinicId,
    );
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: "Eliminar un documento" })
  @ApiResponse({
    status: 200,
    description: "Documento eliminado exitosamente",
  })
  async remove(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    if (!user.clinicId) {
      throw new UnauthorizedException("Usuario no tiene clínica asignada");
    }

    await this.patientDocumentsService.remove(id, user.clinicId);
    return {
      statusCode: HttpStatus.OK,
      message: "Documento eliminado exitosamente",
    };
  }

  private async validateToken(token: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (error) {
      console.error("Error validating token:", error);
      return null;
    }
  }
}
