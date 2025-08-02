import { IsEnum, IsNotEmpty } from "class-validator";
import { OdontogramStatus } from "../entities/odontogram.entity";

export class UpdateOdontogramStatusDto {
  @IsEnum(OdontogramStatus, {
    message: "El estado del odontograma debe ser un valor válido",
  })
  @IsNotEmpty({ message: "El estado es requerido" })
  status: OdontogramStatus;
}
