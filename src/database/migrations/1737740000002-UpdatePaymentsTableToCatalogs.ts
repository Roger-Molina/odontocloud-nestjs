import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class UpdatePaymentsTableToCatalogs1737740000002
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Remove old enum columns
    await queryRunner.dropColumn("payments", "payment_method");
    await queryRunner.dropColumn("payments", "status");

    // Add new foreign key columns
    await queryRunner.addColumn(
      "payments",
      new TableColumn({
        name: "payment_method_id",
        type: "int",
      }),
    );

    await queryRunner.addColumn(
      "payments",
      new TableColumn({
        name: "status_id",
        type: "int",
      }),
    );

    // Add foreign keys
    await queryRunner.createForeignKey(
      "payments",
      new TableForeignKey({
        columnNames: ["payment_method_id"],
        referencedTableName: "payment_methods",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
      }),
    );

    await queryRunner.createForeignKey(
      "payments",
      new TableForeignKey({
        columnNames: ["status_id"],
        referencedTableName: "payment_statuses",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys
    const paymentsTable = await queryRunner.getTable("payments");
    if (paymentsTable) {
      const foreignKeys = paymentsTable.foreignKeys.filter(
        (fk) =>
          fk.columnNames.includes("payment_method_id") ||
          fk.columnNames.includes("status_id"),
      );

      for (const fk of foreignKeys) {
        await queryRunner.dropForeignKey("payments", fk);
      }
    }

    // Remove new columns
    await queryRunner.dropColumn("payments", "status_id");
    await queryRunner.dropColumn("payments", "payment_method_id");

    // Restore old enum columns
    await queryRunner.addColumn(
      "payments",
      new TableColumn({
        name: "payment_method",
        type: "enum",
        enum: [
          "cash",
          "card",
          "transfer",
          "check",
          "insurance",
          "installments",
        ],
      }),
    );

    await queryRunner.addColumn(
      "payments",
      new TableColumn({
        name: "status",
        type: "enum",
        enum: ["pending", "completed", "failed", "refunded"],
        default: "'pending'",
      }),
    );
  }
}
