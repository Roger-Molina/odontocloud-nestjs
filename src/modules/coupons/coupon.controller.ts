import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from "@nestjs/common";
import { CouponService } from "./coupon.service";
import { CreateCouponDto } from "./dto/create-coupon.dto";
import { UpdateCouponDto } from "./dto/update-coupon.dto";
import { ValidateCouponDto } from "./dto/validate-coupon.dto";

@Controller("coupons")
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  create(@Body() createCouponDto: CreateCouponDto) {
    return this.couponService.create(createCouponDto);
  }

  @Get()
  findAll(@Query("active") active?: string) {
    if (active === "true") {
      return this.couponService.findActive();
    }
    return this.couponService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.couponService.findOne(id);
  }

  @Post("validate")
  validateCoupon(@Body() validateCouponDto: ValidateCouponDto) {
    return this.couponService.validateCoupon(validateCouponDto);
  }

  @Post("apply")
  applyCoupon(@Body() validateCouponDto: ValidateCouponDto) {
    return this.couponService.applyCoupon(
      validateCouponDto.code,
      validateCouponDto.amount,
    );
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateCouponDto: UpdateCouponDto,
  ) {
    return this.couponService.update(id, updateCouponDto);
  }

  @Patch(":id/deactivate")
  deactivate(@Param("id", ParseIntPipe) id: number) {
    return this.couponService.deactivate(id);
  }

  @Patch(":id/activate")
  activate(@Param("id", ParseIntPipe) id: number) {
    return this.couponService.activate(id);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.couponService.remove(id);
  }
}
