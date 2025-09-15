import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePatientOptionalIdentificationAndObservations1754364500000
  implements MigrationInterface
{
  name = "UpdatePatientOptionalIdentificationAndObservations1754364500000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Hacer nullable las columnas de identificación
    await queryRunner.query(
      `ALTER TABLE \`patients\` MODIFY COLUMN \`document_type_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`patients\` MODIFY COLUMN \`document_number\` varchar(255) NULL`,
    );

    // Agregar columna de observaciones
    await queryRunner.query(
      `ALTER TABLE \`patients\` ADD \`observations\` text NULL COMMENT 'Observaciones generales del paciente'`,
    );

    // Actualizar foreign key constraint para document_type_id para permitir NULL
    await queryRunner.query(
      `ALTER TABLE \`patients\` DROP FOREIGN KEY IF EXISTS \`FK_patients_document_type_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`patients\` ADD CONSTRAINT \`FK_patients_document_type_id\` FOREIGN KEY (\`document_type_id\`) REFERENCES \`document_types\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover columna de observaciones
    await queryRunner.query(
      `ALTER TABLE \`patients\` DROP COLUMN \`observations\``,
    );

    // Restaurar foreign key constraint original
    await queryRunner.query(
      `ALTER TABLE \`patients\` DROP FOREIGN KEY \`FK_patients_document_type_id\``,
    );

    // Para el rollback, necesitamos manejar los casos donde document_type_id o document_number sean NULL
    // Primero, actualizamos los valores NULL a valores por defecto temporales
    await queryRunner.query(
      `UPDATE \`patients\` SET \`document_type_id\` = 1 WHERE \`document_type_id\` IS NULL`,
    );
    await queryRunner.query(
      `UPDATE \`patients\` SET \`document_number\` = 'SIN_DOCUMENTO' WHERE \`document_number\` IS NULL`,
    );

    // Luego hacemos las columnas NOT NULL nuevamente
    await queryRunner.query(
      `ALTER TABLE \`patients\` MODIFY COLUMN \`document_number\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`patients\` MODIFY COLUMN \`document_type_id\` int NOT NULL`,
    );

    // Restaurar foreign key constraint original
    await queryRunner.query(
      `ALTER TABLE \`patients\` ADD CONSTRAINT \`FK_patients_document_type_id\` FOREIGN KEY (\`document_type_id\`) REFERENCES \`document_types\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
