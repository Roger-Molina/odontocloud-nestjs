import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClinicsService } from "./clinics.service";
import { ClinicsController } from "./clinics.controller";
import { Clinic } from "./entities/clinic.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Clinic])],
  providers: [ClinicsService],
  controllers: [ClinicsController],
  exports: [ClinicsService],
})
export class ClinicsModule {}
