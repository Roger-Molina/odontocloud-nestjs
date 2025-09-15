import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ClinicTreatmentPrice } from "../entities/clinic-treatment-price.entity";
import { 
  CreateClinicTreatmentPriceDto, 
  UpdateClinicTreatmentPriceDto 
} from "../dto/clinic-treatment-price.dto";

@Injectable()
export class ClinicTreatmentPriceService {
  constructor(
    @InjectRepository(ClinicTreatmentPrice)
    private clinicTreatmentPriceRepository: Repository<ClinicTreatmentPrice>,
  ) {}

  async create(createDto: CreateClinicTreatmentPriceDto): Promise<ClinicTreatmentPrice> {
    const clinicTreatmentPrice = this.clinicTreatmentPriceRepository.create({
      ...createDto,
      effectiveFrom: new Date(createDto.effectiveFrom),
      effectiveUntil: createDto.effectiveUntil ? new Date(createDto.effectiveUntil) : undefined,
      promotionalStartDate: createDto.promotionalStartDate ? new Date(createDto.promotionalStartDate) : undefined,
      promotionalEndDate: createDto.promotionalEndDate ? new Date(createDto.promotionalEndDate) : undefined,
    });

    return this.clinicTreatmentPriceRepository.save(clinicTreatmentPrice);
  }

  async findAll(filter?: any): Promise<ClinicTreatmentPrice[]> {
    const queryBuilder = this.clinicTreatmentPriceRepository
      .createQueryBuilder("ctp")
      .leftJoinAndSelect("ctp.clinic", "clinic")
      .leftJoinAndSelect("ctp.treatment", "treatment");

    if (filter?.clinicId) {
      queryBuilder.andWhere("ctp.clinicId = :clinicId", { clinicId: filter.clinicId });
    }

    if (filter?.treatmentId) {
      queryBuilder.andWhere("ctp.treatmentId = :treatmentId", { treatmentId: filter.treatmentId });
    }

    if (filter?.isActive !== undefined) {
      queryBuilder.andWhere("ctp.isActive = :isActive", { isActive: filter.isActive });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: number): Promise<ClinicTreatmentPrice> {
    const clinicTreatmentPrice = await this.clinicTreatmentPriceRepository.findOne({
      where: { id },
      relations: ["clinic", "treatment"],
    });

    if (!clinicTreatmentPrice) {
      throw new NotFoundException(`Precio de tratamiento con ID ${id} no encontrado`);
    }

    return clinicTreatmentPrice;
  }

  async findByClinicAndTreatment(clinicId: number, treatmentId: number): Promise<ClinicTreatmentPrice> {
    const clinicTreatmentPrice = await this.clinicTreatmentPriceRepository.findOne({
      where: {
        clinicId,
        treatmentId,
        isActive: true,
      },
      relations: ["clinic", "treatment"],
    });

    if (!clinicTreatmentPrice) {
      throw new NotFoundException(
        `No se encontró precio activo para el tratamiento ${treatmentId} en la clínica ${clinicId}`
      );
    }

    return clinicTreatmentPrice;
  }

  async update(id: number, updateDto: UpdateClinicTreatmentPriceDto): Promise<ClinicTreatmentPrice> {
    const clinicTreatmentPrice = await this.findOne(id);
    
    const updateData = {
      ...updateDto,
      effectiveFrom: updateDto.effectiveFrom ? new Date(updateDto.effectiveFrom) : undefined,
      effectiveUntil: updateDto.effectiveUntil ? new Date(updateDto.effectiveUntil) : undefined,
      promotionalStartDate: updateDto.promotionalStartDate ? new Date(updateDto.promotionalStartDate) : undefined,
      promotionalEndDate: updateDto.promotionalEndDate ? new Date(updateDto.promotionalEndDate) : undefined,
    };

    Object.assign(clinicTreatmentPrice, updateData);
    return this.clinicTreatmentPriceRepository.save(clinicTreatmentPrice);
  }

  async remove(id: number): Promise<void> {
    const clinicTreatmentPrice = await this.findOne(id);
    await this.clinicTreatmentPriceRepository.remove(clinicTreatmentPrice);
  }

  async deactivate(id: number): Promise<ClinicTreatmentPrice> {
    return this.update(id, { isActive: false });
  }

  async getEffectivePrice(clinicId: number, treatmentId: number, date?: Date): Promise<number> {
    const effectiveDate = date || new Date();
    const clinicTreatmentPrice = await this.clinicTreatmentPriceRepository.findOne({
      where: {
        clinicId,
        treatmentId,
        isActive: true,
      },
    });

    if (!clinicTreatmentPrice) {
      throw new NotFoundException(
        `No se encontró precio para el tratamiento ${treatmentId} en la clínica ${clinicId}`
      );
    }

    // Verificar si hay precio promocional vigente
    if (
      clinicTreatmentPrice.promotionalPrice &&
      clinicTreatmentPrice.promotionalStartDate &&
      clinicTreatmentPrice.promotionalEndDate &&
      effectiveDate >= clinicTreatmentPrice.promotionalStartDate &&
      effectiveDate <= clinicTreatmentPrice.promotionalEndDate
    ) {
      return clinicTreatmentPrice.promotionalPrice;
    }

    return clinicTreatmentPrice.basePrice;
  }
}
