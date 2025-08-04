-- =====================================================
-- SEED DATA PARA DIAGNÓSTICOS ODONTOLÓGICOS - PASO 2
-- =====================================================
-- Insertando la categoría PERIODONTAL

-- =====================================================
-- PASO 2: CATEGORÍA PERIODONTAL
-- =====================================================
-- Diagnósticos de enfermedades de encías y periodonto

INSERT INTO diagnoses (
    diagnosis_code, name, description, category, severity, 
    is_chronic, requires_immediate_attention, tooth_specific, 
    status, clinic_id, created_at, updated_at
) VALUES
-- PERIODONTAL - Diagnósticos ordenados por severidad
('PER001', 'Gingivitis Leve', 'Inflamación superficial de encías sin pérdida de inserción', 'periodontal', 'mild', false, false, false, 'active', 1, NOW(), NOW()),
('PER002', 'Gingivitis Moderada', 'Inflamación gingival con sangrado al sondaje', 'periodontal', 'moderate', false, false, false, 'active', 1, NOW(), NOW()),
('PER003', 'Gingivitis Severa', 'Inflamación intensa con sangrado espontáneo', 'periodontal', 'severe', false, true, false, 'active', 1, NOW(), NOW()),
('PER004', 'Periodontitis Incipiente', 'Pérdida inicial de inserción (1-2mm)', 'periodontal', 'moderate', false, false, false, 'active', 1, NOW(), NOW()),
('PER005', 'Periodontitis Moderada', 'Pérdida de inserción de 3-4mm', 'periodontal', 'severe', true, false, false, 'active', 1, NOW(), NOW()),
('PER006', 'Periodontitis Severa', 'Pérdida de inserción mayor a 5mm', 'periodontal', 'critical', true, true, false, 'active', 1, NOW(), NOW()),
('PER007', 'Periodontitis Agresiva', 'Forma rápidamente progresiva en pacientes jóvenes', 'periodontal', 'critical', true, true, false, 'active', 1, NOW(), NOW()),
('PER008', 'Recesión Gingival', 'Migración apical del margen gingival', 'periodontal', 'moderate', false, false, true, 'active', 1, NOW(), NOW()),
('PER009', 'Hiperplasia Gingival', 'Crecimiento excesivo del tejido gingival', 'periodontal', 'moderate', false, false, false, 'active', 1, NOW(), NOW()),
('PER010', 'Absceso Periodontal', 'Infección localizada en el periodonto', 'periodontal', 'critical', false, true, true, 'active', 1, NOW(), NOW());

-- Para verificar la inserción:
SELECT 
    category,
    COUNT(*) as total_diagnoses,
    COUNT(CASE WHEN severity = 'mild' THEN 1 END) as mild,
    COUNT(CASE WHEN severity = 'moderate' THEN 1 END) as moderate,
    COUNT(CASE WHEN severity = 'severe' THEN 1 END) as severe,
    COUNT(CASE WHEN severity = 'critical' THEN 1 END) as critical
FROM diagnoses 
WHERE category = 'periodontal'
GROUP BY category;
