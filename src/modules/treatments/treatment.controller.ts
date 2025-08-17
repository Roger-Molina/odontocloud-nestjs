import { Controller, Get, Query, Param, ParseIntPipe } from "@nestjs/common";
import { TreatmentService } from "./treatment.service";

@Controller("treatments")
export class TreatmentController {
  constructor(private readonly treatmentService: TreatmentService) {}

  @Get("active")
  findActive() {
    return this.treatmentService.findActive();
  }

  @Get("search")
  search(@Query("q") query: string) {
    return this.treatmentService.search(query || "");
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.treatmentService.findOne(id);
  }
}
