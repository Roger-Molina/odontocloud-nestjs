import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreatePatientNotesTable1754364300000
  implements MigrationInterface
{
  name = "CreatePatientNotesTable1754364300000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "patient_notes",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "patient_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "content",
            type: "text",
            isNullable: false,
          },
          {
            name: "created_by",
            type: "int",
            isNullable: true,
          },
          {
            name: "clinic_id",
            type: "int",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP(6)",
            isNullable: false,
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP(6)",
            onUpdate: "CURRENT_TIMESTAMP(6)",
            isNullable: false,
          },
          {
            name: "deleted_at",
            type: "timestamp",
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Agregar foreign key para patient_id
    await queryRunner.createForeignKey(
      "patient_notes",
      new TableForeignKey({
        columnNames: ["patient_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "patients",
        onDelete: "CASCADE",
      }),
    );

    // Agregar foreign key para created_by (usuario)
    await queryRunner.createForeignKey(
      "patient_notes",
      new TableForeignKey({
        columnNames: ["created_by"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "SET NULL",
      }),
    );

    // Agregar foreign key para clinic_id
    await queryRunner.createForeignKey(
      "patient_notes",
      new TableForeignKey({
        columnNames: ["clinic_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "clinics",
        onDelete: "SET NULL",
      }),
    );

    // Crear índices para mejorar el rendimiento
    await queryRunner.query(`
      CREATE INDEX "IDX_patient_notes_patient_id" ON "patient_notes" ("patient_id");
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_patient_notes_created_by" ON "patient_notes" ("created_by");
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_patient_notes_clinic_id" ON "patient_notes" ("clinic_id");
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_patient_notes_created_at" ON "patient_notes" ("created_at");
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_patient_notes_updated_at" ON "patient_notes" ("updated_at");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar índices
    await queryRunner.query(`DROP INDEX "IDX_patient_notes_updated_at"`);
    await queryRunner.query(`DROP INDEX "IDX_patient_notes_created_at"`);
    await queryRunner.query(`DROP INDEX "IDX_patient_notes_clinic_id"`);
    await queryRunner.query(`DROP INDEX "IDX_patient_notes_created_by"`);
    await queryRunner.query(`DROP INDEX "IDX_patient_notes_patient_id"`);

    // Eliminar tabla
    await queryRunner.dropTable("patient_notes");
  }
}
