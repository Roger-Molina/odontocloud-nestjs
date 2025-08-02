import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OdontogramaService } from "./odontograma.service";
import { OdontogramaController } from "./odontograma.controller";
import { Odontogram, ToothRecord } from "./entities/odontogram.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Odontogram, ToothRecord])],
  providers: [OdontogramaService],
  controllers: [OdontogramaController],
  exports: [OdontogramaService],
})
export class OdontogramaModule {}
