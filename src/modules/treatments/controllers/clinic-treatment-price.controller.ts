import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from "@nestjs/common";
import { ClinicTreatmentPriceService } from "../services/clinic-treatment-price.service";
import { 
  CreateClinicTreatmentPriceDto, 
  UpdateClinicTreatmentPriceDto 
} from "../dto/clinic-treatment-price.dto";

@Controller("clinic-treatment-prices")
export class ClinicTreatmentPriceController {
  constructor(
    private readonly clinicTreatmentPriceService: ClinicTreatmentPriceService,
  ) {}

  @Post()
  create(@Body() createDto: CreateClinicTreatmentPriceDto) {
    return this.clinicTreatmentPriceService.create(createDto);
  }

  @Get()
  findAll(@Query() filter: any) {
    return this.clinicTreatmentPriceService.findAll(filter);
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.clinicTreatmentPriceService.findOne(id);
  }

  @Get("clinic/:clinicId/treatment/:treatmentId")
  findByClinicAndTreatment(
    @Param("clinicId", ParseIntPipe) clinicId: number,
    @Param("treatmentId", ParseIntPipe) treatmentId: number,
  ) {
    return this.clinicTreatmentPriceService.findByClinicAndTreatment(
      clinicId,
      treatmentId,
    );
  }

  @Patch(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() updateDto: UpdateClinicTreatmentPriceDto) {
    return this.clinicTreatmentPriceService.update(id, updateDto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.clinicTreatmentPriceService.remove(id);
  }

  @Patch(":id/deactivate")
  deactivate(@Param("id", ParseIntPipe) id: number) {
    return this.clinicTreatmentPriceService.deactivate(id);
  }

  @Get("clinic/:clinicId/treatment/:treatmentId/effective-price")
  getEffectivePrice(
    @Param("clinicId", ParseIntPipe) clinicId: number,
    @Param("treatmentId", ParseIntPipe) treatmentId: number,
    @Query("date") date?: string,
  ) {
    const effectiveDate = date ? new Date(date) : undefined;
    return this.clinicTreatmentPriceService.getEffectivePrice(
      clinicId,
      treatmentId,
      effectiveDate,
    );
  }
}
