// Eliminado: declaración duplicada fuera de la clase
import { IsString, IsDate, IsEnum, IsEmail, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { Gender } from "../entities/patient.entity";

export class CreatePatientDto {
  @ApiProperty({
    description: "Primer nombre del paciente",
    example: "Juan",
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: "Segundo nombre del paciente",
    example: "Carlos",
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  secondName?: string;

  @ApiProperty({
    description: "Primer apellido del paciente",
    example: "Pérez",
  })
  @IsString()
  firstLastName: string;

  @ApiProperty({
    description: "Segundo apellido del paciente",
    example: "García",
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  secondLastName?: string;

  @ApiProperty({
    description: "ID del tipo de documento",
    example: 1,
  })
  documentTypeId: number;

  @ApiProperty({
    description: "Número de documento",
    example: "12345678",
  })
  @IsString()
  documentNumber: string;

  @ApiProperty({
    description: "Fecha de nacimiento",
    example: "1990-01-15",
  })
  @IsDate()
  @Type(() => Date)
  birthDate: Date;

  @ApiProperty({
    description: "Género",
    enum: Gender,
    example: Gender.MALE,
  })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    description: "Dirección",
    example: "Av. Principal 123",
  })
  @IsString()
  address: string;

  @ApiProperty({
    description: "Número de teléfono",
    example: "+1234567890",
  })
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    description: "Email del paciente",
    example: "paciente@ejemplo.com",
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: "Nombre del contacto de emergencia",
    example: "María Pérez",
  })
  @IsString()
  emergencyContactName: string;

  @ApiProperty({
    description: "Teléfono del contacto de emergencia",
    example: "+1234567890",
  })
  @IsString()
  emergencyContactPhone: string;

  @ApiProperty({
    description: "ID del tipo de sangre",
    example: 1,
    required: false,
  })
  @IsOptional()
  bloodTypeId?: number;

  @ApiProperty({
    description: "IDs de alergias conocidas",
    example: [1, 2],
    required: false,
    type: [Number],
  })
  @IsOptional()
  allergies?: number[];

  @ApiProperty({
    description: "Historial médico previo",
    example: "Hipertensión controlada",
    required: false,
  })
  @IsOptional()
  @IsString()
  medicalHistory?: string;

  @ApiProperty({
    description:
      "ID de la clínica a la que pertenece el paciente (asignado automáticamente si el usuario tiene clínica)",
    example: 1,
    required: false,
  })
  @IsOptional()
  clinicId?: number;
}
