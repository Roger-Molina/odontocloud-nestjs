import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Allergy } from "../entities/allergy.entity";

@Injectable()
export class AllergiesService {
  constructor(
    @InjectRepository(Allergy)
    private readonly allergyRepository: Repository<Allergy>,
  ) {}

  findAll(): Promise<Allergy[]> {
    return this.allergyRepository.find();
  }

  findOne(id: number): Promise<Allergy | null> {
    return this.allergyRepository.findOneBy({ id });
  }

  async create(data: Partial<Allergy>): Promise<Allergy> {
    const allergy = this.allergyRepository.create(data);
    return this.allergyRepository.save(allergy);
  }

  async update(id: number, data: Partial<Allergy>): Promise<Allergy> {
    await this.allergyRepository.update(id, data);
    return this.findOne(id) as Promise<Allergy>;
  }

  async remove(id: number): Promise<void> {
    await this.allergyRepository.delete(id);
  }

  async search(q: string = "", limit: number = 15): Promise<Allergy[]> {
    if (typeof q === "string" && q.trim() !== "") {
      return this.allergyRepository
        .createQueryBuilder("allergy")
        .where("LOWER(allergy.name) LIKE LOWER(:q)", { q: `%${q}%` })
        .orWhere("LOWER(allergy.description) LIKE LOWER(:q)", { q: `%${q}%` })
        .orderBy("allergy.name", "ASC")
        .limit(limit)
        .getMany();
    } else {
      return this.allergyRepository.find({
        take: limit,
        order: { name: "ASC" },
      });
    }
  }
}
