import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PatientDocument } from "../entities/patient-document.entity";
import { CreatePatientDocumentDto } from "../dto/create-patient-document.dto";
import { UpdatePatientDocumentDto } from "../dto/update-patient-document.dto";
import * as fs from "fs/promises";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";

interface UploadedFile {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Injectable()
export class PatientDocumentsService {
  private readonly uploadsPath = "uploads";

  constructor(
    @InjectRepository(PatientDocument)
    private readonly patientDocumentRepository: Repository<PatientDocument>,
  ) {}

  /**
   * Obtener todos los documentos de un paciente con paginación
   */
  async findByPatient(
    patientId: number,
    clinicId: number,
    page: number = 1,
    limit: number = 15,
  ): Promise<{
    documents: PatientDocument[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const [documents, total] =
      await this.patientDocumentRepository.findAndCount({
        where: { patientId, clinicId },
        order: { createdAt: "DESC" },
        skip: (page - 1) * limit,
        take: limit,
      });

    return {
      documents,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Obtener un documento por ID
   */
  async findOne(id: number): Promise<PatientDocument> {
    const document = await this.patientDocumentRepository.findOne({
      where: { id },
      relations: ["patient"],
    });

    if (!document) {
      throw new NotFoundException("Documento no encontrado");
    }

    return document;
  }

  /**
   * Obtener un documento por ID y clínica (para verificar permisos)
   */
  async findOneByClinic(
    id: number,
    clinicId: number,
  ): Promise<PatientDocument> {
    const document = await this.patientDocumentRepository.findOne({
      where: { id, clinicId },
      relations: ["patient"],
    });

    if (!document) {
      throw new NotFoundException(`Documento con ID ${id} no encontrado`);
    }

    return document;
  }

  /**
   * Subir un nuevo documento
   */
  async uploadDocument(
    file: UploadedFile,
    createDocumentDto: CreatePatientDocumentDto,
    clinicId?: number,
  ): Promise<PatientDocument> {
    try {
      // Generar nombre único para el archivo
      const fileExtension = path.extname(file.originalname);
      const fileName = `${uuidv4()}${fileExtension}`;
      
      // Crear estructura de carpetas: uploads/clinica_{clinicId}/paciente_{patientId}/documentos/
      const clinicFolder = clinicId ? `clinica_${clinicId}` : "sin_clinica";
      const patientFolder = `paciente_${createDocumentDto.patientId}`;
      const documentsFolder = "documentos";
      
      const folderPath = path.join(
        this.uploadsPath,
        clinicFolder,
        patientFolder,
        documentsFolder,
      );
      
      const filePath = path.join(folderPath, fileName);
      
      // Crear las carpetas si no existen
      await fs.mkdir(folderPath, { recursive: true });
      
      // Guardar el archivo
      await fs.writeFile(filePath, file.buffer);
      
      // Crear registro en base de datos
      const document = this.patientDocumentRepository.create({
        ...createDocumentDto,
        fileName,
        filePath,
        mimeType: file.mimetype,
        fileSize: file.size,
        clinicId: createDocumentDto.clinicId,
      });

      return await this.patientDocumentRepository.save(document);
    } catch (error) {
      console.error("Error uploading document:", error);
      throw new InternalServerErrorException("Error al subir el documento");
    }
  }

  /**
   * Actualizar metadatos de un documento
   */
  async update(
    id: number,
    updateDocumentDto: UpdatePatientDocumentDto,
    clinicId: number,
  ): Promise<PatientDocument> {
    const document = await this.findOneByClinic(id, clinicId);
    
    // Actualizar solo los metadatos (no el archivo físico)
    Object.assign(document, updateDocumentDto);
    
    return await this.patientDocumentRepository.save(document);
  }

  /**
   * Eliminar un documento
   */
  async remove(id: number, clinicId: number): Promise<void> {
    const document = await this.findOneByClinic(id, clinicId);
    
    try {
      // Eliminar archivo físico
      await fs.unlink(document.filePath);
    } catch (error) {
      console.warn(
        `No se pudo eliminar el archivo físico: ${document.filePath}`,
        error,
      );
    }
    
    // Eliminar registro de base de datos
    await this.patientDocumentRepository.remove(document);
  }

  /**
   * Obtener el archivo físico
   */
  async getFileBuffer(
    id: number,
    clinicId: number,
  ): Promise<{
    buffer: Buffer;
    mimeType: string;
    originalName: string;
  }> {
    const document = await this.findOneByClinic(id, clinicId);
    
    try {
      const buffer = await fs.readFile(document.filePath);
      return {
        buffer,
        mimeType: document.mimeType,
        originalName: document.originalName,
      };
    } catch (error) {
      console.error("Error reading file:", error);
      throw new NotFoundException(
        "Archivo no encontrado en el sistema de archivos",
      );
    }
  }

  /**
   * Verificar si el archivo existe físicamente
   */
  async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}
