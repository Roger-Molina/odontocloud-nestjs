-- =====================================================
-- SEED DATA PARA MÉTODOS DE PAGO
-- =====================================================
-- Este archivo inserta los métodos de pago básicos del sistema
-- Debe ejecutarse ANTES de insertar facturas o pagos

-- Limpiar datos existentes (opcional)
-- DELETE FROM payment_methods;

INSERT INTO payment_methods (
    code, name, description, is_active, display_order, 
    requires_authorization, requires_reference, processing_fee_percentage, 
    processing_fee_fixed, icon_class, created_at, updated_at
) VALUES
-- Métodos de pago más comunes ordenados por frecuencia de uso
('CASH', 'Efectivo', 'Pago en efectivo, moneda local', true, 1, false, false, 0.00, 0.00, 'pi pi-money-bill', NOW(), NOW()),
('DEBIT_CARD', 'Tarjeta de Débito', 'Pago con tarjeta de débito bancaria', true, 2, false, true, 1.50, 0.00, 'pi pi-credit-card', NOW(), NOW()),
('CREDIT_CARD', 'Tarjeta de Crédito', 'Pago con tarjeta de crédito', true, 3, false, true, 2.50, 0.00, 'pi pi-credit-card', NOW(), NOW()),
('BANK_TRANSFER', 'Transferencia Bancaria', 'Transferencia directa entre cuentas bancarias', true, 4, true, true, 0.50, 2.00, 'pi pi-send', NOW(), NOW()),
('CHECK', 'Cheque', 'Pago mediante cheque bancario', true, 5, true, true, 0.00, 1.00, 'pi pi-file-edit', NOW(), NOW()),

-- Métodos digitales modernos
('PAYPAL', 'PayPal', 'Pago a través de plataforma PayPal', true, 6, false, true, 3.49, 0.00, 'pi pi-paypal', NOW(), NOW()),
('DIGITAL_WALLET', 'Billetera Digital', 'Pagos móviles (Apple Pay, Google Pay, etc.)', true, 7, false, false, 2.00, 0.00, 'pi pi-mobile', NOW(), NOW()),
('CRYPTOCURRENCY', 'Criptomoneda', 'Pago con monedas digitales', false, 8, true, true, 1.00, 0.00, 'pi pi-bitcoin', NOW(), NOW()),

-- Métodos de financiamiento
('INSTALLMENTS', 'Pago en Cuotas', 'Pago fraccionado en múltiples cuotas', true, 9, true, false, 5.00, 0.00, 'pi pi-calendar', NOW(), NOW()),
('MEDICAL_CREDIT', 'Crédito Médico', 'Financiamiento especializado para tratamientos médicos', true, 10, true, true, 8.00, 10.00, 'pi pi-heart', NOW(), NOW()),
('INSURANCE', 'Seguro Médico', 'Pago cubierto por póliza de seguro médico', true, 11, true, true, 0.00, 0.00, 'pi pi-shield', NOW(), NOW()),

-- Métodos especiales
('DISCOUNT_COUPON', 'Cupón de Descuento', 'Pago con cupones promocionales o de descuento', true, 12, false, true, 0.00, 0.00, 'pi pi-ticket', NOW(), NOW()),
('BARTER', 'Intercambio/Trueque', 'Intercambio de servicios o productos', false, 13, true, true, 0.00, 0.00, 'pi pi-refresh', NOW(), NOW()),
('FREE_TREATMENT', 'Tratamiento Gratuito', 'Servicios sin costo (beneficencia, campañas)', true, 14, true, false, 0.00, 0.00, 'pi pi-gift', NOW(), NOW()),
('PENDING', 'Pago Pendiente', 'Pago diferido o por confirmar', true, 15, false, false, 0.00, 0.00, 'pi pi-clock', NOW(), NOW());

-- Verificar inserción
SELECT COUNT(*) as total_payment_methods FROM payment_methods;
SELECT code, name, is_active, processing_fee_percentage FROM payment_methods ORDER BY display_order;
