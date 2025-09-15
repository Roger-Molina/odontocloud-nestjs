import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateClinicTreatmentPriceTable1754370000000
  implements MigrationInterface
{
  name = "CreateClinicTreatmentPriceTable1754370000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "clinic_treatment_prices" (
                "id" SERIAL NOT NULL,
                "base_price" decimal(10,2) NOT NULL,
                "insurance_price" decimal(10,2),
                "promotional_price" decimal(10,2),
                "promotional_start_date" date,
                "promotional_end_date" date,
                "min_duration_minutes" integer,
                "max_duration_minutes" integer,
                "cost_per_session" decimal(10,2),
                "estimated_sessions" integer NOT NULL DEFAULT '1',
                "requires_anesthesia" boolean NOT NULL DEFAULT false,
                "anesthesia_cost" decimal(10,2),
                "material_cost" decimal(10,2),
                "is_active" boolean NOT NULL DEFAULT true,
                "effective_from" date NOT NULL,
                "effective_until" date,
                "notes" text,
                "clinic_id" integer NOT NULL,
                "treatment_id" integer NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_clinic_treatment" UNIQUE ("clinic_id", "treatment_id"),
                CONSTRAINT "PK_clinic_treatment_prices" PRIMARY KEY ("id")
            )
        `);

    await queryRunner.query(`
            CREATE INDEX "IDX_clinic_treatment_prices_clinic_treatment" 
            ON "clinic_treatment_prices" ("clinic_id", "treatment_id")
        `);

    await queryRunner.query(`
            ALTER TABLE "clinic_treatment_prices" 
            ADD CONSTRAINT "FK_clinic_treatment_prices_clinic" 
            FOREIGN KEY ("clinic_id") REFERENCES "clinics"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);

    await queryRunner.query(`
            ALTER TABLE "clinic_treatment_prices" 
            ADD CONSTRAINT "FK_clinic_treatment_prices_treatment" 
            FOREIGN KEY ("treatment_id") REFERENCES "treatments"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);

    // Comentarios para documentar la tabla
    await queryRunner.query(`
            COMMENT ON TABLE "clinic_treatment_prices" IS 'Precios de tratamientos específicos por clínica'
        `);

    await queryRunner.query(`
            COMMENT ON COLUMN "clinic_treatment_prices"."base_price" IS 'Precio base del tratamiento'
        `);

    await queryRunner.query(`
            COMMENT ON COLUMN "clinic_treatment_prices"."insurance_price" IS 'Precio para pacientes con seguro'
        `);

    await queryRunner.query(`
            COMMENT ON COLUMN "clinic_treatment_prices"."promotional_price" IS 'Precio promocional temporal'
        `);

    await queryRunner.query(`
            COMMENT ON COLUMN "clinic_treatment_prices"."estimated_sessions" IS 'Número estimado de sesiones requeridas'
        `);

    await queryRunner.query(`
            COMMENT ON COLUMN "clinic_treatment_prices"."requires_anesthesia" IS 'Si el tratamiento requiere anestesia'
        `);

    await queryRunner.query(`
            COMMENT ON COLUMN "clinic_treatment_prices"."is_active" IS 'Si el precio está activo para esta clínica'
        `);

    await queryRunner.query(`
            COMMENT ON COLUMN "clinic_treatment_prices"."effective_from" IS 'Fecha desde la cual este precio es efectivo'
        `);

    await queryRunner.query(`
            COMMENT ON COLUMN "clinic_treatment_prices"."effective_until" IS 'Fecha hasta la cual este precio es efectivo'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "clinic_treatment_prices" DROP CONSTRAINT "FK_clinic_treatment_prices_treatment"`,
    );
    await queryRunner.query(
      `ALTER TABLE "clinic_treatment_prices" DROP CONSTRAINT "FK_clinic_treatment_prices_clinic"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_clinic_treatment_prices_clinic_treatment"`,
    );
    await queryRunner.query(`DROP TABLE "clinic_treatment_prices"`);
  }
}
