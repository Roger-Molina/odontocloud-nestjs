import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class UpdateBillingTableToCatalogs1737740000001
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Remove old enum columns
    await queryRunner.dropColumn("billing", "status");
    await queryRunner.dropColumn("billing", "invoice_type");

    // Add new foreign key columns
    await queryRunner.addColumn(
      "billing",
      new TableColumn({
        name: "status_id",
        type: "int",
      }),
    );

    await queryRunner.addColumn(
      "billing",
      new TableColumn({
        name: "invoice_type_id",
        type: "int",
      }),
    );

    await queryRunner.addColumn(
      "billing",
      new TableColumn({
        name: "discount_type_id",
        type: "int",
        isNullable: true,
      }),
    );

    // Add foreign keys
    await queryRunner.createForeignKey(
      "billing",
      new TableForeignKey({
        columnNames: ["status_id"],
        referencedTableName: "invoice_statuses",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
      }),
    );

    await queryRunner.createForeignKey(
      "billing",
      new TableForeignKey({
        columnNames: ["invoice_type_id"],
        referencedTableName: "invoice_types",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
      }),
    );

    await queryRunner.createForeignKey(
      "billing",
      new TableForeignKey({
        columnNames: ["discount_type_id"],
        referencedTableName: "discount_types",
        referencedColumnNames: ["id"],
        onDelete: "SET NULL",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys
    const billingTable = await queryRunner.getTable("billing");
    if (billingTable) {
      const foreignKeys = billingTable.foreignKeys.filter(
        (fk) =>
          fk.columnNames.includes("status_id") ||
          fk.columnNames.includes("invoice_type_id") ||
          fk.columnNames.includes("discount_type_id"),
      );
      
      for (const fk of foreignKeys) {
        await queryRunner.dropForeignKey("billing", fk);
      }
    }

    // Remove new columns
    await queryRunner.dropColumn("billing", "discount_type_id");
    await queryRunner.dropColumn("billing", "invoice_type_id");
    await queryRunner.dropColumn("billing", "status_id");

    // Restore old enum columns
    await queryRunner.addColumn(
      "billing",
      new TableColumn({
        name: "status",
        type: "enum",
        enum: ["draft", "pending", "paid", "overdue", "cancelled"],
        default: "'draft'",
      }),
    );

    await queryRunner.addColumn(
      "billing",
      new TableColumn({
        name: "invoice_type",
        type: "enum",
        enum: ["invoice", "quote", "receipt"],
        default: "'invoice'",
      }),
    );
  }
}
