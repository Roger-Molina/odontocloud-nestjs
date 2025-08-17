-- =====================================================
-- SEED DATA PARA CATEGORÍAS DE GASTOS
-- =====================================================

-- DELETE FROM expense_categories;

INSERT INTO expense_categories (code, name, description, is_active, display_order, created_at, updated_at) VALUES
('SUPPLIES', 'Insumos Médicos', 'Materiales y suministros para tratamientos dentales', true, 1, NOW(), NOW()),
('EQUIPMENT', 'Equipamiento', 'Compra y mantenimiento de equipos médicos', true, 2, NOW(), NOW()),
('LABORATORY', 'Laboratorio', 'Servicios externos de laboratorio dental', true, 3, NOW(), NOW()),
('STAFF', 'Personal', 'Salarios y beneficios del personal', true, 4, NOW(), NOW()),
('RENT', 'Alquiler', 'Renta de instalaciones y espacios', true, 5, NOW(), NOW()),
('UTILITIES', 'Servicios Básicos', 'Electricidad, agua, internet, teléfono', true, 6, NOW(), NOW()),
('MARKETING', 'Marketing', 'Publicidad y promoción de servicios', true, 7, NOW(), NOW()),
('TRAINING', 'Capacitación', 'Cursos y entrenamiento del personal', true, 8, NOW(), NOW()),
('INSURANCE', 'Seguros', 'Seguros médicos, de responsabilidad civil, etc.', true, 9, NOW(), NOW()),
('LEGAL', 'Legal y Contable', 'Servicios legales, contables y administrativos', true, 10, NOW(), NOW()),
('MAINTENANCE', 'Mantenimiento', 'Mantenimiento de instalaciones y equipos', true, 11, NOW(), NOW()),
('TRANSPORT', 'Transporte', 'Gastos de transporte y combustible', true, 12, NOW(), NOW()),
('TECHNOLOGY', 'Tecnología', 'Software, licencias y servicios tecnológicos', true, 13, NOW(), NOW()),
('OTHER', 'Otros', 'Gastos diversos no categorizados', true, 14, NOW(), NOW());

-- =====================================================
-- SEED DATA PARA ESTADOS DE GASTOS
-- =====================================================

-- DELETE FROM expense_statuses;

INSERT INTO expense_statuses (code, name, description, is_active, display_order, created_at, updated_at) VALUES
('PENDING', 'Pendiente', 'Gasto registrado, pendiente de aprobación', true, 1, NOW(), NOW()),
('APPROVED', 'Aprobado', 'Gasto aprobado para pago', true, 2, NOW(), NOW()),
('PAID', 'Pagado', 'Gasto completamente pagado', true, 3, NOW(), NOW()),
('REJECTED', 'Rechazado', 'Gasto rechazado o no aprobado', true, 4, NOW(), NOW()),
('CANCELLED', 'Cancelado', 'Gasto cancelado antes del pago', true, 5, NOW(), NOW()),
('PARTIAL', 'Pago Parcial', 'Gasto con pago parcial', true, 6, NOW(), NOW()),
('DISPUTED', 'En Disputa', 'Gasto con reclamo o disputa', true, 7, NOW(), NOW());

-- Verificar inserción
SELECT 'expense_categories' as tabla, COUNT(*) as total FROM expense_categories
UNION ALL
SELECT 'expense_statuses' as tabla, COUNT(*) as total FROM expense_statuses;
