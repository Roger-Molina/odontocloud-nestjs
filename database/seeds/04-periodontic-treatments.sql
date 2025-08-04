-- =====================================================
-- SEED DATA PARA TRATAMIENTOS ODONTOLÓGICOS - PASO 4
-- =====================================================
-- Insertando la categoría PERIODONTAL

-- =====================================================
-- PASO 4: CATEGORÍA PERIODONTAL
-- =====================================================
-- Tratamientos de enfermedades periodontales

INSERT INTO treatments (
    treatment_code, name, description, category, base_cost, 
    estimated_duration, requires_anesthesia, tooth_specific, 
    status, clinic_id, created_at, updated_at
) VALUES
-- PERIODONTALES - Tratamientos de encías y periodonto
('PERIO001', 'Destartraje Supragingival', 'Remoción de cálculo y placa por encima de la encía', 'periodontic', 80.00, 45, false, false, 'available', 1, NOW(), NOW()),
('PERIO002', 'Destartraje Subgingival', 'Remoción de cálculo y placa por debajo de la encía', 'periodontic', 120.00, 60, true, false, 'available', 1, NOW(), NOW()),
('PERIO003', 'Alisado Radicular', 'Eliminación de endotoxinas de superficie radicular', 'periodontic', 150.00, 90, true, true, 'available', 1, NOW(), NOW()),
('PERIO004', 'Curetaje Gingival', 'Eliminación de tejido gingival infectado', 'periodontic', 100.00, 45, true, false, 'available', 1, NOW(), NOW()),
('PERIO005', 'Gingivectomía', 'Remoción quirúrgica de tejido gingival hiperplásico', 'periodontic', 200.00, 75, true, false, 'available', 1, NOW(), NOW()),
('PERIO006', 'Gingivoplastía', 'Remodelado estético del contorno gingival', 'periodontic', 180.00, 60, true, false, 'available', 1, NOW(), NOW()),
('PERIO007', 'Cirugía de Colgajo', 'Acceso quirúrgico para limpieza profunda radicular', 'periodontic', 300.00, 120, true, false, 'available', 1, NOW(), NOW()),
('PERIO008', 'Injerto de Encía Libre', 'Injerto gingival para cubrir recesiones', 'periodontic', 400.00, 90, true, true, 'available', 1, NOW(), NOW()),
('PERIO009', 'Injerto de Tejido Conectivo', 'Injerto subepitelial para cobertura radicular', 'periodontic', 450.00, 120, true, true, 'available', 1, NOW(), NOW()),
('PERIO010', 'Regeneración Tisular Guiada', 'Técnica regenerativa con membranas para hueso perdido', 'periodontic', 600.00, 150, true, false, 'available', 1, NOW(), NOW()),
('PERIO011', 'Alargamiento de Corona', 'Exposición de mayor superficie dental para restauración', 'periodontic', 250.00, 75, true, true, 'available', 1, NOW(), NOW()),
('PERIO012', 'Mantenimiento Periodontal', 'Control periódico post-tratamiento periodontal', 'periodontic', 70.00, 45, false, false, 'available', 1, NOW(), NOW());

-- Para verificar la inserción:
SELECT 
    category,
    COUNT(*) as total_treatments,
    AVG(base_cost) as costo_promedio,
    AVG(estimated_duration) as duracion_promedio,
    COUNT(CASE WHEN requires_anesthesia = true THEN 1 END) as con_anestesia,
    COUNT(CASE WHEN tooth_specific = true THEN 1 END) as diente_especifico
FROM treatments 
WHERE category = 'periodontic'
GROUP BY category;
