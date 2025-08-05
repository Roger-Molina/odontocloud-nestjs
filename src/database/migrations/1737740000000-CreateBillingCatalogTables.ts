import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateBillingCatalogTables1737740000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create invoice_statuses table
    await queryRunner.createTable(
      new Table({
        name: "invoice_statuses",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "code",
            type: "varchar",
            length: "50",
            isUnique: true,
          },
          {
            name: "name",
            type: "varchar",
            length: "100",
          },
          {
            name: "description",
            type: "text",
            isNullable: true,
          },
          {
            name: "color_hex",
            type: "varchar",
            length: "7",
            default: "'#6c757d'",
          },
          {
            name: "is_active",
            type: "boolean",
            default: true,
          },
          {
            name: "display_order",
            type: "int",
            default: 0,
          },
          {
            name: "is_final",
            type: "boolean",
            default: false,
          },
          {
            name: "requires_payment",
            type: "boolean",
            default: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
          },
          {
            name: "deleted_at",
            type: "timestamp",
            isNullable: true,
          },
        ],
      }),
    );

    // Create payment_methods table
    await queryRunner.createTable(
      new Table({
        name: "payment_methods",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "code",
            type: "varchar",
            length: "50",
            isUnique: true,
          },
          {
            name: "name",
            type: "varchar",
            length: "100",
          },
          {
            name: "description",
            type: "text",
            isNullable: true,
          },
          {
            name: "is_active",
            type: "boolean",
            default: true,
          },
          {
            name: "display_order",
            type: "int",
            default: 0,
          },
          {
            name: "requires_authorization",
            type: "boolean",
            default: false,
          },
          {
            name: "requires_reference",
            type: "boolean",
            default: false,
          },
          {
            name: "processing_fee_percentage",
            type: "decimal",
            precision: 5,
            scale: 2,
            default: 0,
          },
          {
            name: "processing_fee_fixed",
            type: "decimal",
            precision: 10,
            scale: 2,
            default: 0,
          },
          {
            name: "icon_class",
            type: "varchar",
            length: "100",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
          },
          {
            name: "deleted_at",
            type: "timestamp",
            isNullable: true,
          },
        ],
      }),
    );

    // Create invoice_types table
    await queryRunner.createTable(
      new Table({
        name: "invoice_types",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "code",
            type: "varchar",
            length: "50",
            isUnique: true,
          },
          {
            name: "name",
            type: "varchar",
            length: "100",
          },
          {
            name: "description",
            type: "text",
            isNullable: true,
          },
          {
            name: "is_active",
            type: "boolean",
            default: true,
          },
          {
            name: "display_order",
            type: "int",
            default: 0,
          },
          {
            name: "default_tax_rate",
            type: "decimal",
            precision: 5,
            scale: 2,
            default: 19.0,
          },
          {
            name: "requires_appointment",
            type: "boolean",
            default: true,
          },
          {
            name: "color_hex",
            type: "varchar",
            length: "7",
            default: "'#007bff'",
          },
          {
            name: "icon_class",
            type: "varchar",
            length: "100",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
          },
          {
            name: "deleted_at",
            type: "timestamp",
            isNullable: true,
          },
        ],
      }),
    );

    // Create payment_statuses table
    await queryRunner.createTable(
      new Table({
        name: "payment_statuses",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "code",
            type: "varchar",
            length: "50",
            isUnique: true,
          },
          {
            name: "name",
            type: "varchar",
            length: "100",
          },
          {
            name: "description",
            type: "text",
            isNullable: true,
          },
          {
            name: "is_active",
            type: "boolean",
            default: true,
          },
          {
            name: "display_order",
            type: "int",
            default: 0,
          },
          {
            name: "color_hex",
            type: "varchar",
            length: "7",
            default: "'#28a745'",
          },
          {
            name: "is_final",
            type: "boolean",
            default: false,
          },
          {
            name: "allows_refund",
            type: "boolean",
            default: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
          },
          {
            name: "deleted_at",
            type: "timestamp",
            isNullable: true,
          },
        ],
      }),
    );

    // Create discount_types table
    await queryRunner.createTable(
      new Table({
        name: "discount_types",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "code",
            type: "varchar",
            length: "50",
            isUnique: true,
          },
          {
            name: "name",
            type: "varchar",
            length: "100",
          },
          {
            name: "description",
            type: "text",
            isNullable: true,
          },
          {
            name: "is_active",
            type: "boolean",
            default: true,
          },
          {
            name: "display_order",
            type: "int",
            default: 0,
          },
          {
            name: "is_percentage",
            type: "boolean",
            default: true,
          },
          {
            name: "max_discount_percentage",
            type: "decimal",
            precision: 5,
            scale: 2,
            isNullable: true,
          },
          {
            name: "max_discount_amount",
            type: "decimal",
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: "requires_approval",
            type: "boolean",
            default: false,
          },
          {
            name: "icon_class",
            type: "varchar",
            length: "100",
            isNullable: true,
          },
          {
            name: "color_hex",
            type: "varchar",
            length: "7",
            default: "'#ffc107'",
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
          },
          {
            name: "deleted_at",
            type: "timestamp",
            isNullable: true,
          },
        ],
      }),
    );

    // Create expenses table
    await queryRunner.createTable(
      new Table({
        name: "expenses",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "expense_number",
            type: "varchar",
            length: "100",
            isUnique: true,
          },
          {
            name: "expense_date",
            type: "date",
          },
          {
            name: "description",
            type: "varchar",
            length: "200",
          },
          {
            name: "amount",
            type: "decimal",
            precision: 10,
            scale: 2,
          },
          {
            name: "category",
            type: "enum",
            enum: [
              "medical_supplies",
              "equipment",
              "utilities",
              "rent",
              "salaries",
              "marketing",
              "maintenance",
              "insurance",
              "taxes",
              "other",
            ],
          },
          {
            name: "status",
            type: "enum",
            enum: ["pending", "approved", "paid", "rejected", "cancelled"],
            default: "'pending'",
          },
          {
            name: "supplier_name",
            type: "varchar",
            length: "200",
            isNullable: true,
          },
          {
            name: "invoice_reference",
            type: "varchar",
            length: "100",
            isNullable: true,
          },
          {
            name: "receipt_url",
            type: "varchar",
            length: "500",
            isNullable: true,
          },
          {
            name: "notes",
            type: "text",
            isNullable: true,
          },
          {
            name: "is_recurring",
            type: "boolean",
            default: false,
          },
          {
            name: "recurring_frequency",
            type: "varchar",
            length: "50",
            isNullable: true,
          },
          {
            name: "next_occurrence",
            type: "date",
            isNullable: true,
          },
          {
            name: "payment_method",
            type: "varchar",
            length: "100",
            isNullable: true,
          },
          {
            name: "approved_by",
            type: "varchar",
            length: "200",
            isNullable: true,
          },
          {
            name: "approved_at",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "paid_at",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "clinic_id",
            type: "int",
          },
          {
            name: "doctor_id",
            type: "int",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
          },
          {
            name: "deleted_at",
            type: "timestamp",
            isNullable: true,
          },
        ],
      }),
    );

    // Add foreign keys for expenses table
    await queryRunner.createForeignKey(
      "expenses",
      new TableForeignKey({
        columnNames: ["clinic_id"],
        referencedTableName: "clinics",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );

    await queryRunner.createForeignKey(
      "expenses",
      new TableForeignKey({
        columnNames: ["doctor_id"],
        referencedTableName: "doctors",
        referencedColumnNames: ["id"],
        onDelete: "SET NULL",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys first
    const expensesTable = await queryRunner.getTable("expenses");
    if (expensesTable) {
      const foreignKeys = expensesTable.foreignKeys;
      for (const fk of foreignKeys) {
        await queryRunner.dropForeignKey("expenses", fk);
      }
    }

    // Drop tables
    await queryRunner.dropTable("expenses", true);
    await queryRunner.dropTable("discount_types", true);
    await queryRunner.dropTable("payment_statuses", true);
    await queryRunner.dropTable("invoice_types", true);
    await queryRunner.dropTable("payment_methods", true);
    await queryRunner.dropTable("invoice_statuses", true);
  }
}
