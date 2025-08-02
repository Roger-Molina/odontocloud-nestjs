import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUniqueDocumentNumberClinicIdToPatient1699999999999
  implements MigrationInterface
{
  name = "AddUniqueDocumentNumberClinicIdToPatient1699999999999";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Remove unique constraint from document_number if exists
    await queryRunner.query(
      `ALTER TABLE "patients" DROP CONSTRAINT IF EXISTS "UQ_document_number"`,
    );
    // Add unique constraint for (document_number, clinic_id)
    await queryRunner.query(
      `ALTER TABLE "patients" ADD CONSTRAINT "UQ_document_number_clinic_id" UNIQUE ("document_number", "clinic_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove the composite unique constraint
    await queryRunner.query(
      `ALTER TABLE "patients" DROP CONSTRAINT IF EXISTS "UQ_document_number_clinic_id"`,
    );
    // Restore unique constraint on document_number
    await queryRunner.query(
      `ALTER TABLE "patients" ADD CONSTRAINT "UQ_document_number" UNIQUE ("document_number")`,
    );
  }
}
