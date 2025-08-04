-- =====================================================
-- SEED DATA PARA TRATAMIENTOS ODONTOLÓGICOS - PASO 3
-- =====================================================
-- Insertando la categoría ENDODÓNTICA

-- =====================================================
-- PASO 3: CATEGORÍA ENDODÓNTICA
-- =====================================================
-- Tratamientos de endodoncia y problemas pulpares

INSERT INTO treatments (
    treatment_code, name, description, category, base_cost, 
    estimated_duration, requires_anesthesia, tooth_specific, 
    status, clinic_id, created_at, updated_at
) VALUES
-- ENDODÓNTICOS - Tratamientos del sistema pulpar
('ENDO001', 'Pulpotomía', 'Remoción parcial de pulpa vital en dientes temporales', 'endodontic', 120.00, 60, true, true, 'available', 1, NOW(), NOW()),
('ENDO002', 'Pulpectomía', 'Remoción completa de pulpa en dientes temporales', 'endodontic', 150.00, 75, true, true, 'available', 1, NOW(), NOW()),
('ENDO003', 'Tratamiento de Conducto Unirradicular', 'Endodoncia completa en diente de una raíz', 'endodontic', 300.00, 120, true, true, 'available', 1, NOW(), NOW()),
('ENDO004', 'Tratamiento de Conducto Birradicular', 'Endodoncia completa en diente de dos raíces', 'endodontic', 400.00, 150, true, true, 'available', 1, NOW(), NOW()),
('ENDO005', 'Tratamiento de Conducto Multirradicular', 'Endodoncia completa en molares de múltiples raíces', 'endodontic', 500.00, 180, true, true, 'available', 1, NOW(), NOW()),
('ENDO006', 'Retratamiento Endodóntico', 'Repetición de tratamiento de conducto fallido', 'endodontic', 600.00, 210, true, true, 'available', 1, NOW(), NOW()),
('ENDO007', 'Apexificación', 'Inducción de cierre apical en dientes con ápice abierto', 'endodontic', 350.00, 90, true, true, 'available', 1, NOW(), NOW()),
('ENDO008', 'Blanqueamiento Interno', 'Blanqueamiento de diente no vital desde el interior', 'endodontic', 100.00, 45, false, true, 'available', 1, NOW(), NOW()),
('ENDO009', 'Medicación Intraconducto', 'Colocación de medicamento antibacteriano en conducto', 'endodontic', 80.00, 30, true, true, 'available', 1, NOW(), NOW()),
('ENDO010', 'Obturación de Conducto', 'Sellado definitivo del sistema de conductos radiculares', 'endodontic', 150.00, 60, false, true, 'available', 1, NOW(), NOW()),
('ENDO011', 'Cirugía Endodóntica (Apicectomía)', 'Resección quirúrgica del ápice radicular', 'endodontic', 450.00, 120, true, true, 'available', 1, NOW(), NOW()),
('ENDO012', 'Microcirugía Endodóntica', 'Cirugía apical con microscopio para casos complejos', 'endodontic', 650.00, 150, true, true, 'available', 1, NOW(), NOW());

-- Para verificar la inserción:
SELECT 
    category,
    COUNT(*) as total_treatments,
    AVG(base_cost) as costo_promedio,
    AVG(estimated_duration) as duracion_promedio,
    COUNT(CASE WHEN requires_anesthesia = true THEN 1 END) as con_anestesia,
    COUNT(CASE WHEN tooth_specific = true THEN 1 END) as diente_especifico
FROM treatments 
WHERE category = 'endodontic'
GROUP BY category;
