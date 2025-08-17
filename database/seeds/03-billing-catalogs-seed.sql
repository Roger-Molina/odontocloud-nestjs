-- =====================================================
-- SEED DATA PARA ESTADOS DE FACTURA
-- =====================================================
-- Estados básicos para el sistema de facturación

-- DELETE FROM invoice_statuses;

INSERT INTO invoice_statuses (code, name, description, is_active, display_order, created_at, updated_at) VALUES
('DRAFT', 'Borrador', 'Factura en proceso de creación', true, 1, NOW(), NOW()),
('PENDING', 'Pendiente', 'Factura emitida, pendiente de pago', true, 2, NOW(), NOW()),
('PARTIAL', 'Pago Parcial', 'Factura con pago parcial recibido', true, 3, NOW(), NOW()),
('PAID', 'Pagada', 'Factura completamente pagada', true, 4, NOW(), NOW()),
('OVERDUE', 'Vencida', 'Factura con pago vencido', true, 5, NOW(), NOW()),
('CANCELLED', 'Cancelada', 'Factura anulada o cancelada', true, 6, NOW(), NOW()),
('REFUNDED', 'Reembolsada', 'Factura con reembolso procesado', true, 7, NOW(), NOW());

-- =====================================================
-- SEED DATA PARA TIPOS DE FACTURA
-- =====================================================

-- DELETE FROM invoice_types;

INSERT INTO invoice_types (code, name, description, is_active, display_order, created_at, updated_at) VALUES
('TREATMENT', 'Tratamiento', 'Factura por servicios de tratamiento dental', true, 1, NOW(), NOW()),
('CONSULTATION', 'Consulta', 'Factura por consultas y evaluaciones', true, 2, NOW(), NOW()),
('EMERGENCY', 'Emergencia', 'Factura por atención de emergencia', true, 3, NOW(), NOW()),
('PREVENTION', 'Prevención', 'Factura por servicios preventivos', true, 4, NOW(), NOW()),
('ORTHODONTICS', 'Ortodoncia', 'Factura por tratamientos ortodónticos', true, 5, NOW(), NOW()),
('SURGERY', 'Cirugía', 'Factura por procedimientos quirúrgicos', true, 6, NOW(), NOW()),
('PROSTHETICS', 'Prótesis', 'Factura por servicios protésicos', true, 7, NOW(), NOW()),
('LABORATORY', 'Laboratorio', 'Factura por servicios de laboratorio', true, 8, NOW(), NOW());

-- =====================================================
-- SEED DATA PARA ESTADOS DE PAGO
-- =====================================================

-- DELETE FROM payment_statuses;

INSERT INTO payment_statuses (code, name, description, is_active, display_order, created_at, updated_at) VALUES
('PENDING', 'Pendiente', 'Pago programado pero no procesado', true, 1, NOW(), NOW()),
('PROCESSING', 'Procesando', 'Pago en proceso de verificación', true, 2, NOW(), NOW()),
('COMPLETED', 'Completado', 'Pago exitosamente procesado', true, 3, NOW(), NOW()),
('FAILED', 'Fallido', 'Pago rechazado o fallido', true, 4, NOW(), NOW()),
('CANCELLED', 'Cancelado', 'Pago cancelado por el usuario', true, 5, NOW(), NOW()),
('REFUNDED', 'Reembolsado', 'Pago devuelto al paciente', true, 6, NOW(), NOW()),
('DISPUTED', 'Disputado', 'Pago en disputa o reclamo', true, 7, NOW(), NOW());

-- =====================================================
-- SEED DATA PARA TIPOS DE DESCUENTO
-- =====================================================

-- DELETE FROM discount_type;

INSERT INTO discount_type (code, name, description, is_percentage, max_amount, is_active, display_order, created_at, updated_at) VALUES
('SENIOR', 'Adulto Mayor', 'Descuento para pacientes de tercera edad', true, 15.00, true, 1, NOW(), NOW()),
('STUDENT', 'Estudiante', 'Descuento para estudiantes con credencial válida', true, 10.00, true, 2, NOW(), NOW()),
('EMPLOYEE', 'Empleado', 'Descuento para empleados de la clínica', true, 20.00, true, 3, NOW(), NOW()),
('FAMILY', 'Familiar', 'Descuento familiar para múltiples tratamientos', true, 12.00, true, 4, NOW(), NOW()),
('LOYALTY', 'Cliente Frecuente', 'Descuento por lealtad del cliente', true, 8.00, true, 5, NOW(), NOW()),
('EARLY_PAYMENT', 'Pago Anticipado', 'Descuento por pago antes del vencimiento', false, 50.00, true, 6, NOW(), NOW()),
('BULK_TREATMENT', 'Tratamiento Múltiple', 'Descuento por múltiples tratamientos', true, 18.00, true, 7, NOW(), NOW()),
('REFERRAL', 'Referido', 'Descuento por referir nuevos pacientes', false, 100.00, true, 8, NOW(), NOW()),
('SEASONAL', 'Promocional', 'Descuentos estacionales o promocionales', true, 25.00, true, 9, NOW(), NOW());

-- Verificar inserción
SELECT 'invoice_statuses' as tabla, COUNT(*) as total FROM invoice_statuses
UNION ALL
SELECT 'invoice_types' as tabla, COUNT(*) as total FROM invoice_types
UNION ALL
SELECT 'payment_statuses' as tabla, COUNT(*) as total FROM payment_statuses
UNION ALL
SELECT 'discount_types' as tabla, COUNT(*) as total FROM discount_types;
