import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "../entities/user.entity";

export class CreateUserDto {
  @ApiProperty({
    description: "Email del usuario",
    example: "usuario@ejemplo.com",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "Contraseña del usuario",
    example: "password123",
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: "Primer nombre",
    example: "Juan",
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: "Segundo nombre",
    example: "Carlos",
    required: false,
  })
  @IsOptional()
  @IsString()
  middleName?: string;

  @ApiProperty({
    description: "Primer apellido",
    example: "Pérez",
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: "Segundo apellido",
    example: "García",
    required: false,
  })
  @IsOptional()
  @IsString()
  secondLastName?: string;

  @ApiProperty({
    description: "Rol del usuario",
    enum: UserRole,
    example: UserRole.PATIENT,
  })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({
    description: "Número de teléfono",
    example: "+1234567890",
    required: false,
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
