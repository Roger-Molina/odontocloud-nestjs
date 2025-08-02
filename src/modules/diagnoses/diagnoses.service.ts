import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  Diagnosis,
  DiagnosisCategory,
  DiagnosisSeverity,
  DiagnosisStatus,
} from "./entities/diagnosis.entity";

@Injectable()
export class DiagnosesService {
  constructor(
    @InjectRepository(Diagnosis)
    private diagnosisRepository: Repository<Diagnosis>,
  ) {}

  async findAll(clinicId: number, category?: DiagnosisCategory) {
    const where: any = { clinicId, status: DiagnosisStatus.ACTIVE };
    if (category) {
      where.category = category;
    }

    return this.diagnosisRepository.find({
      where,
      order: { category: "ASC", name: "ASC" },
    });
  }

  async findByCategory(clinicId: number, category: DiagnosisCategory) {
    return this.diagnosisRepository.find({
      where: { clinicId, category, status: DiagnosisStatus.ACTIVE },
      order: { name: "ASC" },
    });
  }

  async findBySeverity(clinicId: number, severity: DiagnosisSeverity) {
    return this.diagnosisRepository.find({
      where: { clinicId, severity, status: DiagnosisStatus.ACTIVE },
      order: { name: "ASC" },
    });
  }

  async findOne(id: number, clinicId: number) {
    return this.diagnosisRepository.findOne({
      where: { id, clinicId },
    });
  }

  async create(createDiagnosisDto: Partial<Diagnosis>, clinicId: number) {
    const diagnosis = this.diagnosisRepository.create({
      ...createDiagnosisDto,
      clinicId,
    });
    return this.diagnosisRepository.save(diagnosis);
  }

  async update(
    id: number,
    updateDiagnosisDto: Partial<Diagnosis>,
    clinicId: number,
  ) {
    await this.diagnosisRepository.update({ id, clinicId }, updateDiagnosisDto);
    return this.findOne(id, clinicId);
  }

  async remove(id: number, clinicId: number) {
    // Soft delete - mark as inactive instead of removing
    return this.diagnosisRepository.update(
      { id, clinicId },
      { status: DiagnosisStatus.INACTIVE },
    );
  }
}
