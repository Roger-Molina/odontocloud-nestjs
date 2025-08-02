import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsDateString,
  IsArray,
  IsBoolean,
  ValidateNested,
  Min,
  Max,
  IsNotEmpty,
  ArrayNotEmpty,
  ArrayUnique,
  IsPositive,
  Length,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  Validate,
} from "class-validator";
import { Type } from "class-transformer";
import {
  ToothStatus,
  ToothSurface,
  OdontogramStatus,
} from "../entities/odontogram.entity";

// Validador personalizado para números de dientes
@ValidatorConstraint({ name: "validToothNumber", async: false })
export class ValidToothNumberConstraint
  implements ValidatorConstraintInterface
{
  validate(toothNumber: any): boolean {
    const validTeeth = [
      // Superior derecho: 18-11
      18, 17, 16, 15, 14, 13, 12, 11,
      // Superior izquierdo: 21-28
      21, 22, 23, 24, 25, 26, 27, 28,
      // Inferior izquierdo: 38-31
      38, 37, 36, 35, 34, 33, 32, 31,
      // Inferior derecho: 41-48
      41, 42, 43, 44, 45, 46, 47, 48,
    ];
    
    return validTeeth.includes(Number(toothNumber));
  }

  defaultMessage(): string {
    return "Número de diente no válido según el sistema internacional de numeración dental";
  }
}

// Validador personalizado para duplicados
@ValidatorConstraint({ name: "uniqueToothNumbers", async: false })
export class UniqueToothNumbersConstraint
  implements ValidatorConstraintInterface
{
  validate(toothRecords: any[]): boolean {
    if (!Array.isArray(toothRecords)) return true;
    
    const toothNumbers: number[] = [];
    for (const record of toothRecords) {
      if (record && typeof record === "object" && "toothNumber" in record) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        toothNumbers.push(Number(record.toothNumber));
      }
    }
    
    const uniqueNumbers = [...new Set(toothNumbers)];
    return uniqueNumbers.length === toothNumbers.length;
  }

  defaultMessage(): string {
    return "Números de diente duplicados encontrados";
  }
}

export class ToothRecordDto {
  @IsNumber({}, { message: "El número del diente debe ser un número válido" })
  @Validate(ValidToothNumberConstraint)
  toothNumber: number;

  @IsEnum(ToothStatus, {
    message: "El estado del diente debe ser un valor válido",
  })
  status: ToothStatus;

  @IsOptional()
  @IsArray({ message: "Las superficies afectadas deben ser un array" })
  @IsEnum(ToothSurface, {
    each: true,
    message: "Cada superficie debe ser un valor válido",
  })
  @ArrayUnique({ message: "Las superficies no pueden estar duplicadas" })
  affectedSurfaces?: ToothSurface[];

  @IsOptional()
  @IsString({ message: "Las notas deben ser una cadena de texto" })
  @Length(0, 500, { message: "Las notas no pueden exceder 500 caracteres" })
  notes?: string;

  @IsOptional()
  @IsBoolean({ message: "Tratamiento requerido debe ser verdadero o falso" })
  treatmentRequired?: boolean;

  @IsOptional()
  @IsBoolean({ message: "Tratamiento completado debe ser verdadero o falso" })
  treatmentCompleted?: boolean;

  @IsOptional()
  @IsDateString(
    {},
    { message: "La fecha de tratamiento debe tener un formato válido" },
  )
  treatmentDate?: string;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: "El costo estimado debe ser un número válido" },
  )
  @IsPositive({ message: "El costo estimado debe ser mayor a 0" })
  @Min(0.01, { message: "El costo estimado debe ser mayor a 0" })
  @Max(999999.99, { message: "El costo estimado es demasiado alto" })
  costEstimate?: number;

  @IsOptional()
  @IsNumber({}, { message: "El nivel de prioridad debe ser un número" })
  @Min(1, { message: "El nivel de prioridad debe ser entre 1 y 4" })
  @Max(4, { message: "El nivel de prioridad debe ser entre 1 y 4" })
  priorityLevel?: number;

  @IsOptional()
  @IsString({ message: "Último modificado por debe ser una cadena de texto" })
  @Length(1, 100, {
    message: "Último modificado por debe tener entre 1 y 100 caracteres",
  })
  lastModifiedBy?: string;
}

export class CreateOdontogramDto {
  @IsDateString(
    {},
    { message: "La fecha de examinación debe tener un formato válido" },
  )
  @IsNotEmpty({ message: "La fecha de examinación es requerida" })
  examinationDate: string;

  @IsOptional()
  @IsString({ message: "Las notas generales deben ser una cadena de texto" })
  @Length(0, 1000, {
    message: "Las notas generales no pueden exceder 1000 caracteres",
  })
  generalNotes?: string;

  @IsOptional()
  @IsString({ message: "El diagnóstico debe ser una cadena de texto" })
  @Length(0, 2000, {
    message: "El diagnóstico no puede exceder 2000 caracteres",
  })
  diagnosis?: string;

  @IsOptional()
  @IsString({ message: "El plan de tratamiento debe ser una cadena de texto" })
  @Length(0, 2000, {
    message: "El plan de tratamiento no puede exceder 2000 caracteres",
  })
  treatmentPlan?: string;

  @IsOptional()
  @IsEnum(OdontogramStatus, {
    message: "El estado del odontograma debe ser un valor válido",
  })
  status?: OdontogramStatus;

  @IsOptional()
  @IsString({ message: "Las notas del doctor deben ser una cadena de texto" })
  @Length(0, 1000, {
    message: "Las notas del doctor no pueden exceder 1000 caracteres",
  })
  doctorNotes?: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: "La fecha de próxima cita debe tener un formato válido" },
  )
  nextAppointmentDate?: string;

  @IsOptional()
  @IsNumber({}, { message: "El nivel de urgencia debe ser un número" })
  @Min(1, { message: "El nivel de urgencia debe ser entre 1 y 4" })
  @Max(4, { message: "El nivel de urgencia debe ser entre 1 y 4" })
  urgencyLevel?: number;

  @IsNumber({}, { message: "El ID del paciente debe ser un número válido" })
  @IsPositive({ message: "El ID del paciente debe ser mayor a 0" })
  @IsNotEmpty({ message: "El ID del paciente es requerido" })
  patientId: number;

  @IsArray({ message: "Los registros de dientes deben ser un array" })
  @ArrayNotEmpty({
    message: "Debe proporcionar al menos un registro de diente",
  })
  @ValidateNested({ each: true })
  @Type(() => ToothRecordDto)
  @Validate(UniqueToothNumbersConstraint)
  toothRecords: ToothRecordDto[];
}
