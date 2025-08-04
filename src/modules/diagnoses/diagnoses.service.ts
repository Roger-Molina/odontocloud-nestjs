import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindOptionsWhere } from "typeorm";
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

  async findAll(category?: DiagnosisCategory) {
    const where: FindOptionsWhere<Diagnosis> = { status: DiagnosisStatus.ACTIVE };
    if (category) {
      where.category = category;
    }

    return this.diagnosisRepository.find({
      where,
      order: { category: "ASC", name: "ASC" },
    });
  }

  async findByCategory(category: DiagnosisCategory) {
    return this.diagnosisRepository.find({
      where: { category, status: DiagnosisStatus.ACTIVE },
      order: { name: "ASC" },
    });
  }

  async findBySeverity(severity: DiagnosisSeverity) {
    return this.diagnosisRepository.find({
      where: { severity, status: DiagnosisStatus.ACTIVE },
      order: { name: "ASC" },
    });
  }

  async findOne(id: number) {
    return this.diagnosisRepository.findOne({
      where: { id },
    });
  }

  async create(createDiagnosisDto: Partial<Diagnosis>) {
    const diagnosis = this.diagnosisRepository.create(createDiagnosisDto);
    return this.diagnosisRepository.save(diagnosis);
  }

  async update(id: number, updateDiagnosisDto: Partial<Diagnosis>) {
    await this.diagnosisRepository.update({ id }, updateDiagnosisDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    // Soft delete - mark as inactive instead of removing
    return this.diagnosisRepository.update(
      { id },
      { status: DiagnosisStatus.INACTIVE },
    );
  }
}
