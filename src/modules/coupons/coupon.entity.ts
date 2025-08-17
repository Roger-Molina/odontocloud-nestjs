import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

export enum CouponType {
  PERCENTAGE = "percentage",
  FIXED_AMOUNT = "fixed_amount",
}

export enum CouponStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  EXPIRED = "expired",
}

@Entity("coupons")
export class Coupon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: "enum",
    enum: CouponType,
    default: CouponType.PERCENTAGE,
  })
  type: CouponType;

  @Column("decimal", { precision: 10, scale: 2 })
  value: number; // Porcentaje o cantidad fija

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  minimumAmount: number; // Monto mínimo para aplicar el cupón

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  maximumDiscount: number; // Descuento máximo para cupones de porcentaje

  @Column({ type: "date" })
  validFrom: Date;

  @Column({ type: "date" })
  validUntil: Date;

  @Column({ default: 0 })
  usageLimit: number; // 0 = sin límite

  @Column({ default: 0 })
  usageCount: number; // Contador de usos

  @Column({
    type: "enum",
    enum: CouponStatus,
    default: CouponStatus.ACTIVE,
  })
  status: CouponStatus;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Métodos helper
  get isValid(): boolean {
    const now = new Date();
    return (
      this.isActive &&
      this.status === CouponStatus.ACTIVE &&
      now >= this.validFrom &&
      now <= this.validUntil &&
      (this.usageLimit === 0 || this.usageCount < this.usageLimit)
    );
  }

  canApplyToAmount(amount: number): boolean {
    return !this.minimumAmount || amount >= this.minimumAmount;
  }

  calculateDiscount(amount: number): number {
    if (!this.canApplyToAmount(amount)) {
      return 0;
    }

    let discount = 0;
    
    if (this.type === CouponType.PERCENTAGE) {
      discount = (amount * this.value) / 100;
      // Aplicar límite máximo si existe
      if (this.maximumDiscount && discount > this.maximumDiscount) {
        discount = this.maximumDiscount;
      }
    } else {
      discount = Math.min(this.value, amount);
    }

    return discount;
  }
}
