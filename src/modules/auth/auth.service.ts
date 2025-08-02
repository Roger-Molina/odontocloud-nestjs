import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcryptjs";
import { User, UserStatus } from "../users/entities/user.entity";
import { LoginDto } from "./dto/login.dto";

export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
  clinicId?: number;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    clinic?: {
      id: number;
      name: string;
      address: string;
    };
  };
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;

    // Buscar usuario con relaciones
    const user = await this.userRepository.findOne({
      where: { email, status: UserStatus.ACTIVE },
      relations: ["clinic"],
    });

    if (!user) {
      throw new UnauthorizedException("Credenciales inválidas");
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Credenciales inválidas");
    }

    // Generar token JWT
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      clinicId: user.clinicId,
    };

    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        clinic: user.clinic
          ? {
              id: user.clinic.id,
              name: user.clinic.name,
              address: user.clinic.address,
            }
          : undefined,
      },
    };
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub, status: UserStatus.ACTIVE },
      relations: ["clinic"],
    });

    if (!user) {
      throw new UnauthorizedException("Usuario no encontrado");
    }

    return user;
  }

  async getProfile(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId, status: UserStatus.ACTIVE },
      relations: ["clinic"],
      select: [
        "id",
        "email",
        "firstName",
        "lastName",
        "role",
        "clinicId",
        "createdAt",
        "updatedAt",
      ],
    });

    if (!user) {
      throw new UnauthorizedException("Usuario no encontrado");
    }

    return user;
  }
}
