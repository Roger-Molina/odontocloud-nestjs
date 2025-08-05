-- =====================================================
-- SCRIPT PARA POBLAR TABLAS DE CATÁLOGO BILLING
-- =====================================================

-- 1. INSERT para invoice_statuses
INSERT INTO public.invoice_statuses (code, name, description, color_hex, is_active, display_order, is_final, requires_payment, created_at, updated_at) VALUES
('DRAFT', 'Borrador', 'Factura en borrador', '#6c757d', true, 1, false, false, NOW(), NOW()),
('PENDING', 'Pendiente', 'Factura pendiente de pago', '#ffc107', true, 2, false, true, NOW(), NOW()),
('PAID', 'Pagada', 'Factura completamente pagada', '#28a745', true, 3, true, false, NOW(), NOW()),
('PARTIALLY_PAID', 'Pago Parcial', 'Factura con pago parcial', '#fd7e14', true, 4, false, true, NOW(), NOW()),
('OVERDUE', 'Vencida', 'Factura vencida', '#dc3545', true, 5, false, true, NOW(), NOW()),
('CANCELLED', 'Cancelada', 'Factura cancelada', '#6c757d', true, 6, true, false, NOW(), NOW()),
('REFUNDED', 'Reembolsada', 'Factura reembolsada', '#17a2b8', true, 7, true, false, NOW(), NOW());

-- 2. INSERT para invoice_types
INSERT INTO public.invoice_types (code, name, description, is_active, display_order, default_tax_rate, requires_appointment, color_hex, icon_class, created_at, updated_at) VALUES
('TREATMENT', 'Tratamiento', 'Factura por tratamiento dental', true, 1, 15.0, false, '#007bff', 'fa-tooth', NOW(), NOW()),
('CONSULTATION', 'Consulta', 'Factura por consulta dental', true, 2, 15.0, true, '#28a745', 'fa-stethoscope', NOW(), NOW()),
('EMERGENCY', 'Emergencia', 'Factura por atención de emergencia', true, 3, 15.0, false, '#dc3545', 'fa-ambulance', NOW(), NOW()),
('PREVENTIVE', 'Preventivo', 'Factura por tratamiento preventivo', true, 4, 15.0, false, '#17a2b8', 'fa-shield-alt', NOW(), NOW()),
('AESTHETIC', 'Estético', 'Factura por tratamiento estético', true, 5, 15.0, false, '#fd7e14', 'fa-smile', NOW(), NOW()),
('ORTHODONTICS', 'Ortodoncia', 'Factura por tratamiento ortodóntico', true, 6, 15.0, false, '#6f42c1', 'fa-align-left', NOW(), NOW()),
('SURGERY', 'Cirugía', 'Factura por cirugía dental', true, 7, 15.0, false, '#e83e8c', 'fa-cut', NOW(), NOW());

-- 3. INSERT para payment_methods
INSERT INTO public.payment_methods (code, name, description, is_active, display_order, requires_authorization, requires_reference, processing_fee_percentage, processing_fee_fixed, icon_class, created_at, updated_at) VALUES
('CASH', 'Efectivo', 'Pago en efectivo', true, 1, false, false, 0.0, 0.0, 'fa-money-bill', NOW(), NOW()),
('CREDIT_CARD', 'Tarjeta de Crédito', 'Pago con tarjeta de crédito', true, 2, true, true, 3.5, 0.0, 'fa-credit-card', NOW(), NOW()),
('DEBIT_CARD', 'Tarjeta de Débito', 'Pago con tarjeta de débito', true, 3, true, true, 2.0, 0.0, 'fa-credit-card', NOW(), NOW()),
('BANK_TRANSFER', 'Transferencia Bancaria', 'Transferencia bancaria', true, 4, false, true, 0.0, 5.0, 'fa-university', NOW(), NOW()),
('INSURANCE', 'Seguro', 'Pago por seguro médico', true, 5, false, false, 0.0, 0.0, 'fa-shield-alt', NOW(), NOW()),
('CHECK', 'Cheque', 'Pago con cheque', true, 6, false, true, 0.0, 0.0, 'fa-money-check', NOW(), NOW()),
('PAYMENT_PLAN', 'Plan de Pagos', 'Plan de pagos a plazos', true, 7, false, false, 0.0, 0.0, 'fa-calendar-alt', NOW(), NOW()),
('MIXED', 'Mixto', 'Combinación de métodos de pago', true, 8, false, false, 0.0, 0.0, 'fa-layer-group', NOW(), NOW());

-- 4. INSERT para payment_statuses
INSERT INTO public.payment_statuses (code, name, description, color_hex, is_active, display_order, is_final, created_at, updated_at) VALUES
('PENDING', 'Pendiente', 'Pago pendiente', '#ffc107', true, 1, false, NOW(), NOW()),
('COMPLETED', 'Completado', 'Pago completado exitosamente', '#28a745', true, 2, true, NOW(), NOW()),
('FAILED', 'Fallido', 'Pago fallido', '#dc3545', true, 3, true, NOW(), NOW()),
('CANCELLED', 'Cancelado', 'Pago cancelado', '#6c757d', true, 4, true, NOW(), NOW()),
('REFUNDED', 'Reembolsado', 'Pago reembolsado', '#17a2b8', true, 5, true, NOW(), NOW()),
('PROCESSING', 'Procesando', 'Pago en proceso', '#fd7e14', true, 6, false, NOW(), NOW());

-- 5. INSERT para discount_types
INSERT INTO public.discount_types (code, name, description, is_active, display_order, is_percentage, max_value, created_at, updated_at) VALUES
('PERCENTAGE', 'Porcentaje', 'Descuento por porcentaje', true, 1, true, 50.0, NOW(), NOW()),
('FIXED_AMOUNT', 'Cantidad Fija', 'Descuento por cantidad fija', true, 2, false, NULL, NOW(), NOW()),
('SENIOR_DISCOUNT', 'Descuento Adulto Mayor', 'Descuento para adultos mayores', true, 3, true, 15.0, NOW(), NOW()),
('STUDENT_DISCOUNT', 'Descuento Estudiante', 'Descuento para estudiantes', true, 4, true, 10.0, NOW(), NOW()),
('INSURANCE_COPAY', 'Copago Seguro', 'Descuento por copago de seguro', true, 5, false, NULL, NOW(), NOW()),
('EMPLOYEE_DISCOUNT', 'Descuento Empleado', 'Descuento para empleados', true, 6, true, 20.0, NOW(), NOW()),
('PROMOTIONAL', 'Promocional', 'Descuento promocional', true, 7, true, 30.0, NOW(), NOW());

-- =====================================================
-- VERIFICACIÓN - Consultas para verificar los datos
-- =====================================================

-- Verificar que se insertaron correctamente
SELECT 'invoice_statuses' as tabla, COUNT(*) as total FROM public.invoice_statuses
UNION ALL
SELECT 'invoice_types' as tabla, COUNT(*) as total FROM public.invoice_types
UNION ALL
SELECT 'payment_methods' as tabla, COUNT(*) as total FROM public.payment_methods
UNION ALL
SELECT 'payment_statuses' as tabla, COUNT(*) as total FROM public.payment_statuses
UNION ALL
SELECT 'discount_types' as tabla, COUNT(*) as total FROM public.discount_types;
