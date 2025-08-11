import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class CreatePatientDocumentsTable1754364400000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "patient_documents",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "original_name",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "file_name",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "file_path",
            type: "varchar",
            length: "500",
            isNullable: false,
          },
          {
            name: "mime_type",
            type: "varchar",
            length: "100",
            isNullable: false,
          },
          {
            name: "file_size",
            type: "bigint",
            isNullable: false,
          },
          {
            name: "category",
            type: "enum",
            enum: [
              "medical_history",
              "lab_results",
              "xrays",
              "prescriptions",
              "consent_forms",
              "insurance",
              "identification",
              "other",
            ],
            default: "'other'",
          },
          {
            name: "description",
            type: "text",
            isNullable: true,
          },
          {
            name: "uploaded_by",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "patient_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
        ],
        foreignKeys: [
          {
            columnNames: ["patient_id"],
            referencedTableName: "patients",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
          },
        ],
      }),
      true,
    );

    // Crear índices para mejorar performance
    await queryRunner.createIndex(
      "patient_documents",
      new TableIndex({
        name: "idx_patient_documents_patient_id",
        columnNames: ["patient_id"],
      }),
    );

    await queryRunner.createIndex(
      "patient_documents",
      new TableIndex({
        name: "idx_patient_documents_category",
        columnNames: ["category"],
      }),
    );

    await queryRunner.createIndex(
      "patient_documents",
      new TableIndex({
        name: "idx_patient_documents_created_at",
        columnNames: ["created_at"],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("patient_documents");
  }
}
