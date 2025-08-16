import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
  UseGuards,
  BadRequestException,
  UnauthorizedException,
  Res,
  HttpStatus,
  Query,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiQuery,
} from "@nestjs/swagger";
import { Response } from "express";
import { JwtService } from "@nestjs/jwt";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import { UserRole } from "../../users/entities/user.entity";
import { User } from "../../users/entities/user.entity";
import { PatientProfilePhotoService } from "../services/patient-profile-photo.service";

@ApiTags("Patient Profile Photos")
@Controller("patients/:patientId/profile-photo")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PatientProfilePhotoController {
  constructor(
    private readonly profilePhotoService: PatientProfilePhotoService,
    private readonly jwtService: JwtService,
  ) {}

  @Post("upload")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  @UseInterceptors(FileInterceptor("photo"))
  @ApiOperation({ summary: "Subir foto de perfil del paciente" })
  @ApiConsumes("multipart/form-data")
  @ApiResponse({
    status: 201,
    description: "Foto de perfil subida exitosamente",
  })
  @ApiResponse({
    status: 400,
    description: "Archivo inválido o faltante",
  })
  async uploadProfilePhoto(
    @Param("patientId", ParseIntPipe) patientId: number,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User,
  ) {
    if (!user.clinicId) {
      throw new UnauthorizedException("Usuario no tiene clínica asignada");
    }

    if (!file) {
      throw new BadRequestException("No se proporcionó ningún archivo");
    }

    // Validar que sea una imagen
    if (!file.mimetype.startsWith("image/")) {
      throw new BadRequestException("El archivo debe ser una imagen");
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException("El archivo es demasiado grande. Máximo 5MB");
    }

    return await this.profilePhotoService.uploadProfilePhoto(
      patientId,
      user.clinicId,
      file,
    );
  }

  @Get("view-public")
  @ApiOperation({ 
    summary: "Ver foto de perfil del paciente con token en URL" 
  })
  @ApiQuery({ 
    name: "token", 
    required: true, 
    description: "JWT token para autenticación" 
  })
  @ApiResponse({
    status: 200,
    description: "Foto de perfil del paciente",
  })
  async viewProfilePhotoPublic(
    @Param("patientId", ParseIntPipe) patientId: number,
    @Query("token") token: string,
    @Res() res: Response,
  ) {
    if (!token) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: "Token requerido",
      });
    }

    try {
      // Verificar el token JWT
      const decoded = this.jwtService.verify(token);
      const user = decoded as any;

      if (!user.clinicId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: "Usuario no tiene clínica asignada",
        });
      }

      const { buffer, mimeType } =
        await this.profilePhotoService.getProfilePhoto(
          patientId,
          user.clinicId,
        );

      res.set({
        "Content-Type": mimeType,
        "Content-Disposition": "inline",
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      });

      return res.status(HttpStatus.OK).send(buffer);
    } catch (error) {
      // Si es error de JWT
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: "Token inválido",
        });
      }
      
      // Si es cualquier otro error
      return res.status(HttpStatus.NOT_FOUND).json({
        message: "Foto de perfil no encontrada",
      });
    }
  }

  @Get("view")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: "Ver foto de perfil del paciente" })
  @ApiResponse({
    status: 200,
    description: "Foto de perfil del paciente",
  })
  async viewProfilePhoto(
    @Param("patientId", ParseIntPipe) patientId: number,
    @Res() res: Response,
    @CurrentUser() user: User,
  ) {
    if (!user.clinicId) {
      throw new UnauthorizedException("Usuario no tiene clínica asignada");
    }

    try {
      const { buffer, mimeType } =
        await this.profilePhotoService.getProfilePhoto(
          patientId,
          user.clinicId,
        );

      res.set({
        "Content-Type": mimeType,
        "Content-Disposition": "inline",
        "Cache-Control": "public, max-age=3600",
      });

      res.status(HttpStatus.OK).send(buffer);
    } catch {
      res.status(HttpStatus.NOT_FOUND).json({
        message: "Foto de perfil no encontrada",
      });
    }
  }

  @Delete()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: "Eliminar foto de perfil del paciente" })
  @ApiResponse({
    status: 200,
    description: "Foto de perfil eliminada exitosamente",
  })
  async deleteProfilePhoto(
    @Param("patientId", ParseIntPipe) patientId: number,
    @CurrentUser() user: User,
  ) {
    if (!user.clinicId) {
      throw new UnauthorizedException("Usuario no tiene clínica asignada");
    }

    await this.profilePhotoService.deleteProfilePhoto(patientId, user.clinicId);
    
    return {
      message: "Foto de perfil eliminada exitosamente",
    };
  }

  @Get("check")
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: "Verificar si el paciente tiene foto de perfil" })
  @ApiResponse({
    status: 200,
    description: "Estado de la foto de perfil",
  })
  async checkProfilePhoto(
    @Param("patientId", ParseIntPipe) patientId: number,
    @CurrentUser() user: User,
  ): Promise<{ hasPhoto: boolean }> {
    if (!user.clinicId) {
      throw new UnauthorizedException("Usuario no tiene clínica asignada");
    }

    const hasPhoto = await this.profilePhotoService.hasProfilePhoto(
      patientId,
      user.clinicId,
    );
    
    return { hasPhoto };
  }
}
