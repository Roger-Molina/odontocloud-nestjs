-- =====================================================
-- SEED DATA PARA DIAGNÓSTICOS ODONTOLÓGICOS - PASO 3
-- =====================================================
-- Insertando la categoría ENDODÓNTICA

-- =====================================================
-- PASO 3: CATEGORÍA ENDODÓNTICA
-- =====================================================
-- Diagnósticos de problemas pulpares y periapicales

INSERT INTO diagnoses (
    diagnosis_code, name, description, category, severity, 
    is_chronic, requires_immediate_attention, tooth_specific, 
    status, clinic_id, created_at, updated_at
) VALUES
-- ENDODÓNTICA - Diagnósticos ordenados por severidad
('END001', 'Pulpa Vital Normal', 'Pulpa sin signos de patología', 'endodontic', NULL, false, false, true, 'active', 1, NOW(), NOW()),
('END002', 'Pulpitis Reversible', 'Inflamación pulpar leve que puede sanar', 'endodontic', 'mild', false, false, true, 'active', 1, NOW(), NOW()),
('END003', 'Pulpitis Irreversible', 'Inflamación pulpar severa que requiere endodoncia', 'endodontic', 'severe', false, true, true, 'active', 1, NOW(), NOW()),
('END004', 'Necrosis Pulpar', 'Muerte del tejido pulpar', 'endodontic', 'severe', false, true, true, 'active', 1, NOW(), NOW()),
('END005', 'Periodontitis Apical Aguda', 'Inflamación aguda del ligamento periodontal apical', 'endodontic', 'severe', false, true, true, 'active', 1, NOW(), NOW()),
('END006', 'Periodontitis Apical Crónica', 'Inflamación crónica periapical con lesión radiolúcida', 'endodontic', 'moderate', true, false, true, 'active', 1, NOW(), NOW()),
('END007', 'Absceso Apical Agudo', 'Colección purulenta en región apical', 'endodontic', 'critical', false, true, true, 'active', 1, NOW(), NOW()),
('END008', 'Absceso Apical Crónico', 'Drenaje crónico por fístula', 'endodontic', 'moderate', true, false, true, 'active', 1, NOW(), NOW()),
('END009', 'Granuloma Apical', 'Tejido de granulación en región apical', 'endodontic', 'moderate', true, false, true, 'active', 1, NOW(), NOW()),
('END010', 'Quiste Radicular', 'Lesión quística en región apical', 'endodontic', 'moderate', true, false, true, 'active', 1, NOW(), NOW());

-- Para verificar la inserción:
SELECT 
    category,
    COUNT(*) as total_diagnoses,
    COUNT(CASE WHEN severity = 'mild' THEN 1 END) as mild,
    COUNT(CASE WHEN severity = 'moderate' THEN 1 END) as moderate,
    COUNT(CASE WHEN severity = 'severe' THEN 1 END) as severe,
    COUNT(CASE WHEN severity = 'critical' THEN 1 END) as critical
FROM diagnoses 
WHERE category = 'endodontic'
GROUP BY category;
