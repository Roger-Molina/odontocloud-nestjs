import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like } from "typeorm";
import { MedicalRecord } from "./entities/medical-record.entity";

@Injectable()
export class MedicalRecordsService {
  constructor(
    @InjectRepository(MedicalRecord)
    private medicalRecordRepository: Repository<MedicalRecord>,
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
      relations: ["patient", "doctor", "appointment"],
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
      relations: ["doctor", "appointment"],
    });
  }

  async create(
    createData: Partial<MedicalRecord>,
    clinicId: number,
    createdBy: number,
  ) {
    const record = this.medicalRecordRepository.create({
      ...createData,
      clinicId,
      createdBy,
    });

    return this.medicalRecordRepository.save(record);
  }

  async findOne(id: number, clinicId: number) {
    const record = await this.medicalRecordRepository.findOne({
      where: { id, clinicId },
      relations: ["patient", "doctor", "appointment"],
    });

    if (!record) {
      throw new NotFoundException("Registro médico no encontrado o sin acceso");
    }

    return record;
  }

  async update(
    id: number,
    updateData: Partial<MedicalRecord>,
    clinicId: number,
  ) {
    const record = await this.findOne(id, clinicId);
    Object.assign(record, updateData);
    return this.medicalRecordRepository.save(record);
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
