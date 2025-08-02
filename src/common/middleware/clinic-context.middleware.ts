import { Injectable, NestMiddleware, ForbiddenException } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    role: string;
    doctor?: {
      id: number;
      clinicId: number;
    };
    admin?: {
      id: number;
      clinicId?: number;
    };
  };
}

@Injectable()
export class ClinicContextMiddleware implements NestMiddleware {
  use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    // Solo aplicar para rutas que requieren contexto de clínica
    if (this.shouldInjectClinicContext(req.path)) {
      if (!req.user) {
        throw new ForbiddenException("Usuario no autenticado");
      }

      // Auto-inyectar clinic_id para doctores
      if (req.user.role === "doctor" && req.user.doctor?.clinicId) {
        // Para POST/PUT requests, inyectar clinic_id en el body
        if (req.method === "POST" || req.method === "PUT") {
          req.body.clinicId = req.user.doctor.clinicId;
        }

        // Para GET requests, agregar clinic_id a los parámetros de consulta
        if (req.method === "GET" && !req.params.clinicId) {
          req.params.clinicId = req.user.doctor.clinicId.toString();
        }
      }

      // Validar que el doctor no esté accediendo a datos de otra clínica
      if (req.params.clinicId && req.user.role === "doctor") {
        const requestedClinicId = parseInt(req.params.clinicId);
        if (req.user.doctor?.clinicId !== requestedClinicId) {
          throw new ForbiddenException(
            "No tiene acceso a datos de esta clínica",
          );
        }
      }
    }

    next();
  }

  private shouldInjectClinicContext(path: string): boolean {
    const clinicContextPaths = [
      "/patients/clinic",
      "/appointments",
      "/medical-records",
      "/inventory",
      "/billing",
    ];

    return clinicContextPaths.some((contextPath) => path.includes(contextPath));
  }
}
