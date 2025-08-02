import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In, Not } from "typeorm";
import { Doctor, DoctorStatus } from "./entities/doctor.entity";
import { User, UserRole } from "../users/entities/user.entity";
import { Specialty } from "./entities/specialty.entity";
import { CreateDoctorDto } from "./dto/create-doctor.dto";
import { UpdateDoctorDto } from "./dto/update-doctor.dto";

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private doctorsRepository: Repository<Doctor>,
    @InjectRepository(Specialty)
    private specialtiesRepository: Repository<Specialty>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    try {
      // Generar código de doctor si no se proporciona
      if (!createDoctorDto.doctorCode) {
        createDoctorDto.doctorCode = await this.generateDoctorCode();
      }

      // Separar las especialidades del DTO
      const { specialties: specialtyIds, ...doctorData } = createDoctorDto;

      // Crear el doctor sin las especialidades primero
      const doctor = this.doctorsRepository.create(doctorData);

      // Si hay especialidades, cargarlas y asociarlas
      if (specialtyIds && specialtyIds.length > 0) {
        const specialties = await this.specialtiesRepository.find({
          where: { id: In(specialtyIds) },
        });
        doctor.specialties = specialties;
      }

      return await this.doctorsRepository.save(doctor);
    } catch (error: any) {
      if (error.code === "23505") {
        throw new ConflictException(
          "El código de doctor o licencia médica ya existe",
        );
      }
      throw error;
    }
  }

  async findByClinic(clinicId: number): Promise<Doctor[]> {
    return this.doctorsRepository.find({
      where: { clinicId },
      relations: ["user", "clinic", "specialties"],
    });
  }

  async findDoctorWithClinic(doctorId: number): Promise<Doctor> {
    const doctor = await this.doctorsRepository.findOne({
      where: { id: doctorId },
      relations: ["user", "clinic", "specialties"],
    });

    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${doctorId} not found`);
    }

    return doctor;
  }

  async findAll(): Promise<Doctor[]> {
    return await this.doctorsRepository.find({
      relations: ["user", "specialties"],
      order: { createdAt: "DESC" },
    });
  }

  async findAllIncludingUsers(): Promise<any[]> {
    // Obtener todos los doctores existentes
    const doctors = await this.doctorsRepository.find({
      relations: ["user", "specialties"],
      order: { createdAt: "DESC" },
    });

    // Obtener IDs de usuarios que ya tienen registro de doctor
    const userIdsWithDoctorRecord = doctors.map((doctor) => doctor.userId);

    // Obtener usuarios con rol doctor que NO tienen registro de doctor
    const usersWithoutDoctorRecord = await this.usersRepository.find({
      where: {
        role: UserRole.DOCTOR,
        ...(userIdsWithDoctorRecord.length > 0
          ? { id: Not(In(userIdsWithDoctorRecord)) }
          : {}),
      },
      relations: ["clinic"],
    });

    // No necesitamos filtrar aquí porque la consulta ya excluye a los usuarios con registro

    // Convertir usuarios sin registro a formato compatible con Doctor
    const usersAsDoctors = usersWithoutDoctorRecord.map((user) => ({
      id: null, // Indica que no tiene registro de doctor
      userId: user.id,
      user: user,
      doctorCode: null,
      medicalLicense: null,
      // specialization removed - using specialties array instead
      specialties: [],
      yearsExperience: 0,
      status: "inactive",
      biography: null,
      consultationFee: 0,
      consultationDuration: 30,
      clinicId: user.clinicId,
      clinic: user.clinic,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isIncomplete: true, // Flag para identificar registros incompletos
    }));

    // Combinar doctores completos con usuarios sin registro
    return [...doctors, ...usersAsDoctors];
  }

  async findOne(id: number): Promise<Doctor> {
    const doctor = await this.doctorsRepository.findOne({
      where: { id },
      relations: ["user", "specialties"],
    });

    if (!doctor) {
      throw new NotFoundException(`Doctor con ID ${id} no encontrado`);
    }

    return doctor;
  }

  async findByCode(doctorCode: string): Promise<Doctor> {
    const doctor = await this.doctorsRepository.findOne({
      where: { doctorCode },
      relations: ["user", "specialties"],
    });

    if (!doctor) {
      throw new NotFoundException(
        `Doctor con código ${doctorCode} no encontrado`,
      );
    }

    return doctor;
  }

  // findBySpecialization method removed - use specialties array instead
  // If needed, implement findBySpecialtyId that queries the specialties relation

  async update(id: number, updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
    const doctor = await this.findOne(id);

    try {
      // Separar las especialidades del DTO
      const { specialties: specialtyIds, ...updateData } = updateDoctorDto;

      // Actualizar los datos básicos del doctor
      Object.assign(doctor, updateData);

      // Si hay especialidades, cargarlas y asociarlas
      if (specialtyIds !== undefined) {
        if (specialtyIds.length > 0) {
          const specialties = await this.specialtiesRepository.find({
            where: { id: In(specialtyIds) },
          });
          doctor.specialties = specialties;
        } else {
          doctor.specialties = [];
        }
      }

      return await this.doctorsRepository.save(doctor);
    } catch (error) {
      if (error.code === "23505") {
        throw new ConflictException(
          "El código de doctor o licencia médica ya existe",
        );
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    const doctor = await this.findOne(id);
    await this.doctorsRepository.softRemove(doctor);
  }

  async findActive(): Promise<Doctor[]> {
    return await this.doctorsRepository.find({
      where: { status: DoctorStatus.ACTIVE },
      relations: ["user"],
      order: { user: { firstName: "ASC" } },
    });
  }

  private async generateDoctorCode(): Promise<string> {
    const count = await this.doctorsRepository.count();
    const code = `DOC${(count + 1).toString().padStart(4, "0")}`;

    // Ensure uniqueness
    const existing = await this.doctorsRepository.findOne({
      where: { doctorCode: code },
    });

    if (existing) {
      return this.generateDoctorCode();
    }

    return code;
  }
}
