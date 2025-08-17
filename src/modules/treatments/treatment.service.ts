import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like } from "typeorm";
import { Treatment, TreatmentStatus } from "./entities/treatment.entity";

@Injectable()
export class TreatmentService {
  constructor(
    @InjectRepository(Treatment)
    private treatmentRepository: Repository<Treatment>,
  ) {}

  async findActive(): Promise<Treatment[]> {
    return this.treatmentRepository.find({
      where: { status: TreatmentStatus.AVAILABLE },
      order: { name: "ASC" },
    });
  }

  async search(query: string): Promise<Treatment[]> {
    return this.treatmentRepository.find({
      where: [
        { name: Like(`%${query}%`), status: TreatmentStatus.AVAILABLE },
        { description: Like(`%${query}%`), status: TreatmentStatus.AVAILABLE },
      ],
      order: { name: "ASC" },
      take: 20,
    });
  }

  async findOne(id: number): Promise<Treatment> {
    const treatment = await this.treatmentRepository.findOne({
      where: { id },
    });

    if (!treatment) {
      throw new NotFoundException(`Tratamiento con ID ${id} no encontrado`);
    }

    return treatment;
  }
}
