import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSynchronizationFields1754370001000
  implements MigrationInterface
{
  name = "AddSynchronizationFields1754370001000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Agregar campos a tooth_records para sincronización
    await queryRunner.query(`
            ALTER TABLE "tooth_records" 
            ADD COLUMN "treatment_id" integer,
            ADD COLUMN "budget_item_id" integer,
            ADD COLUMN "invoice_item_id" integer,
            ADD COLUMN "treatment_status" VARCHAR NOT NULL DEFAULT 'pending',
            ADD COLUMN "treatment_start_date" date,
            ADD COLUMN "treatment_completion_date" date,
            ADD COLUMN "actual_cost" decimal(10,2),
            ADD COLUMN "is_billable" boolean NOT NULL DEFAULT true,
            ADD COLUMN "billing_notes" text
        `);

    // Agregar constraint para treatment_status
    await queryRunner.query(`
            ALTER TABLE "tooth_records" 
            ADD CONSTRAINT "CHK_treatment_status" 
            CHECK ("treatment_status" IN ('pending', 'in_progress', 'completed', 'cancelled'))
        `);

    // Agregar campos a budget_items para sincronización
    await queryRunner.query(`
            ALTER TABLE "budget_items" 
            ADD COLUMN "tooth_numbers" json,
            ADD COLUMN "tooth_surfaces" json,
            ADD COLUMN "odontogram_tooth_record_id" integer,
            ADD COLUMN "clinic_treatment_price_id" integer,
            ADD COLUMN "sessions_required" integer NOT NULL DEFAULT 1,
            ADD COLUMN "sessions_completed" integer NOT NULL DEFAULT 0,
            ADD COLUMN "estimated_duration_minutes" integer,
            ADD COLUMN "priority_level" integer NOT NULL DEFAULT 1,
            ADD COLUMN "requires_anesthesia" boolean NOT NULL DEFAULT false,
            ADD COLUMN "treatment_notes" text
        `);

    // Agregar constraint para priority_level
    await queryRunner.query(`
            ALTER TABLE "budget_items" 
            ADD CONSTRAINT "CHK_priority_level" 
            CHECK ("priority_level" IN (1, 2, 3, 4))
        `);

    // Agregar campos a invoice_items para sincronización
    await queryRunner.query(`
            ALTER TABLE "invoice_items" 
            ADD COLUMN "tooth_surfaces" json,
            ADD COLUMN "budget_item_id" integer,
            ADD COLUMN "odontogram_tooth_record_id" integer,
            ADD COLUMN "clinic_treatment_price_id" integer,
            ADD COLUMN "sessions_billed" integer NOT NULL DEFAULT 1,
            ADD COLUMN "actual_duration_minutes" integer,
            ADD COLUMN "treatment_completion_date" date,
            ADD COLUMN "anesthesia_used" boolean NOT NULL DEFAULT false,
            ADD COLUMN "anesthesia_cost" decimal(10,2),
            ADD COLUMN "material_cost" decimal(10,2)
        `);

    // Agregar Foreign Keys
    await queryRunner.query(`
            ALTER TABLE "tooth_records" 
            ADD CONSTRAINT "FK_tooth_records_treatment" 
            FOREIGN KEY ("treatment_id") REFERENCES "treatments"("id") ON DELETE SET NULL
        `);

    await queryRunner.query(`
            ALTER TABLE "budget_items" 
            ADD CONSTRAINT "FK_budget_items_clinic_treatment_price" 
            FOREIGN KEY ("clinic_treatment_price_id") REFERENCES "clinic_treatment_prices"("id") ON DELETE SET NULL
        `);

    await queryRunner.query(`
            ALTER TABLE "invoice_items" 
            ADD CONSTRAINT "FK_invoice_items_budget_item" 
            FOREIGN KEY ("budget_item_id") REFERENCES "budget_items"("id") ON DELETE SET NULL
        `);

    await queryRunner.query(`
            ALTER TABLE "invoice_items" 
            ADD CONSTRAINT "FK_invoice_items_clinic_treatment_price" 
            FOREIGN KEY ("clinic_treatment_price_id") REFERENCES "clinic_treatment_prices"("id") ON DELETE SET NULL
        `);

    // Índices para mejorar performance
    await queryRunner.query(`
            CREATE INDEX "IDX_tooth_records_treatment" ON "tooth_records" ("treatment_id")
        `);

    await queryRunner.query(`
            CREATE INDEX "IDX_tooth_records_treatment_status" ON "tooth_records" ("treatment_status")
        `);

    await queryRunner.query(`
            CREATE INDEX "IDX_budget_items_clinic_treatment_price" ON "budget_items" ("clinic_treatment_price_id")
        `);

    await queryRunner.query(`
            CREATE INDEX "IDX_invoice_items_budget_item" ON "invoice_items" ("budget_item_id")
        `);

    // Comentarios para documentar los nuevos campos
    await queryRunner.query(`
            COMMENT ON COLUMN "tooth_records"."treatment_status" IS 'Estado del tratamiento: pending, in_progress, completed, cancelled'
        `);

    await queryRunner.query(`
            COMMENT ON COLUMN "tooth_records"."actual_cost" IS 'Costo real del tratamiento realizado'
        `);

    await queryRunner.query(`
            COMMENT ON COLUMN "tooth_records"."is_billable" IS 'Si este registro puede ser facturado'
        `);

    await queryRunner.query(`
            COMMENT ON COLUMN "budget_items"."priority_level" IS '1=Baja, 2=Media, 3=Alta, 4=Urgente'
        `);

    await queryRunner.query(`
            COMMENT ON COLUMN "budget_items"."sessions_required" IS 'Número de sesiones requeridas para este tratamiento'
        `);

    await queryRunner.query(`
            COMMENT ON COLUMN "invoice_items"."sessions_billed" IS 'Número de sesiones facturadas'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar índices
    await queryRunner.query(`DROP INDEX "IDX_invoice_items_budget_item"`);
    await queryRunner.query(
      `DROP INDEX "IDX_budget_items_clinic_treatment_price"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_tooth_records_treatment_status"`);
    await queryRunner.query(`DROP INDEX "IDX_tooth_records_treatment"`);

    // Eliminar Foreign Keys
    await queryRunner.query(
      `ALTER TABLE "invoice_items" DROP CONSTRAINT "FK_invoice_items_clinic_treatment_price"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice_items" DROP CONSTRAINT "FK_invoice_items_budget_item"`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget_items" DROP CONSTRAINT "FK_budget_items_clinic_treatment_price"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tooth_records" DROP CONSTRAINT "FK_tooth_records_treatment"`,
    );

    // Eliminar constraints
    await queryRunner.query(
      `ALTER TABLE "budget_items" DROP CONSTRAINT "CHK_priority_level"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tooth_records" DROP CONSTRAINT "CHK_treatment_status"`,
    );

    // Eliminar columnas de invoice_items
    await queryRunner.query(`
            ALTER TABLE "invoice_items" 
            DROP COLUMN "material_cost",
            DROP COLUMN "anesthesia_cost",
            DROP COLUMN "anesthesia_used",
            DROP COLUMN "treatment_completion_date",
            DROP COLUMN "actual_duration_minutes",
            DROP COLUMN "sessions_billed",
            DROP COLUMN "clinic_treatment_price_id",
            DROP COLUMN "odontogram_tooth_record_id",
            DROP COLUMN "budget_item_id",
            DROP COLUMN "tooth_surfaces"
        `);

    // Eliminar columnas de budget_items
    await queryRunner.query(`
            ALTER TABLE "budget_items" 
            DROP COLUMN "treatment_notes",
            DROP COLUMN "requires_anesthesia",
            DROP COLUMN "priority_level",
            DROP COLUMN "estimated_duration_minutes",
            DROP COLUMN "sessions_completed",
            DROP COLUMN "sessions_required",
            DROP COLUMN "clinic_treatment_price_id",
            DROP COLUMN "odontogram_tooth_record_id",
            DROP COLUMN "tooth_surfaces",
            DROP COLUMN "tooth_numbers"
        `);

    // Eliminar columnas de tooth_records
    await queryRunner.query(`
            ALTER TABLE "tooth_records" 
            DROP COLUMN "billing_notes",
            DROP COLUMN "is_billable",
            DROP COLUMN "actual_cost",
            DROP COLUMN "treatment_completion_date",
            DROP COLUMN "treatment_start_date",
            DROP COLUMN "treatment_status",
            DROP COLUMN "invoice_item_id",
            DROP COLUMN "budget_item_id",
            DROP COLUMN "treatment_id"
        `);
  }
}
