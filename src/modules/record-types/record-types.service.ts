import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RecordType } from "./entities/record-type.entity";
import { CreateRecordTypeDto } from "./dto/create-record-type.dto";
import { UpdateRecordTypeDto } from "./dto/update-record-type.dto";

@Injectable()
export class RecordTypesService {
  constructor(
    @InjectRepository(RecordType)
    private recordTypeRepository: Repository<RecordType>,
  ) {}

  async findAll(includeInactive = false): Promise<RecordType[]> {
    const where = includeInactive ? {} : { isActive: true };
    return this.recordTypeRepository.find({
      where,
      order: { sortOrder: "ASC", name: "ASC" },
    });
  }

  async findByCategory(category: string): Promise<RecordType[]> {
    return this.recordTypeRepository.find({
      where: { category, isActive: true },
      order: { sortOrder: "ASC", name: "ASC" },
    });
  }

  async findOne(id: number): Promise<RecordType> {
    const recordType = await this.recordTypeRepository.findOne({
      where: { id },
    });

    if (!recordType) {
      throw new NotFoundException("Tipo de registro no encontrado");
    }

    return recordType;
  }

  async findByCode(code: string): Promise<RecordType> {
    const recordType = await this.recordTypeRepository.findOne({
      where: { code },
    });

    if (!recordType) {
      throw new NotFoundException("Tipo de registro no encontrado");
    }

    return recordType;
  }

  async create(createRecordTypeDto: CreateRecordTypeDto): Promise<RecordType> {
    const recordType = this.recordTypeRepository.create(createRecordTypeDto);
    return this.recordTypeRepository.save(recordType);
  }

  async update(
    id: number,
    updateRecordTypeDto: UpdateRecordTypeDto,
  ): Promise<RecordType> {
    const recordType = await this.findOne(id);
    Object.assign(recordType, updateRecordTypeDto);
    return this.recordTypeRepository.save(recordType);
  }

  async remove(id: number): Promise<void> {
    const recordType = await this.findOne(id);
    await this.recordTypeRepository.softRemove(recordType);
  }

  async seedDefaultTypes(): Promise<void> {
    const defaultTypes = [
      {
        code: "CONSULTATION",
        name: "Consulta General",
        category: "general",
        color: "#3498db",
        icon: "pi-user-check",
        sortOrder: 1,
      },
      {
        code: "EMERGENCY",
        name: "Emergencia",
        category: "emergency",
        color: "#e74c3c",
        icon: "pi-exclamation-triangle",
        sortOrder: 2,
      },
      {
        code: "CLEANING",
        name: "Limpieza Dental",
        category: "dental",
        color: "#2ecc71",
        icon: "pi-heart",
        requiresTeeth: true,
        allowsOdontogram: true,
        sortOrder: 10,
      },
      {
        code: "RESTORATION",
        name: "Restauración",
        category: "dental",
        color: "#f39c12",
        icon: "pi-wrench",
        requiresTeeth: true,
        allowsOdontogram: true,
        sortOrder: 11,
      },
      {
        code: "ENDODONTICS",
        name: "Endodoncia",
        category: "dental",
        color: "#9b59b6",
        icon: "pi-cog",
        requiresTeeth: true,
        allowsOdontogram: true,
        sortOrder: 12,
      },
      {
        code: "SURGERY",
        name: "Cirugía Oral",
        category: "dental",
        color: "#e67e22",
        icon: "pi-plus",
        requiresTeeth: true,
        allowsOdontogram: true,
        sortOrder: 13,
      },
      {
        code: "ORTHODONTICS",
        name: "Ortodoncia",
        category: "dental",
        color: "#1abc9c",
        icon: "pi-arrows-h",
        allowsOdontogram: true,
        sortOrder: 14,
      },
      {
        code: "PROSTHETICS",
        name: "Prótesis",
        category: "dental",
        color: "#34495e",
        icon: "pi-clone",
        requiresTeeth: true,
        allowsOdontogram: true,
        sortOrder: 15,
      },
    ];

    for (const typeData of defaultTypes) {
      const existing = await this.recordTypeRepository.findOne({
        where: { code: typeData.code },
      });

      if (!existing) {
        const recordType = this.recordTypeRepository.create(typeData);
        await this.recordTypeRepository.save(recordType);
      }
    }
  }
}
