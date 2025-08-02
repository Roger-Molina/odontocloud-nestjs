import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like } from "typeorm";
import { Specialty } from "./entities/specialty.entity";

@Injectable()
export class SpecialtiesService {
  constructor(
    @InjectRepository(Specialty)
    private readonly specialtyRepository: Repository<Specialty>,
  ) {}

  async create(data: Partial<Specialty>) {
    const specialty = this.specialtyRepository.create(data);
    return this.specialtyRepository.save(specialty);
  }

  async findAll({
    limit = 10,
    page = 1,
    search = "",
  }: {
    limit?: number;
    page?: number;
    search?: string;
  }) {
    const [items, total] = await this.specialtyRepository.findAndCount({
      where: search ? { name: Like(`%${search}%`) } : {},
      take: limit,
      skip: (page - 1) * limit,
      order: { name: "ASC" },
    });
    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    return this.specialtyRepository.findOne({ where: { id } });
  }

  async update(id: number, data: Partial<Specialty>) {
    await this.specialtyRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    return this.specialtyRepository.delete(id);
  }
}
