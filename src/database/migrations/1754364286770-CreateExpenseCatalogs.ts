import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateExpenseCatalogs1754364286770 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create expense_categories table
        await queryRunner.query(`
            CREATE TABLE "expense_categories" (
                "id" SERIAL NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "code" character varying(50) NOT NULL,
                "name" character varying(100) NOT NULL,
                "description" text,
                "is_active" boolean NOT NULL DEFAULT true,
                "display_order" integer NOT NULL DEFAULT '0',
                "is_deductible" boolean NOT NULL DEFAULT false,
                "requires_receipt" boolean NOT NULL DEFAULT false,
                "max_amount" numeric(10,2),
                "requires_approval" boolean NOT NULL DEFAULT false,
                "icon_class" character varying,
                "color_hex" character varying(7) NOT NULL DEFAULT '#6c757d',
                CONSTRAINT "PK_expense_categories" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_expense_categories_code" UNIQUE ("code")
            )
        `);

        // Create expense_statuses table
        await queryRunner.query(`
            CREATE TABLE "expense_statuses" (
                "id" SERIAL NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "code" character varying(50) NOT NULL,
                "name" character varying(100) NOT NULL,
                "description" text,
                "color_hex" character varying(7) NOT NULL DEFAULT '#6c757d',
                "is_active" boolean NOT NULL DEFAULT true,
                "display_order" integer NOT NULL DEFAULT '0',
                "is_final" boolean NOT NULL DEFAULT false,
                "requires_approval" boolean NOT NULL DEFAULT false,
                "can_edit" boolean NOT NULL DEFAULT true,
                "can_delete" boolean NOT NULL DEFAULT true,
                CONSTRAINT "PK_expense_statuses" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_expense_statuses_code" UNIQUE ("code")
            )
        `);

        // Add foreign key columns to expenses table
        await queryRunner.query(`
            ALTER TABLE "expenses" 
            ADD COLUMN "expense_category_id" integer NOT NULL DEFAULT 1,
            ADD COLUMN "expense_status_id" integer NOT NULL DEFAULT 1
        `);

        // Remove old enum columns
        await queryRunner.query(`
            ALTER TABLE "expenses" 
            DROP COLUMN "category",
            DROP COLUMN "status"
        `);

        // Add foreign key constraints
        await queryRunner.query(`
            ALTER TABLE "expenses" 
            ADD CONSTRAINT "FK_expenses_expense_category" 
            FOREIGN KEY ("expense_category_id") REFERENCES "expense_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE
        `);

        await queryRunner.query(`
            ALTER TABLE "expenses" 
            ADD CONSTRAINT "FK_expenses_expense_status" 
            FOREIGN KEY ("expense_status_id") REFERENCES "expense_statuses"("id") ON DELETE RESTRICT ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove foreign key constraints
        await queryRunner.query(`ALTER TABLE "expenses" DROP CONSTRAINT "FK_expenses_expense_status"`);
        await queryRunner.query(`ALTER TABLE "expenses" DROP CONSTRAINT "FK_expenses_expense_category"`);

        // Add back old enum columns
        await queryRunner.query(`
            ALTER TABLE "expenses" 
            ADD COLUMN "category" character varying(100) NOT NULL DEFAULT 'general',
            ADD COLUMN "status" character varying(50) NOT NULL DEFAULT 'pending'
        `);

        // Remove foreign key columns
        await queryRunner.query(`
            ALTER TABLE "expenses" 
            DROP COLUMN "expense_status_id",
            DROP COLUMN "expense_category_id"
        `);

        // Drop catalog tables
        await queryRunner.query(`DROP TABLE "expense_statuses"`);
        await queryRunner.query(`DROP TABLE "expense_categories"`);
    }

}
