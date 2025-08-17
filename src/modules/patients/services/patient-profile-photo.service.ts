import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { promises as fs } from "fs";
import { join } from "path";
import { Patient } from "../entities/patient.entity";

@Injectable()
export class PatientProfilePhotoService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}

  /**
   * Subir foto de perfil del paciente
   */
  async uploadProfilePhoto(
    patientId: number,
    clinicId: number,
    file: Express.Multer.File,
  ): Promise<{ message: string; photoPath: string }> {
    try {
      // Verificar que el paciente existe y pertenece a la clínica
      const patient = await this.patientRepository.findOne({
        where: { id: patientId, clinicId },
      });

      if (!patient) {
        throw new NotFoundException("Paciente no encontrado en esta clínica");
      }

      // Crear directorio si no existe
      const uploadDir = join(
        process.cwd(),
        "uploads",
        `clinica_${clinicId}`,
        `paciente_${patientId}`,
        "fotos",
      );

      await fs.mkdir(uploadDir, { recursive: true });

      // Eliminar foto anterior si existe
      if (patient.profilePhotoPath) {
        try {
          await fs.unlink(patient.profilePhotoPath);
        } catch {
          console.warn(
            `No se pudo eliminar la foto anterior: ${patient.profilePhotoPath}`,
          );
        }
      }

      // Generar nombre único para la foto
      const timestamp = Date.now();
      const extension = file.originalname.split(".").pop();
      const fileName = `perfil_${timestamp}.${extension}`;
      const filePath = join(uploadDir, fileName);

      // Guardar el archivo
      await fs.writeFile(filePath, file.buffer);

      // Actualizar el paciente con la ruta de la foto
      patient.profilePhotoPath = filePath;
      await this.patientRepository.save(patient);

      return {
        message: "Foto de perfil subida exitosamente",
        photoPath: filePath,
      };
    } catch (error) {
      console.error("Error uploading profile photo:", error);
      throw new InternalServerErrorException(
        "Error al subir la foto de perfil",
      );
    }
  }

  /**
   * Obtener foto de perfil del paciente
   */
  async getProfilePhoto(
    patientId: number,
    clinicId: number,
  ): Promise<{ buffer: Buffer; mimeType: string }> {
    const patient = await this.patientRepository.findOne({
      where: { id: patientId, clinicId },
    });

    if (!patient || !patient.profilePhotoPath) {
      throw new NotFoundException("Foto de perfil no encontrada");
    }

    try {
      // Primero verificar si el archivo existe
      await fs.access(patient.profilePhotoPath);
      
      const buffer = await fs.readFile(patient.profilePhotoPath);
      
      // Determinar el tipo MIME basado en la extensión
      const extension = patient.profilePhotoPath
        .split(".")
        .pop()
        ?.toLowerCase();
      let mimeType = "image/jpeg"; // default
      
      switch (extension) {
        case "png":
          mimeType = "image/png";
          break;
        case "gif":
          mimeType = "image/gif";
          break;
        case "webp":
          mimeType = "image/webp";
          break;
        case "jpg":
        case "jpeg":
        default:
          mimeType = "image/jpeg";
          break;
      }

      return { buffer, mimeType };
    } catch (error: any) {
      // Si el archivo no existe, limpiar la referencia en la base de datos
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        await this.patientRepository.update(
          { id: patientId, clinicId },
          { profilePhotoPath: undefined },
        );
        throw new NotFoundException(
          "Foto de perfil no encontrada - referencia limpiada",
        );
      }
      
      // Para otros errores, sí logueamos
      console.error("Error reading profile photo:", error);
      throw new NotFoundException("Error al leer archivo de foto de perfil");
    }
  }

  /**
   * Eliminar foto de perfil del paciente
   */
  async deleteProfilePhoto(patientId: number, clinicId: number): Promise<void> {
    const patient = await this.patientRepository.findOne({
      where: { id: patientId, clinicId },
    });

    if (!patient) {
      throw new NotFoundException("Paciente no encontrado en esta clínica");
    }

    if (!patient.profilePhotoPath) {
      throw new NotFoundException("El paciente no tiene foto de perfil");
    }

    try {
      // Eliminar archivo físico
      await fs.unlink(patient.profilePhotoPath);
    } catch (error) {
      console.warn(
        `No se pudo eliminar el archivo físico: ${patient.profilePhotoPath}`,
        error,
      );
    }

    // Actualizar el paciente para remover la referencia a la foto
    patient.profilePhotoPath = undefined;
    await this.patientRepository.save(patient);
  }

  /**
   * Verificar si el paciente tiene foto de perfil
   */
  async hasProfilePhoto(patientId: number, clinicId: number): Promise<boolean> {
    const patient = await this.patientRepository.findOne({
      where: { id: patientId, clinicId },
      select: ["id", "profilePhotoPath"],
    });

    return !!patient?.profilePhotoPath;
  }
}
