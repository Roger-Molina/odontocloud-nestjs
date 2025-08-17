import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddMedicalAlertsToPatients1757840000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "patients",
      new TableColumn({
        name: "medical_alerts",
        type: "text",
        isNullable: true,
        comment: "Alertas médicas importantes del paciente",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("patients", "medical_alerts");
  }
}
