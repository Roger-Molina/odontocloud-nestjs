import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { getRepository } from "typeorm";
import { Patient } from "../../modules/patients/entities/patient.entity";

@Injectable()
export class ClinicAccessGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException("Usuario no autenticado");
    }

    // Super admin puede acceder a todo
    if (user.role === "super_admin") {
      return true;
    }

    // Obtener el clinic_id de los parámetros de la request
    let clinicId =
      request.params.clinicId ||
      request.body.clinicId ||
      request.query.clinicId;

    // Si no hay clinic_id pero hay id de paciente, buscar el paciente y obtener su clinicId
    if (!clinicId && request.params.id) {
      const patientRepo = getRepository(Patient);
      const patient = await patientRepo.findOne(request.params.id);
      if (!patient) {
        throw new ForbiddenException("Paciente no encontrado");
      }
      clinicId = patient.clinicId;
    }

    // Si no hay clinic_id en la request, verificar que el doctor tenga una clínica asignada
    if (!clinicId && user.role === "doctor") {
      if (!user.doctor?.clinicId) {
        throw new ForbiddenException("Doctor no asignado a ninguna clínica");
      }
      return true;
    }

    // Verificar que el usuario tenga acceso a la clínica solicitada
    if (user.role === "doctor") {
      if (user.doctor?.clinicId !== parseInt(clinicId)) {
        throw new ForbiddenException("No tiene acceso a esta clínica");
      }
    }

    if (user.role === "admin") {
      // Los admin pueden estar asignados a clínicas específicas
      if (user.admin?.clinicId && user.admin.clinicId !== parseInt(clinicId)) {
        throw new ForbiddenException("No tiene acceso a esta clínica");
      }
    }

    return true;
  }
}
