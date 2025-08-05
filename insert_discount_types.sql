-- INSERT corregido para discount_types
INSERT INTO public.discount_types (code, name, description, is_active, display_order, is_percentage, max_discount_percentage, max_discount_amount, requires_approval, icon_class, color_hex, created_at, updated_at) VALUES
('PERCENTAGE', 'Porcentaje', 'Descuento por porcentaje', true, 1, true, 50.0, NULL, false, 'fa-percent', '#ffc107', NOW(), NOW()),
('FIXED_AMOUNT', 'Cantidad Fija', 'Descuento por cantidad fija', true, 2, false, NULL, 1000.0, false, 'fa-dollar-sign', '#28a745', NOW(), NOW()),
('SENIOR_DISCOUNT', 'Descuento Adulto Mayor', 'Descuento para adultos mayores', true, 3, true, 15.0, NULL, false, 'fa-user-clock', '#17a2b8', NOW(), NOW()),
('STUDENT_DISCOUNT', 'Descuento Estudiante', 'Descuento para estudiantes', true, 4, true, 10.0, NULL, false, 'fa-graduation-cap', '#6f42c1', NOW(), NOW()),
('INSURANCE_COPAY', 'Copago Seguro', 'Descuento por copago de seguro', true, 5, false, NULL, NULL, true, 'fa-shield-alt', '#fd7e14', NOW(), NOW()),
('EMPLOYEE_DISCOUNT', 'Descuento Empleado', 'Descuento para empleados', true, 6, true, 20.0, NULL, true, 'fa-id-badge', '#dc3545', NOW(), NOW()),
('PROMOTIONAL', 'Promocional', 'Descuento promocional', true, 7, true, 30.0, NULL, false, 'fa-tags', '#e83e8c', NOW(), NOW());

-- Verificar que se insertaron correctamente
SELECT COUNT(*) as total_discount_types FROM public.discount_types;
