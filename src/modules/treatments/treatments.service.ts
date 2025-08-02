import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  Treatment,
  TreatmentCategory,
  TreatmentStatus,
} from "./entities/treatment.entity";

@Injectable()
export class TreatmentsService {
  constructor(
    @InjectRepository(Treatment)
    private treatmentRepository: Repository<Treatment>,
  ) {}

  async findAll(clinicId: number, category?: TreatmentCategory) {
    const where: any = { clinicId, status: TreatmentStatus.AVAILABLE };
    if (category) {
      where.category = category;
    }

    return this.treatmentRepository.find({
      where,
      order: { category: "ASC", name: "ASC" },
    });
  }

  async findByCategory(clinicId: number, category: TreatmentCategory) {
    return this.treatmentRepository.find({
      where: { clinicId, category, status: TreatmentStatus.AVAILABLE },
      order: { name: "ASC" },
    });
  }

  async findOne(id: number, clinicId: number) {
    return this.treatmentRepository.findOne({
      where: { id, clinicId },
    });
  }

  async create(createTreatmentDto: Partial<Treatment>, clinicId: number) {
    const treatment = this.treatmentRepository.create({
      ...createTreatmentDto,
      clinicId,
    });
    return this.treatmentRepository.save(treatment);
  }

  async update(
    id: number,
    updateTreatmentDto: Partial<Treatment>,
    clinicId: number,
  ) {
    await this.treatmentRepository.update({ id, clinicId }, updateTreatmentDto);
    return this.findOne(id, clinicId);
  }

  async remove(id: number, clinicId: number) {
    // Soft delete - mark as deprecated instead of removing
    return this.treatmentRepository.update(
      { id, clinicId },
      { status: TreatmentStatus.DEPRECATED },
    );
  }
}
