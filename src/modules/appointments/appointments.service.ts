import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Appointment, AppointmentStatus } from "./entities/appointment.entity";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { UpdateAppointmentDto } from "./dto/update-appointment.dto";
import { Doctor } from "../doctors/entities/doctor.entity";

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
    @InjectRepository(Doctor)
    private doctorsRepository: Repository<Doctor>,
  ) {}

  async create(
    createAppointmentDto: CreateAppointmentDto,
    clinicId: number,
  ): Promise<Appointment> {
    // Generate appointment code
    const appointmentCode = await this.generateAppointmentCode();

    // Get doctor's consultation fee if not provided
    let consultationFee = createAppointmentDto.consultationFee;
    if (!consultationFee && createAppointmentDto.doctorId) {
      const doctor = await this.doctorsRepository.findOne({
        where: { id: createAppointmentDto.doctorId },
      });
      if (doctor) {
        consultationFee = doctor.consultationFee;
      }
    }

    try {
      const appointment = this.appointmentsRepository.create({
        ...createAppointmentDto,
        appointmentCode,
        clinicId,
        consultationFee: consultationFee || 0, // Default to 0 if no fee found
      });
      return await this.appointmentsRepository.save(appointment);
    } catch (error) {
      if (error.code === "23505") {
        throw new ConflictException("Ya existe una cita con este código");
      }
      throw error;
    }
  }

  async findAll(
    clinicId: number,
    options: {
      status?: AppointmentStatus;
      limit?: number;
      offset?: number;
      doctorId?: number;
      date?: string;
    } = {},
  ): Promise<Appointment[]> {
    const query = this.appointmentsRepository
      .createQueryBuilder("appointment")
      .leftJoinAndSelect("appointment.patient", "patient")
      .leftJoinAndSelect("appointment.doctor", "doctor")
      .leftJoinAndSelect("doctor.user", "doctorUser")
      .leftJoinAndSelect("patient.user", "patientUser")
      .where("appointment.clinicId = :clinicId", { clinicId })
      .orderBy("appointment.appointmentDate", "ASC")
      .addOrderBy("appointment.appointmentTime", "ASC");

    if (options.status) {
      query.andWhere("appointment.status = :status", {
        status: options.status,
      });
    }

    if (options.doctorId) {
      query.andWhere("appointment.doctorId = :doctorId", {
        doctorId: options.doctorId,
      });
    }

    if (options.date) {
      query.andWhere("appointment.appointmentDate = :date", {
        date: options.date,
      });
    }

    if (options.limit) {
      query.limit(options.limit);
    }

    if (options.offset) {
      query.offset(options.offset);
    }

    return await query.getMany();
  }

  async findOne(id: number, clinicId: number): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id, clinicId },
      relations: ["patient", "doctor", "patient.user", "doctor.user"],
    });

    if (!appointment) {
      throw new NotFoundException(`Cita con ID ${id} no encontrada`);
    }

    return appointment;
  }

  async findByPatient(
    patientId: number,
    clinicId: number,
  ): Promise<Appointment[]> {
    return await this.appointmentsRepository.find({
      where: { patientId, clinicId },
      relations: ["doctor", "doctor.user"],
      order: { appointmentDate: "ASC", appointmentTime: "ASC" },
    });
  }

  async findByDoctor(
    doctorId: number,
    clinicId: number,
  ): Promise<Appointment[]> {
    return await this.appointmentsRepository.find({
      where: { doctorId, clinicId },
      relations: ["patient", "patient.user"],
      order: { appointmentDate: "ASC", appointmentTime: "ASC" },
    });
  }

  async findByStatus(
    status: AppointmentStatus,
    clinicId: number,
  ): Promise<Appointment[]> {
    return await this.appointmentsRepository.find({
      where: { status, clinicId },
      relations: ["patient", "doctor", "patient.user", "doctor.user"],
      order: { appointmentDate: "ASC", appointmentTime: "ASC" },
    });
  }

  async update(
    id: number,
    updateAppointmentDto: UpdateAppointmentDto,
    clinicId: number,
  ): Promise<Appointment> {
    const appointment = await this.findOne(id, clinicId);

    Object.assign(appointment, updateAppointmentDto);
    return await this.appointmentsRepository.save(appointment);
  }

  async confirm(id: number, clinicId: number): Promise<Appointment> {
    const appointment = await this.findOne(id, clinicId);
    appointment.status = AppointmentStatus.CONFIRMED;
    appointment.confirmedAt = new Date();

    return await this.appointmentsRepository.save(appointment);
  }

  async cancel(
    id: number,
    clinicId: number,
    reason?: string,
  ): Promise<Appointment> {
    const appointment = await this.findOne(id, clinicId);
    appointment.status = AppointmentStatus.CANCELLED;
    appointment.cancelledAt = new Date();
    appointment.cancellationReason = reason;

    return await this.appointmentsRepository.save(appointment);
  }

  async remove(id: number, clinicId: number): Promise<void> {
    const appointment = await this.findOne(id, clinicId);
    await this.appointmentsRepository.softRemove(appointment);
  }

  private async generateAppointmentCode(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    const count = await this.appointmentsRepository.count();
    const sequence = (count + 1).toString().padStart(4, "0");

    return `APT${year}${month}${day}${sequence}`;
  }
}
