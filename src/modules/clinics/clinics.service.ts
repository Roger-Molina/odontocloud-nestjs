import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Clinic, ClinicStatus } from "./entities/clinic.entity";
import { CreateClinicDto } from "./dto/create-clinic.dto";
import { UpdateClinicDto } from "./dto/update-clinic.dto";

@Injectable()
export class ClinicsService {
  constructor(
    @InjectRepository(Clinic)
    private clinicsRepository: Repository<Clinic>,
  ) {}

  async create(createClinicDto: CreateClinicDto): Promise<Clinic> {
    try {
      const clinic = this.clinicsRepository.create(createClinicDto);
      return await this.clinicsRepository.save(clinic);
    } catch (error) {
      if (error.code === "23505") {
        // Unique constraint violation
        throw new ConflictException(
          "El código de clínica, licencia o ID tributario ya existe",
        );
      }
      throw error;
    }
  }

  async findAll(): Promise<Clinic[]> {
    return await this.clinicsRepository.find({
      order: { createdAt: "DESC" },
    });
  }

  async findOne(id: number): Promise<Clinic> {
    const clinic = await this.clinicsRepository.findOne({
      where: { id },
    });

    if (!clinic) {
      throw new NotFoundException(`Clínica con ID ${id} no encontrada`);
    }

    return clinic;
  }

  // findByCode eliminado porque clinicCode ya no existe

  async update(id: number, updateClinicDto: UpdateClinicDto): Promise<Clinic> {
    const clinic = await this.findOne(id);

    try {
      Object.assign(clinic, updateClinicDto);
      return await this.clinicsRepository.save(clinic);
    } catch (error) {
      if (error.code === "23505") {
        throw new ConflictException(
          "El código de clínica, licencia o ID tributario ya existe",
        );
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    const clinic = await this.findOne(id);
    await this.clinicsRepository.softRemove(clinic);
  }

  async findActive(): Promise<Clinic[]> {
    return await this.clinicsRepository.find({
      where: { status: ClinicStatus.ACTIVE },
      order: { name: "ASC" },
    });
  }
}
