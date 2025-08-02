import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DocumentType } from "../entities/document-type.entity";

@Injectable()
export class DocumentTypesService {
  constructor(
    @InjectRepository(DocumentType)
    private readonly documentTypeRepository: Repository<DocumentType>,
  ) {}

  findAll(): Promise<DocumentType[]> {
    return this.documentTypeRepository.find();
  }

  findOne(id: number): Promise<DocumentType | null> {
    return this.documentTypeRepository.findOneBy({ id });
  }

  async create(data: Partial<DocumentType>): Promise<DocumentType> {
    const docType = this.documentTypeRepository.create(data);
    return this.documentTypeRepository.save(docType);
  }

  async update(id: number, data: Partial<DocumentType>): Promise<DocumentType> {
    await this.documentTypeRepository.update(id, data);
    return this.findOne(id) as Promise<DocumentType>;
  }

  async remove(id: number): Promise<void> {
    await this.documentTypeRepository.delete(id);
  }
}
