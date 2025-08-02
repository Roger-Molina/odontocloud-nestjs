import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsPositive,
  Min,
  IsArray,
} from "class-validator";
import { DoctorStatus } from "../entities/doctor.entity";

export class CreateDoctorDto {
  @IsOptional()
  @IsString()
  doctorCode?: string;

  @IsString()
  medicalLicense: string;

  @IsArray()
  @IsNumber({}, { each: true })
  specialties: number[];

  @IsNumber()
  @Min(0)
  yearsExperience: number;

  @IsOptional()
  @IsEnum(DoctorStatus)
  status?: DoctorStatus;

  @IsOptional()
  @IsString()
  biography?: string;

  @IsNumber()
  @IsPositive()
  consultationFee: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  consultationDuration?: number;

  @IsNumber()
  userId: number;

  @IsNumber()
  clinicId: number;
}
