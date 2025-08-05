import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedCatalogTables1722808800000 implements MigrationInterface {
    name = 'SeedCatalogTables1722808800000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Seed Invoice Status
        await queryRunner.query(`
            INSERT INTO "invoice_statuses" ("code", "name", "description", "color_hex", "is_active", "display_order", "is_final", "requires_payment")
            VALUES 
                ('DRAFT', 'Borrador', 'Factura en borrador', '#6c757d', true, 1, false, false),
                ('PENDING', 'Pendiente', 'Factura pendiente de pago', '#ffc107', true, 2, false, true),
                ('PAID', 'Pagada', 'Factura completamente pagada', '#28a745', true, 3, true, false),
                ('PARTIALLY_PAID', 'Pago Parcial', 'Factura con pago parcial', '#fd7e14', true, 4, false, true),
                ('OVERDUE', 'Vencida', 'Factura vencida', '#dc3545', true, 5, false, true),
                ('CANCELLED', 'Cancelada', 'Factura cancelada', '#6c757d', true, 6, true, false),
                ('REFUNDED', 'Reembolsada', 'Factura reembolsada', '#17a2b8', true, 7, true, false)
            ON CONFLICT (code) DO NOTHING;
        `);

        // Seed Payment Methods
        await queryRunner.query(`
            INSERT INTO "payment_methods" ("code", "name", "description", "is_active", "display_order", "requires_authorization", "requires_reference")
            VALUES 
                ('CASH', 'Efectivo', 'Pago en efectivo', true, 1, false, false),
                ('CREDIT_CARD', 'Tarjeta de Crédito', 'Pago con tarjeta de crédito', true, 2, true, true),
                ('DEBIT_CARD', 'Tarjeta de Débito', 'Pago con tarjeta de débito', true, 3, true, true),
                ('BANK_TRANSFER', 'Transferencia Bancaria', 'Transferencia bancaria', true, 4, false, true),
                ('INSURANCE', 'Seguro', 'Pago por seguro médico', true, 5, false, false),
                ('CHECK', 'Cheque', 'Pago con cheque', true, 6, false, true),
                ('PAYMENT_PLAN', 'Plan de Pagos', 'Plan de pagos a plazos', true, 7, false, false),
                ('MIXED', 'Mixto', 'Combinación de métodos de pago', true, 8, false, false)
            ON CONFLICT (code) DO NOTHING;
        `);

        // Seed Invoice Types
        await queryRunner.query(`
            INSERT INTO "invoice_types" ("code", "name", "description", "is_active", "display_order", "default_tax_rate", "requires_appointment", "color_hex")
            VALUES 
                ('TREATMENT', 'Tratamiento', 'Factura por tratamiento dental', true, 1, 15.0, false, '#007bff'),
                ('CONSULTATION', 'Consulta', 'Factura por consulta dental', true, 2, 15.0, true, '#28a745'),
                ('EMERGENCY', 'Emergencia', 'Factura por atención de emergencia', true, 3, 15.0, false, '#dc3545'),
                ('PREVENTIVE', 'Preventivo', 'Factura por tratamiento preventivo', true, 4, 15.0, false, '#17a2b8'),
                ('AESTHETIC', 'Estético', 'Factura por tratamiento estético', true, 5, 15.0, false, '#fd7e14'),
                ('ORTHODONTICS', 'Ortodoncia', 'Factura por tratamiento ortodóntico', true, 6, 15.0, false, '#6f42c1'),
                ('SURGERY', 'Cirugía', 'Factura por cirugía dental', true, 7, 15.0, false, '#e83e8c')
            ON CONFLICT (code) DO NOTHING;
        `);

        // Seed Payment Status
        await queryRunner.query(`
            INSERT INTO "payment_statuses" ("code", "name", "description", "color_hex", "is_active", "display_order", "is_final")
            VALUES 
                ('PENDING', 'Pendiente', 'Pago pendiente', '#ffc107', true, 1, false),
                ('COMPLETED', 'Completado', 'Pago completado exitosamente', '#28a745', true, 2, true),
                ('FAILED', 'Fallido', 'Pago fallido', '#dc3545', true, 3, true),
                ('CANCELLED', 'Cancelado', 'Pago cancelado', '#6c757d', true, 4, true),
                ('REFUNDED', 'Reembolsado', 'Pago reembolsado', '#17a2b8', true, 5, true),
                ('PROCESSING', 'Procesando', 'Pago en proceso', '#fd7e14', true, 6, false)
            ON CONFLICT (code) DO NOTHING;
        `);

        // Seed Discount Types
        await queryRunner.query(`
            INSERT INTO "discount_types" ("code", "name", "description", "is_active", "display_order", "is_percentage", "max_value")
            VALUES 
                ('PERCENTAGE', 'Porcentaje', 'Descuento por porcentaje', true, 1, true, 50.0),
                ('FIXED_AMOUNT', 'Cantidad Fija', 'Descuento por cantidad fija', true, 2, false, null),
                ('SENIOR_DISCOUNT', 'Descuento Adulto Mayor', 'Descuento para adultos mayores', true, 3, true, 15.0),
                ('STUDENT_DISCOUNT', 'Descuento Estudiante', 'Descuento para estudiantes', true, 4, true, 10.0),
                ('INSURANCE_COPAY', 'Copago Seguro', 'Descuento por copago de seguro', true, 5, false, null),
                ('EMPLOYEE_DISCOUNT', 'Descuento Empleado', 'Descuento para empleados', true, 6, true, 20.0),
                ('PROMOTIONAL', 'Promocional', 'Descuento promocional', true, 7, true, 30.0)
            ON CONFLICT (code) DO NOTHING;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove seeded data
        await queryRunner.query(`DELETE FROM "discount_types" WHERE "code" IN ('PERCENTAGE', 'FIXED_AMOUNT', 'SENIOR_DISCOUNT', 'STUDENT_DISCOUNT', 'INSURANCE_COPAY', 'EMPLOYEE_DISCOUNT', 'PROMOTIONAL');`);
        await queryRunner.query(`DELETE FROM "payment_statuses" WHERE "code" IN ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED', 'PROCESSING');`);
        await queryRunner.query(`DELETE FROM "invoice_types" WHERE "code" IN ('TREATMENT', 'CONSULTATION', 'EMERGENCY', 'PREVENTIVE', 'AESTHETIC', 'ORTHODONTICS', 'SURGERY');`);
        await queryRunner.query(`DELETE FROM "payment_methods" WHERE "code" IN ('CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'INSURANCE', 'CHECK', 'PAYMENT_PLAN', 'MIXED');`);
        await queryRunner.query(`DELETE FROM "invoice_statuses" WHERE "code" IN ('DRAFT', 'PENDING', 'PAID', 'PARTIALLY_PAID', 'OVERDUE', 'CANCELLED', 'REFUNDED');`);
    }
}
