import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RecordTypesService } from "./record-types.service";
import { RecordTypesController } from "./record-types.controller";
import { RecordType } from "./entities/record-type.entity";

@Module({
  imports: [TypeOrmModule.forFeature([RecordType])],
  controllers: [RecordTypesController],
  providers: [RecordTypesService],
  exports: [RecordTypesService],
})
export class RecordTypesModule {}
