import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindOptionsWhere } from "typeorm";
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

  async findAll(category?: TreatmentCategory) {
    const where: FindOptionsWhere<Treatment> = { status: TreatmentStatus.AVAILABLE };
    if (category) {
      where.category = category;
    }

    return this.treatmentRepository.find({
      where,
      order: { category: "ASC", name: "ASC" },
    });
  }

  async findByCategory(category: TreatmentCategory) {
    return this.treatmentRepository.find({
      where: { category, status: TreatmentStatus.AVAILABLE },
      order: { name: "ASC" },
    });
  }

  async findOne(id: number) {
    return this.treatmentRepository.findOne({
      where: { id },
    });
  }

  async create(createTreatmentDto: Partial<Treatment>) {
    const treatment = this.treatmentRepository.create(createTreatmentDto);
    return this.treatmentRepository.save(treatment);
  }

  async update(id: number, updateTreatmentDto: Partial<Treatment>) {
    await this.treatmentRepository.update({ id }, updateTreatmentDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    // Soft delete - mark as deprecated instead of removing
    return this.treatmentRepository.update(
      { id },
      { status: TreatmentStatus.DEPRECATED },
    );
  }
}
