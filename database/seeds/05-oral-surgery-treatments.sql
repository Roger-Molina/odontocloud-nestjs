-- =====================================================
-- SEED DATA PARA TRATAMIENTOS ODONTOLÓGICOS - PASO 5
-- =====================================================
-- Insertando la categoría CIRUGÍA ORAL

-- =====================================================
-- PASO 5: CATEGORÍA CIRUGÍA ORAL
-- =====================================================
-- Tratamientos de cirugía oral y maxilofacial

INSERT INTO treatments (
    treatment_code, name, description, category, base_cost, 
    estimated_duration, requires_anesthesia, tooth_specific, 
    status, clinic_id, created_at, updated_at
) VALUES
-- CIRUGÍA ORAL - Tratamientos quirúrgicos
('SURG001', 'Extracción Simple', 'Extracción dental sin complicaciones', 'oral_surgery', 80.00, 30, true, true, 'available', 1, NOW(), NOW()),
('SURG002', 'Extracción Compleja', 'Extracción dental que requiere técnica quirúrgica', 'oral_surgery', 150.00, 60, true, true, 'available', 1, NOW(), NOW()),
('SURG003', 'Extracción de Tercer Molar', 'Extracción quirúrgica de muela del juicio', 'oral_surgery', 200.00, 75, true, true, 'available', 1, NOW(), NOW()),
('SURG004', 'Extracción de Diente Impactado', 'Extracción quirúrgica de diente no erupcionado', 'oral_surgery', 300.00, 120, true, true, 'available', 1, NOW(), NOW()),
('SURG005', 'Alveoloplastía', 'Remodelado de hueso alveolar post-extracción', 'oral_surgery', 180.00, 45, true, false, 'available', 1, NOW(), NOW()),
('SURG006', 'Implante Dental', 'Colocación de implante osteointegrado', 'oral_surgery', 800.00, 90, true, true, 'available', 1, NOW(), NOW()),
('SURG007', 'Injerto Óseo', 'Regeneración ósea para implantología', 'oral_surgery', 400.00, 75, true, false, 'available', 1, NOW(), NOW()),
('SURG008', 'Elevación de Seno Maxilar', 'Aumento de hueso en seno maxilar para implantes', 'oral_surgery', 600.00, 120, true, false, 'available', 1, NOW(), NOW()),
('SURG009', 'Frenectomía Labial', 'Resección quirúrgica del frenillo labial', 'oral_surgery', 150.00, 30, true, false, 'available', 1, NOW(), NOW()),
('SURG010', 'Frenectomía Lingual', 'Resección quirúrgica del frenillo lingual', 'oral_surgery', 180.00, 45, true, false, 'available', 1, NOW(), NOW()),
('SURG011', 'Biopsia Oral', 'Toma de muestra de tejido para estudio histopatológico', 'oral_surgery', 200.00, 30, true, false, 'available', 1, NOW(), NOW()),
('SURG012', 'Exéresis de Quiste', 'Remoción quirúrgica de lesión quística', 'oral_surgery', 350.00, 90, true, false, 'available', 1, NOW(), NOW()),
('SURG013', 'Cirugía Preprotésica', 'Preparación quirúrgica para prótesis dental', 'oral_surgery', 250.00, 60, true, false, 'available', 1, NOW(), NOW()),
('SURG014', 'Tratamiento de Alveolitis', 'Curación de alvéolo infectado post-extracción', 'oral_surgery', 60.00, 20, false, true, 'available', 1, NOW(), NOW());

-- Para verificar la inserción:
SELECT 
    category,
    COUNT(*) as total_treatments,
    AVG(base_cost) as costo_promedio,
    AVG(estimated_duration) as duracion_promedio,
    COUNT(CASE WHEN requires_anesthesia = true THEN 1 END) as con_anestesia,
    COUNT(CASE WHEN tooth_specific = true THEN 1 END) as diente_especifico
FROM treatments 
WHERE category = 'oral_surgery'
GROUP BY category;
