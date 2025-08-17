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

  async findAll(
    category?: TreatmentCategory,
    search?: string,
    status?: string,
  ) {
    const where: FindOptionsWhere<Treatment> = { 
      status: status === 'available' ? TreatmentStatus.AVAILABLE : TreatmentStatus.AVAILABLE 
    };
    
    if (category) {
      where.category = category;
    }

    const queryBuilder = this.treatmentRepository.createQueryBuilder('treatment');
    queryBuilder.where('treatment.status = :status', { 
      status: status === 'available' ? TreatmentStatus.AVAILABLE : TreatmentStatus.AVAILABLE 
    });

    if (category) {
      queryBuilder.andWhere('treatment.category = :category', { category });
    }

    if (search) {
      queryBuilder.andWhere(
        '(treatment.name ILIKE :search OR treatment.treatmentCode ILIKE :search OR treatment.description ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    queryBuilder.orderBy('treatment.category', 'ASC').addOrderBy('treatment.name', 'ASC');

    return queryBuilder.getMany();
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

  async seedBasicTreatments() {
    const existingTreatments = await this.treatmentRepository.count();
    if (existingTreatments > 0) {
      return { message: "Treatments already exist in database" };
    }

    const basicTreatments = [
      {
        name: "Limpieza Dental",
        treatmentCode: "LIM001",
        description: "Limpieza y profilaxis dental",
        category: TreatmentCategory.PREVENTIVE,
        status: TreatmentStatus.AVAILABLE,
      },
      {
        name: "Obturación Resina",
        treatmentCode: "OBT001",
        description: "Obturación con resina compuesta",
        category: TreatmentCategory.RESTORATIVE,
        status: TreatmentStatus.AVAILABLE,
      },
      {
        name: "Extracción Simple",
        treatmentCode: "EXT001",
        description: "Extracción dental simple",
        category: TreatmentCategory.ORAL_SURGERY,
        status: TreatmentStatus.AVAILABLE,
      },
      {
        name: "Endodoncia",
        treatmentCode: "END001",
        description: "Tratamiento de conducto radicular",
        category: TreatmentCategory.ENDODONTIC,
        status: TreatmentStatus.AVAILABLE,
      },
      {
        name: "Corona Porcelana",
        treatmentCode: "COR001",
        description: "Corona de porcelana",
        category: TreatmentCategory.PROSTHODONTIC,
        status: TreatmentStatus.AVAILABLE,
      },
      {
        name: "Blanqueamiento",
        treatmentCode: "BLA001",
        description: "Blanqueamiento dental",
        category: TreatmentCategory.COSMETIC,
        status: TreatmentStatus.AVAILABLE,
      },
      {
        name: "Ortodoncia",
        treatmentCode: "ORT001",
        description: "Tratamiento ortodóncico",
        category: TreatmentCategory.ORTHODONTIC,
        status: TreatmentStatus.AVAILABLE,
      },
      {
        name: "Implante Dental",
        treatmentCode: "IMP001",
        description: "Colocación de implante dental",
        category: TreatmentCategory.ORAL_SURGERY,
        status: TreatmentStatus.AVAILABLE,
      },
    ];

    const treatments = this.treatmentRepository.create(basicTreatments);
    await this.treatmentRepository.save(treatments);

    return {
      message: "Basic treatments seeded successfully",
      count: treatments.length,
    };
  }
}
