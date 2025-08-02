import {
  IsString,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { AppointmentType } from "../entities/appointment.entity";

export class CreateAppointmentDto {
  @ApiProperty({
    description: "Fecha de la cita",
    example: "2024-01-15",
  })
  @IsDate()
  @Type(() => Date)
  appointmentDate: Date;

  @ApiProperty({
    description: "Hora de la cita",
    example: "09:30",
  })
  @IsString()
  appointmentTime: string;

  @ApiProperty({
    description: "Duración en minutos",
    example: 30,
    default: 30,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  durationMinutes?: number;

  @ApiProperty({
    description: "Tipo de cita",
    enum: AppointmentType,
    example: AppointmentType.CONSULTATION,
  })
  @IsEnum(AppointmentType)
  type: AppointmentType;

  @ApiProperty({
    description: "Razón de la cita",
    example: "Consulta general",
    required: false,
  })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({
    description: "Notas adicionales",
    example: "Paciente presenta síntomas de...",
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: "Tarifa de consulta",
    example: 50.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  consultationFee?: number;

  @ApiProperty({
    description: "ID del paciente",
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  patientId: number;

  @ApiProperty({
    description: "ID del doctor",
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  doctorId: number;

  @ApiProperty({
    description: "ID de la clínica",
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  clinicId?: number;
}
