import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Coupon, CouponStatus, CouponType } from "./coupon.entity";
import { CreateCouponDto } from "./dto/create-coupon.dto";
import { UpdateCouponDto } from "./dto/update-coupon.dto";
import { ValidateCouponDto } from "./dto/validate-coupon.dto";

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>,
  ) {}

  async create(createCouponDto: CreateCouponDto): Promise<Coupon> {
    // Verificar que el código del cupón no exista
    const existingCoupon = await this.couponRepository.findOne({
      where: { code: createCouponDto.code.toUpperCase() },
    });

    if (existingCoupon) {
      throw new BadRequestException(`El código de cupón "${createCouponDto.code}" ya existe`);
    }

    const coupon = this.couponRepository.create({
      ...createCouponDto,
      code: createCouponDto.code.toUpperCase(),
    });

    return this.couponRepository.save(coupon);
  }

  async findAll(): Promise<Coupon[]> {
    return this.couponRepository.find({
      order: { createdAt: "DESC" },
    });
  }

  async findActive(): Promise<Coupon[]> {
    const now = new Date();
    return this.couponRepository
      .createQueryBuilder("coupon")
      .where("coupon.isActive = :isActive", { isActive: true })
      .andWhere("coupon.status = :status", { status: CouponStatus.ACTIVE })
      .andWhere("coupon.validFrom <= :now", { now })
      .andWhere("coupon.validUntil >= :now", { now })
      .andWhere("(coupon.usageLimit = 0 OR coupon.usageCount < coupon.usageLimit)")
      .orderBy("coupon.createdAt", "DESC")
      .getMany();
  }

  async findOne(id: number): Promise<Coupon> {
    const coupon = await this.couponRepository.findOne({
      where: { id },
    });

    if (!coupon) {
      throw new NotFoundException(`Cupón con ID ${id} no encontrado`);
    }

    return coupon;
  }

  async findByCode(code: string): Promise<Coupon | null> {
    return this.couponRepository.findOne({
      where: { code: code.toUpperCase() },
    });
  }

  async validateCoupon(validateCouponDto: ValidateCouponDto): Promise<{
    valid: boolean;
    coupon?: Coupon;
    discount: number;
    message: string;
  }> {
    const { code, amount } = validateCouponDto;
    
    const coupon = await this.findByCode(code);
    
    if (!coupon) {
      return {
        valid: false,
        discount: 0,
        message: "El código de cupón no existe",
      };
    }

    if (!coupon.isValid) {
      let message = "El cupón no es válido";
      
      if (!coupon.isActive) {
        message = "El cupón está desactivado";
      } else if (coupon.status !== CouponStatus.ACTIVE) {
        message = "El cupón no está activo";
      } else {
        const now = new Date();
        if (now < coupon.validFrom) {
          message = "El cupón aún no es válido";
        } else if (now > coupon.validUntil) {
          message = "El cupón ha expirado";
        } else if (coupon.usageLimit > 0 && coupon.usageCount >= coupon.usageLimit) {
          message = "El cupón ha alcanzado su límite de uso";
        }
      }
      
      return {
        valid: false,
        discount: 0,
        message,
      };
    }

    if (!coupon.canApplyToAmount(amount)) {
      return {
        valid: false,
        discount: 0,
        message: `El monto mínimo para este cupón es $${coupon.minimumAmount}`,
      };
    }

    const discount = coupon.calculateDiscount(amount);
    
    return {
      valid: true,
      coupon,
      discount,
      message: `Cupón aplicado: ${coupon.type === CouponType.PERCENTAGE ? `${coupon.value}%` : `$${coupon.value}`} de descuento`,
    };
  }

  async applyCoupon(code: string, amount: number): Promise<{
    coupon: Coupon;
    discount: number;
  }> {
    const validation = await this.validateCoupon({ code, amount });
    
    if (!validation.valid || !validation.coupon) {
      throw new BadRequestException(validation.message);
    }

    // Incrementar contador de uso
    await this.couponRepository.update(validation.coupon.id, {
      usageCount: validation.coupon.usageCount + 1,
    });

    return {
      coupon: validation.coupon,
      discount: validation.discount,
    };
  }

  async update(id: number, updateCouponDto: UpdateCouponDto): Promise<Coupon> {
    const coupon = await this.findOne(id);

    if (updateCouponDto.code && updateCouponDto.code !== coupon.code) {
      const existingCoupon = await this.couponRepository.findOne({
        where: { code: updateCouponDto.code.toUpperCase() },
      });

      if (existingCoupon && existingCoupon.id !== id) {
        throw new BadRequestException(`El código de cupón "${updateCouponDto.code}" ya existe`);
      }
    }

    await this.couponRepository.update(id, {
      ...updateCouponDto,
      code: updateCouponDto.code?.toUpperCase(),
    });

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const coupon = await this.findOne(id);
    await this.couponRepository.remove(coupon);
  }

  async deactivate(id: number): Promise<Coupon> {
    await this.couponRepository.update(id, {
      isActive: false,
      status: CouponStatus.INACTIVE,
    });
    return this.findOne(id);
  }

  async activate(id: number): Promise<Coupon> {
    await this.couponRepository.update(id, {
      isActive: true,
      status: CouponStatus.ACTIVE,
    });
    return this.findOne(id);
  }

  // Método para marcar cupones expirados (para ejecutar con cron)
  async markExpiredCoupons(): Promise<number> {
    const now = new Date();
    const result = await this.couponRepository
      .createQueryBuilder()
      .update(Coupon)
      .set({ status: CouponStatus.EXPIRED })
      .where("validUntil < :now", { now })
      .andWhere("status = :status", { status: CouponStatus.ACTIVE })
      .execute();

    return result.affected || 0;
  }
}
