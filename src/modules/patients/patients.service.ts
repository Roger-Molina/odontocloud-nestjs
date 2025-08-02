import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Patient } from "./entities/patient.entity";
import { PatientClinic } from "./entities/patient-clinic.entity";
import { Allergy } from "./entities/allergy.entity";
import { CreatePatientDto } from "./dto/create-patient.dto";
import { UpdatePatientDto } from "./dto/update-patient.dto";

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(PatientClinic)
    private readonly patientClinicRepository: Repository<PatientClinic>,
    @InjectRepository(Allergy)
    private readonly allergyRepository: Repository<Allergy>,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    // Check if patient already exists in the same clinic
    const existingPatient = await this.patientRepository.findOne({
      where: {
        documentNumber: createPatientDto.documentNumber,
        clinicId: createPatientDto.clinicId,
      },
    });

    if (existingPatient) {
      throw new ConflictException(
        "Patient with this document number already exists in this clinic",
      );
    }

    // Generate patient code
    const patientCode = await this.generatePatientCode();

    // Create patient
    let allergies: Allergy[] = [];
    const allergyIds = (createPatientDto.allergies || [])
      .map(Number)
      .filter((id) => Number.isInteger(id) && id > 0);
    if (allergyIds.length > 0) {
      allergies = await this.allergyRepository.findByIds(allergyIds);
    }
    const patient = this.patientRepository.create({
      ...createPatientDto,
      patientCode,
      documentTypeId: createPatientDto.documentTypeId,
      allergies,
      clinicId: createPatientDto.clinicId ?? undefined,
    });
    const savedPatient = await this.patientRepository.save(patient);

    // Si tiene clinicId, crear relación en PatientClinic
    if (savedPatient.clinicId) {
      // Verifica que no exista ya la relación
      const exists = await this.patientClinicRepository.findOne({
        where: { patientId: savedPatient.id, clinicId: savedPatient.clinicId },
      });
      if (!exists) {
        const patientCodeClinic = await this.generateClinicPatientCode(
          savedPatient.clinicId,
        );
        const patientClinic = this.patientClinicRepository.create({
          patientId: savedPatient.id,
          clinicId: savedPatient.clinicId,
          patientCodeClinic,
          registrationDate: new Date(),
        });
        await this.patientClinicRepository.save(patientClinic);
      }
    }
    return savedPatient;
  }

  async createPatientInClinic(
    createPatientDto: CreatePatientDto,
    clinicId: number,
  ): Promise<{ patient: Patient; patientClinic: PatientClinic }> {
    // Check if patient already exists globally
    let patient = await this.patientRepository.findOne({
      where: { documentNumber: createPatientDto.documentNumber },
    });

    if (!patient) {
      // Create new patient globally
      patient = await this.create(createPatientDto);
    }

    // Check if patient is already registered in this clinic
    const existingPatientClinic = await this.patientClinicRepository.findOne({
      where: { patientId: patient.id, clinicId },
    });

    if (existingPatientClinic) {
      throw new ConflictException(
        "Patient is already registered in this clinic",
      );
    }

    // Generate clinic-specific patient code
    const patientCodeClinic = await this.generateClinicPatientCode(clinicId);

    // Create patient-clinic relationship
    const patientClinic = this.patientClinicRepository.create({
      patientId: patient.id,
      clinicId,
      patientCodeClinic,
      registrationDate: new Date(),
    });

    await this.patientClinicRepository.save(patientClinic);

    return { patient, patientClinic };
  }

  async findPatientsByClinic(
    clinicId: number,
    options?: { limit?: number; offset?: number; search?: string },
  ): Promise<Patient[]> {
    const query = this.patientClinicRepository
      .createQueryBuilder("pc")
      .leftJoinAndSelect("pc.patient", "patient")
      .leftJoinAndSelect("patient.allergies", "allergies")
      .where("pc.clinicId = :clinicId", { clinicId });

    const search = options?.search?.trim();
    if (search) {
      // Buscar por número de documento o por nombre completo concatenado
      query.andWhere(
        `(
        patient.documentNumber ILIKE :search
        OR CONCAT_WS(' ', patient.firstName, patient.secondName, patient.firstLastName, patient.secondLastName) ILIKE :search
      )`,
        { search: `%${search}%` },
      );
    }
    if (options?.offset) {
      query.skip(options.offset);
    }
    if (options?.limit) {
      query.take(options.limit);
    }
    const patientClinics = await query.getMany();
    return patientClinics.map((pc) => pc.patient);
  }

  async countPatientsByClinic(
    clinicId: number,
    options?: { search?: string },
  ): Promise<number> {
    const query = this.patientClinicRepository
      .createQueryBuilder("pc")
      .leftJoin("pc.patient", "patient")
      .where("pc.clinicId = :clinicId", { clinicId });

    const search = options?.search?.trim();
    if (search) {
      // Buscar por número de documento o por nombre completo concatenado
      query.andWhere(
        `(
        patient.documentNumber ILIKE :search
        OR CONCAT_WS(' ', patient.firstName, patient.secondName, patient.firstLastName, patient.secondLastName) ILIKE :search
      )`,
        { search: `%${search}%` },
      );
    }

    return await query.getCount();
  }

  async findPatientInClinic(
    patientId: number,
    clinicId: number,
  ): Promise<{ patient: Patient; patientClinic: PatientClinic }> {
    const patientClinic = await this.patientClinicRepository.findOne({
      where: { patientId, clinicId },
      relations: ["patient"],
    });

    if (!patientClinic) {
      throw new NotFoundException("Patient not found in this clinic");
    }

    return {
      patient: patientClinic.patient,
      patientClinic,
    };
  }

  async findAll(): Promise<Patient[]> {
    return this.patientRepository.find({
      relations: ["allergies"],
    });
  }

  async findOne(id: number): Promise<Patient> {
    const patient = await this.patientRepository.findOne({
      where: { id },
      relations: ["allergies"],
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }

    return patient;
  }

  async update(
    id: number,
    updatePatientDto: UpdatePatientDto,
  ): Promise<Patient> {
    const patient = await this.findOne(id);

    // Check for document number conflicts if being updated (within the same clinic)
    if (
      updatePatientDto.documentNumber &&
      updatePatientDto.documentNumber !== patient.documentNumber
    ) {
      const existingPatient = await this.patientRepository.findOne({
        where: {
          documentNumber: updatePatientDto.documentNumber,
          clinicId: patient.clinicId,
        },
      });
      if (existingPatient) {
        throw new ConflictException(
          "Patient with this document number already exists in this clinic",
        );
      }
    }

    // Manejo de alergias (ManyToMany)
    let allergies: Allergy[] | undefined = undefined;
    const allergyIds = (updatePatientDto.allergies || [])
      .map(Number)
      .filter((id) => Number.isInteger(id) && id > 0);
    if (updatePatientDto.allergies) {
      allergies = await this.allergyRepository.findByIds(allergyIds);
    }

    const updateData: any = { ...updatePatientDto };
    if (updatePatientDto.documentTypeId !== undefined) {
      updateData.documentTypeId = updatePatientDto.documentTypeId;
    }
    if (allergies !== undefined) {
      updateData.allergies = allergies;
    }
    await this.patientRepository.save({ ...patient, ...updateData });
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const patient = await this.findOne(id);
    await this.patientRepository.softDelete(id);
  }

  private async generatePatientCode(): Promise<string> {
    const count = await this.patientRepository.count();
    const code = `PAT${(count + 1).toString().padStart(6, "0")}`;

    // Ensure uniqueness
    const existing = await this.patientRepository.findOne({
      where: { patientCode: code },
    });

    if (existing) {
      return this.generatePatientCode(); // Recursive call if code exists
    }

    return code;
  }

  private async generateClinicPatientCode(clinicId: number): Promise<string> {
    const count = await this.patientClinicRepository.count({
      where: { clinicId },
    });
    const code = `CL${clinicId}-${(count + 1).toString().padStart(4, "0")}`;

    // Ensure uniqueness within clinic
    const existing = await this.patientClinicRepository.findOne({
      where: { patientCodeClinic: code },
    });

    if (existing) {
      return this.generateClinicPatientCode(clinicId);
    }

    return code;
  }
}
