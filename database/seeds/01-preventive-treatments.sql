-- =====================================================
-- SEED DATA PARA TRATAMIENTOS ODONTOLÓGICOS - PASO 1
-- =====================================================
-- Insertando la categoría PREVENTIVA

-- =====================================================
-- PASO 1: CATEGORÍA PREVENTIVA
-- =====================================================
-- Tratamientos de prevención y mantenimiento de salud oral

INSERT INTO treatments (
    treatment_code, name, description, category, base_cost, 
    estimated_duration, requires_anesthesia, tooth_specific, 
    status, clinic_id, created_at, updated_at
) VALUES
-- PREVENTIVOS - Tratamientos de prevención
('PREV001', 'Consulta de Rutina', 'Examen dental preventivo completo con evaluación de riesgo', 'preventive', 50.00, 45, false, false, 'available', 1, NOW(), NOW()),
('PREV002', 'Profilaxis Dental', 'Limpieza profesional para remoción de placa y cálculo', 'preventive', 80.00, 60, false, false, 'available', 1, NOW(), NOW()),
('PREV003', 'Aplicación de Flúor', 'Aplicación tópica de fluoruro para prevención de caries', 'preventive', 25.00, 15, false, false, 'available', 1, NOW(), NOW()),
('PREV004', 'Selladores de Fosas y Fisuras', 'Aplicación de selladores para prevenir caries en molares', 'preventive', 35.00, 30, false, true, 'available', 1, NOW(), NOW()),
('PREV005', 'Educación en Higiene Oral', 'Instrucción personalizada en técnicas de cepillado y uso de hilo dental', 'preventive', 20.00, 20, false, false, 'available', 1, NOW(), NOW()),
('PREV006', 'Control Periodontal', 'Evaluación y mantenimiento de salud gingival', 'preventive', 40.00, 30, false, false, 'available', 1, NOW(), NOW()),
('PREV007', 'Radiografías Preventivas', 'Radiografías de rutina para detección temprana', 'preventive', 45.00, 15, false, false, 'available', 1, NOW(), NOW()),
('PREV008', 'Pulido Dental', 'Pulido de superficies dentales para remover manchas', 'preventive', 30.00, 20, false, false, 'available', 1, NOW(), NOW()),
('PREV009', 'Aplicación de Clorhexidina', 'Antiséptico tópico para control de gingivitis', 'preventive', 15.00, 10, false, false, 'available', 1, NOW(), NOW()),
('PREV010', 'Evaluación de Riesgo de Caries', 'Análisis detallado de factores de riesgo cariogénico', 'preventive', 35.00, 25, false, false, 'available', 1, NOW(), NOW());

-- Para verificar la inserción:
SELECT 
    category,
    COUNT(*) as total_treatments,
    AVG(base_cost) as costo_promedio,
    AVG(estimated_duration) as duracion_promedio,
    COUNT(CASE WHEN requires_anesthesia = true THEN 1 END) as con_anestesia,
    COUNT(CASE WHEN tooth_specific = true THEN 1 END) as diente_especifico
FROM treatments 
WHERE category = 'preventive'
GROUP BY category;
