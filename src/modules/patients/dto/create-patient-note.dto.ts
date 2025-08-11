import { IsString, IsNotEmpty, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreatePatientNoteDto {
  @ApiProperty({
    description: "ID del paciente",
    example: 1,
  })
  patientId: number;

  @ApiProperty({
    description: "Contenido de la nota",
    example:
      "Paciente muy colaborador durante la consulta. Se recomienda seguimiento mensual.",
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000, {
    message: "El contenido de la nota no puede exceder los 1000 caracteres",
  })
  content: string;
}
