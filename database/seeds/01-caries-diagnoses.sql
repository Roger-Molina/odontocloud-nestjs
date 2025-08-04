-- =====================================================
-- SEED DATA PARA DIAGNÓSTICOS ODONTOLÓGICOS - PASO 1
-- =====================================================
-- Insertando solo la categoría CARIES para comenzar

-- =====================================================
-- PASO 1: CATEGORÍA CARIES
-- =====================================================
-- Diagnósticos relacionados con lesiones cariosas

INSERT INTO diagnoses (
    diagnosis_code, name, description, category, severity, 
    is_chronic, requires_immediate_attention, tooth_specific, 
    status, clinic_id, created_at, updated_at
) VALUES
-- CARIES - Diagnósticos ordenados por severidad
('CAR001', 'Caries Inicial (Esmalte)', 'Desmineralización inicial del esmalte dental, reversible con flúor', 'caries', 'mild', false, false, true, 'active', 1, NOW(), NOW()),
('CAR002', 'Caries Superficial', 'Caries limitada al esmalte superficial, cavitación mínima', 'caries', 'mild', false, false, true, 'active', 1, NOW(), NOW()),
('CAR003', 'Caries Dentinaria', 'Caries que compromete la dentina pero no la pulpa', 'caries', 'moderate', false, false, true, 'active', 1, NOW(), NOW()),
('CAR004', 'Caries Profunda', 'Caries extensa en dentina cerca de la cámara pulpar', 'caries', 'severe', false, true, true, 'active', 1, NOW(), NOW()),
('CAR005', 'Caries Pulpar', 'Caries que ha alcanzado la pulpa dental', 'caries', 'critical', false, true, true, 'active', 1, NOW(), NOW()),
('CAR006', 'Caries Radicular', 'Caries en la superficie radicular expuesta', 'caries', 'moderate', false, false, true, 'active', 1, NOW(), NOW()),
('CAR007', 'Caries Recurrente', 'Caries secundaria alrededor de restauraciones existentes', 'caries', 'moderate', false, false, true, 'active', 1, NOW(), NOW()),
('CAR008', 'Caries Rampante', 'Múltiples caries de progresión rápida', 'caries', 'critical', true, true, false, 'active', 1, NOW(), NOW());

-- Para verificar la inserción:
SELECT 
    category,
    COUNT(*) as total_diagnoses,
    COUNT(CASE WHEN severity = 'mild' THEN 1 END) as mild,
    COUNT(CASE WHEN severity = 'moderate' THEN 1 END) as moderate,
    COUNT(CASE WHEN severity = 'severe' THEN 1 END) as severe,
    COUNT(CASE WHEN severity = 'critical' THEN 1 END) as critical
FROM diagnoses 
WHERE category = 'caries'
GROUP BY category;
