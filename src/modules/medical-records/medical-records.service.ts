import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like, In } from "typeorm";
import { MedicalRecord } from "./entities/medical-record.entity";
import { Doctor } from "../doctors/entities/doctor.entity";
import { Treatment } from "../treatments/entities/treatment.entity";
import { Diagnosis } from "../diagnoses/entities/diagnosis.entity";

@Injectable()
export class MedicalRecordsService {
  constructor(
    @InjectRepository(MedicalRecord)
    private medicalRecordRepository: Repository<MedicalRecord>,
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    @InjectRepository(Treatment)
    private treatmentRepository: Repository<Treatment>,
    @InjectRepository(Diagnosis)
    private diagnosisRepository: Repository<Diagnosis>,
  ) {}

  async findAll(
    clinicId: number,
    options: {
      limit?: number;
      offset?: number;
      patientId?: number;
      doctorId?: number;
      type?: string;
      search?: string;
      startDate?: Date;
      endDate?: Date;
    } = {},
  ) {
    const where: any = {
      clinicId,
    };

    if (options.patientId) where.patientId = options.patientId;
    if (options.doctorId) where.doctorId = options.doctorId;
    if (options.type) where.type = options.type;

    if (options.search) {
      where.description = Like(`%${options.search}%`);
    }

    if (options.startDate && options.endDate) {
      where.createdAt = { $gte: options.startDate, $lte: options.endDate };
    }

    return this.medicalRecordRepository.find({
      where,
      take: options.limit || 50,
      skip: options.offset || 0,
      order: { createdAt: "DESC" },
      relations: [
        "patient",
        "doctor",
        "appointment",
        "treatments",
        "diagnoses",
      ],
    });
  }

  async findByPatient(
    patientId: number,
    clinicId: number,
    options: {
      limit?: number;
      offset?: number;
      type?: string;
      search?: string;
      toothNumber?: string;
    } = {},
  ) {
    const where: any = {
      patientId,
      clinicId,
    };

    if (options.type) where.type = options.type;
    if (options.toothNumber)
      where.toothNumbers = Like(`%${options.toothNumber}%`);
    if (options.search) {
      where.description = Like(`%${options.search}%`);
    }

    return this.medicalRecordRepository.find({
      where,
      take: options.limit || 50,
      skip: options.offset || 0,
      order: { createdAt: "DESC" },
      relations: ["doctor", "appointment", "treatments", "diagnoses"],
    });
  }

  async findDoctorByUserId(
    userId: number,
    clinicId: number,
  ): Promise<Doctor | null> {
    return this.doctorRepository.findOne({
      where: { userId, clinicId },
    });
  }

  async create(
    createData: Partial<MedicalRecord> & { treatmentIds?: number[]; diagnosisIds?: number[] },
    clinicId: number,
    createdBy: number,
  ) {
    // Extraer IDs de tratamientos y diagnósticos
    const { treatmentIds, diagnosisIds, ...recordData } = createData;
    
    // Crear el registro base
    const record = this.medicalRecordRepository.create({
      ...recordData,
      clinicId,
      createdBy,
    });

    // Guardar el registro primero
    const savedRecord = await this.medicalRecordRepository.save(record);

    // Agregar relaciones many-to-many si hay IDs
    if (treatmentIds && treatmentIds.length > 0) {
      const treatments = await this.treatmentRepository.find({
        where: { id: In(treatmentIds) },
      });
      savedRecord.treatments = treatments;
    }

    if (diagnosisIds && diagnosisIds.length > 0) {
      const diagnoses = await this.diagnosisRepository.find({
        where: { id: In(diagnosisIds) },
      });
      savedRecord.diagnoses = diagnoses;
    }

    // Guardar nuevamente con las relaciones
    if (treatmentIds?.length || diagnosisIds?.length) {
      await this.medicalRecordRepository.save(savedRecord);
    }

    // Recargar con todas las relaciones para devolver
    return this.findOne(savedRecord.id, clinicId);
  }

  async findOne(id: number, clinicId: number) {
    const record = await this.medicalRecordRepository.findOne({
      where: { id, clinicId },
      relations: [
        "patient",
        "doctor",
        "appointment",
        "treatments",
        "diagnoses",
      ],
    });

    if (!record) {
      throw new NotFoundException("Registro médico no encontrado o sin acceso");
    }

    return record;
  }

  async update(
    id: number,
    updateData: Partial<MedicalRecord> & { treatmentIds?: number[]; diagnosisIds?: number[] },
    clinicId: number,
  ) {
    const record = await this.findOne(id, clinicId);
    
    // Extraer IDs de tratamientos y diagnósticos
    const { treatmentIds, diagnosisIds, ...recordData } = updateData;
    
    // Actualizar campos básicos
    Object.assign(record, recordData);
    
    // Actualizar relaciones many-to-many si hay IDs
    if (treatmentIds !== undefined) {
      if (treatmentIds.length > 0) {
        const treatments = await this.treatmentRepository.find({
          where: { id: In(treatmentIds) },
        });
        record.treatments = treatments;
      } else {
        record.treatments = [];
      }
    }

    if (diagnosisIds !== undefined) {
      if (diagnosisIds.length > 0) {
        const diagnoses = await this.diagnosisRepository.find({
          where: { id: In(diagnosisIds) },
        });
        record.diagnoses = diagnoses;
      } else {
        record.diagnoses = [];
      }
    }

    // Guardar con las relaciones actualizadas
    await this.medicalRecordRepository.save(record);
    
    // Recargar con todas las relaciones para devolver
    return this.findOne(id, clinicId);
  }

  async remove(id: number, clinicId: number) {
    const record = await this.findOne(id, clinicId);
    return this.medicalRecordRepository.softRemove(record);
  }

  async getToothHistory(
    clinicId: number,
    toothNumber: string,
    options: { patientId?: number; limit?: number } = {},
  ) {
    const where: any = {
      clinicId,
      toothNumbers: Like(`%${toothNumber}%`),
    };

    if (options.patientId) where.patientId = options.patientId;

    return this.medicalRecordRepository.find({
      where,
      take: options.limit || 20,
      order: { createdAt: "DESC" },
      relations: ["patient", "doctor"],
    });
  }

  async getOdontogramData(patientId: number, clinicId: number) {
    const records = await this.medicalRecordRepository
      .createQueryBuilder("record")
      .where("record.patientId = :patientId", { patientId })
      .andWhere("record.clinicId = :clinicId", { clinicId })
      .andWhere("record.odontogramData IS NOT NULL")
      .orderBy("record.createdAt", "DESC")
      .getMany();

    // Consolidar datos del odontograma
    const odontogramMap = new Map();

    records.forEach((record) => {
      if (record.odontogramData && Array.isArray(record.odontogramData)) {
        record.odontogramData.forEach((toothData: any) => {
          const existing = odontogramMap.get(toothData.toothNumber) || {
            toothNumber: toothData.toothNumber,
            procedures: [],
            conditions: [],
          };

          if (toothData.procedures) {
            existing.procedures.push(...toothData.procedures);
          }
          if (toothData.conditions) {
            existing.conditions.push(...toothData.conditions);
          }

          odontogramMap.set(toothData.toothNumber, existing);
        });
      }
    });

    return Array.from(odontogramMap.values());
  }

  async getStats(clinicId: number, period: "day" | "week" | "month" | "year") {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case "day":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const totalRecords = await this.medicalRecordRepository.count({
      where: {
        clinicId,
        createdAt: { $gte: startDate } as any,
      },
    });

    const typeStats = await this.medicalRecordRepository
      .createQueryBuilder("record")
      .select("record.type", "type")
      .addSelect("COUNT(*)", "count")
      .where("record.clinicId = :clinicId", { clinicId })
      .andWhere("record.createdAt >= :startDate", { startDate })
      .groupBy("record.type")
      .getRawMany();

    return {
      totalRecords,
      typeStats,
      period,
      startDate,
      endDate: now,
    };
  }
}
