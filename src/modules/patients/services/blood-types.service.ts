import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BloodType } from "../entities/blood-type.entity";

@Injectable()
export class BloodTypesService {
  constructor(
    @InjectRepository(BloodType)
    private readonly bloodTypeRepository: Repository<BloodType>,
  ) {}

  findAll(): Promise<BloodType[]> {
    return this.bloodTypeRepository.find();
  }

  findOne(id: number): Promise<BloodType | null> {
    return this.bloodTypeRepository.findOneBy({ id });
  }

  async create(data: Partial<BloodType>): Promise<BloodType> {
    const bloodType = this.bloodTypeRepository.create(data);
    return this.bloodTypeRepository.save(bloodType);
  }

  async update(id: number, data: Partial<BloodType>): Promise<BloodType> {
    await this.bloodTypeRepository.update(id, data);
    return this.findOne(id) as Promise<BloodType>;
  }

  async remove(id: number): Promise<void> {
    await this.bloodTypeRepository.delete(id);
  }
}
