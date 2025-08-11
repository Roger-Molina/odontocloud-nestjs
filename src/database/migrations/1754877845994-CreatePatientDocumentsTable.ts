import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePatientDocumentsTable1754877845994
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "patient_documents" (
        "id" SERIAL NOT NULL,
        "originalName" character varying NOT NULL,
        "fileName" character varying NOT NULL,
        "filePath" character varying NOT NULL,
        "mimeType" character varying NOT NULL,
        "size" integer NOT NULL,
        "category" character varying NOT NULL DEFAULT 'other',
        "description" character varying,
        "uploadedBy" character varying,
        "uploadedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "patientId" integer NOT NULL,
        CONSTRAINT "PK_patient_documents" PRIMARY KEY ("id"),
        CONSTRAINT "FK_patient_documents_patient" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_patient_documents_patient" ON "patient_documents" ("patientId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_patient_documents_category" ON "patient_documents" ("category")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_patient_documents_category"`);
    await queryRunner.query(`DROP INDEX "IDX_patient_documents_patient"`);
    await queryRunner.query(`DROP TABLE "patient_documents"`);
  }
}
