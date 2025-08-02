import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DoctorsService } from "./doctors.service";
import { DoctorsController } from "./doctors.controller";
import { Doctor } from "./entities/doctor.entity";
import { Specialty } from "./entities/specialty.entity";
import { User } from "../users/entities/user.entity";
import { SpecialtiesModule } from "./specialties.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Doctor, Specialty, User]),
    SpecialtiesModule,
  ],
  providers: [DoctorsService],
  controllers: [DoctorsController],
  exports: [DoctorsService],
})
export class DoctorsModule {}
