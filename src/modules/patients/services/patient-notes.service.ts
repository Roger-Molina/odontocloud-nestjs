import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PatientNote } from "../entities/patient-note.entity";
import { Patient } from "../entities/patient.entity";
import { CreatePatientNoteDto } from "../dto/create-patient-note.dto";
import { UpdatePatientNoteDto } from "../dto/update-patient-note.dto";

@Injectable()
export class PatientNotesService {
  constructor(
    @InjectRepository(PatientNote)
    private readonly patientNoteRepository: Repository<PatientNote>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}

  async create(
    createPatientNoteDto: CreatePatientNoteDto,
    userId?: number,
    userClinicId?: number,
  ): Promise<PatientNote> {
    // Verificar que el paciente existe
    const patient = await this.patientRepository.findOne({
      where: { id: createPatientNoteDto.patientId },
    });

    if (!patient) {
      throw new NotFoundException(
        `Patient with ID ${createPatientNoteDto.patientId} not found`,
      );
    }

    // Verificar que el usuario puede acceder a este paciente (mismo clinicId)
    if (userClinicId && patient.clinicId !== userClinicId) {
      throw new ForbiddenException(
        "You don't have access to this patient's notes",
      );
    }

    const patientNote = this.patientNoteRepository.create({
      patientId: createPatientNoteDto.patientId,
      content: createPatientNoteDto.content,
      createdBy: userId,
      clinicId: userClinicId,
    });

    return this.patientNoteRepository.save(patientNote);
  }

  async findByPatient(
    patientId: number,
    options?: { limit?: number; offset?: number },
    userClinicId?: number,
  ): Promise<{ data: PatientNote[]; total: number }> {
    // Verificar que el paciente existe y el usuario tiene acceso
    const patient = await this.patientRepository.findOne({
      where: { id: patientId },
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${patientId} not found`);
    }

    if (userClinicId && patient.clinicId !== userClinicId) {
      throw new ForbiddenException(
        "You don't have access to this patient's notes",
      );
    }

    const query = this.patientNoteRepository
      .createQueryBuilder("note")
      .leftJoinAndSelect("note.createdByUser", "user")
      .where("note.patientId = :patientId", { patientId })
      .orderBy("note.updatedAt", "DESC")
      .addOrderBy("note.createdAt", "DESC");

    // Aplicar paginación
    const limit = options?.limit || 15;
    const offset = options?.offset || 0;

    query.take(limit).skip(offset);

    const [data, total] = await query.getManyAndCount();

    return { data, total };
  }

  async findOne(id: number, userClinicId?: number): Promise<PatientNote> {
    const note = await this.patientNoteRepository.findOne({
      where: { id },
      relations: ["createdByUser", "patient"],
    });

    if (!note) {
      throw new NotFoundException(`Patient note with ID ${id} not found`);
    }

    // Verificar acceso por clínica
    if (userClinicId && note.clinicId !== userClinicId) {
      throw new ForbiddenException("You don't have access to this note");
    }

    return note;
  }

  async update(
    id: number,
    updatePatientNoteDto: UpdatePatientNoteDto,
    userId?: number,
    userClinicId?: number,
  ): Promise<PatientNote> {
    const note = await this.findOne(id, userClinicId);

    // Opcional: verificar que solo el creador puede editar la nota
    // if (userId && note.createdBy !== userId) {
    //   throw new ForbiddenException("You can only edit your own notes");
    // }

    await this.patientNoteRepository.save({
      ...note,
      ...updatePatientNoteDto,
    });

    return this.findOne(id, userClinicId);
  }

  async remove(
    id: number,
    userId?: number,
    userClinicId?: number,
  ): Promise<void> {
    await this.findOne(id, userClinicId);

    // Opcional: verificar que solo el creador puede eliminar la nota
    // if (userId && note.createdBy !== userId) {
    //   throw new ForbiddenException("You can only delete your own notes");
    // }

    await this.patientNoteRepository.softDelete(id);
  }

  async countByPatient(
    patientId: number,
    userClinicId?: number,
  ): Promise<number> {
    // Verificar que el paciente existe y el usuario tiene acceso
    const patient = await this.patientRepository.findOne({
      where: { id: patientId },
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${patientId} not found`);
    }

    if (userClinicId && patient.clinicId !== userClinicId) {
      throw new ForbiddenException(
        "You don't have access to this patient's notes",
      );
    }

    return this.patientNoteRepository.count({
      where: { patientId },
    });
  }
}
