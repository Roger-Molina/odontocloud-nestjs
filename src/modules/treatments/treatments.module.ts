import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Treatment } from "./entities/treatment.entity";
import { TreatmentsService } from "./treatments.service";
import { TreatmentsController } from "./treatments.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Treatment])],
  providers: [TreatmentsService],
  controllers: [TreatmentsController],
  exports: [TreatmentsService],
})
export class TreatmentsModule {}
