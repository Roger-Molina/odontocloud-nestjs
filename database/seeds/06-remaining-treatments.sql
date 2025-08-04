-- =====================================================
-- SEED DATA PARA TRATAMIENTOS ODONTOLÓGICOS - PASO 6
-- =====================================================
-- Insertando las categorías restantes: ORTODÓNTICA, PROSTODÓNTICA, COSMÉTICA, EMERGENCIA y CONSULTA

-- =====================================================
-- PASO 6A: CATEGORÍA ORTODÓNTICA
-- =====================================================

INSERT INTO treatments (
    treatment_code, name, description, category, base_cost, 
    estimated_duration, requires_anesthesia, tooth_specific, 
    status, clinic_id, created_at, updated_at
) VALUES
-- ORTODÓNTICOS - Tratamientos de ortodoncia
('ORTHO001', 'Consulta Ortodóntica', 'Evaluación inicial y plan de tratamiento ortodóntico', 'orthodontic', 60.00, 60, false, false, 'available', 1, NOW(), NOW()),
('ORTHO002', 'Brackets Metálicos', 'Aparato fijo con brackets convencionales', 'orthodontic', 1200.00, 90, false, false, 'available', 1, NOW(), NOW()),
('ORTHO003', 'Brackets Estéticos', 'Aparato fijo con brackets cerámicos transparentes', 'orthodontic', 1500.00, 90, false, false, 'available', 1, NOW(), NOW()),
('ORTHO004', 'Ortodoncia Invisible (Aligners)', 'Tratamiento con alineadores transparentes removibles', 'orthodontic', 2500.00, 60, false, false, 'available', 1, NOW(), NOW()),
('ORTHO005', 'Aparato Removible', 'Dispositivo ortodóntico removible para casos simples', 'orthodontic', 400.00, 45, false, false, 'available', 1, NOW(), NOW()),
('ORTHO006', 'Expansor Palatino', 'Aparato para ensanchamiento del paladar', 'orthodontic', 600.00, 60, false, false, 'available', 1, NOW(), NOW()),
('ORTHO007', 'Mantenedor de Espacio', 'Aparato para mantener espacio dental perdido prematuramente', 'orthodontic', 200.00, 30, false, false, 'available', 1, NOW(), NOW()),
('ORTHO008', 'Retenedor Fijo', 'Alambre permanente para mantener posición dental', 'orthodontic', 150.00, 45, false, false, 'available', 1, NOW(), NOW()),
('ORTHO009', 'Retenedor Removible', 'Aparato removible post-tratamiento ortodóntico', 'orthodontic', 120.00, 30, false, false, 'available', 1, NOW(), NOW()),
('ORTHO010', 'Control Ortodóntico', 'Cita de seguimiento y ajuste de aparatos', 'orthodontic', 50.00, 30, false, false, 'available', 1, NOW(), NOW()),

-- =====================================================
-- PASO 6B: CATEGORÍA PROSTODÓNTICA
-- =====================================================

-- PROSTODÓNTICOS - Tratamientos protésicos
('PROST001', 'Prótesis Total Superior', 'Dentadura completa para maxilar superior', 'prosthodontic', 800.00, 180, false, false, 'available', 1, NOW(), NOW()),
('PROST002', 'Prótesis Total Inferior', 'Dentadura completa para maxilar inferior', 'prosthodontic', 900.00, 180, false, false, 'available', 1, NOW(), NOW()),
('PROST003', 'Prótesis Parcial Removible', 'Dentadura parcial con ganchos metálicos', 'prosthodontic', 600.00, 120, false, false, 'available', 1, NOW(), NOW()),
('PROST004', 'Prótesis Flexible', 'Dentadura parcial con base flexible sin metal', 'prosthodontic', 750.00, 120, false, false, 'available', 1, NOW(), NOW()),
('PROST005', 'Puente Fijo 3 Unidades', 'Prótesis fija de tres coronas unidas', 'prosthodontic', 1200.00, 210, true, true, 'available', 1, NOW(), NOW()),
('PROST006', 'Puente Fijo 4+ Unidades', 'Prótesis fija de cuatro o más coronas', 'prosthodontic', 1600.00, 300, true, true, 'available', 1, NOW(), NOW()),
('PROST007', 'Prótesis sobre Implantes', 'Rehabilitación protésica fija sobre implantes', 'prosthodontic', 2000.00, 240, false, false, 'available', 1, NOW(), NOW()),
('PROST008', 'Reparación de Prótesis', 'Arreglo de fracturas o ajustes en dentaduras', 'prosthodontic', 80.00, 60, false, false, 'available', 1, NOW(), NOW()),
('PROST009', 'Rebase de Prótesis', 'Reacondicionamiento de base protésica', 'prosthodontic', 150.00, 90, false, false, 'available', 1, NOW(), NOW()),
('PROST010', 'Ajuste de Prótesis', 'Adaptación y calibración de dentaduras', 'prosthodontic', 40.00, 30, false, false, 'available', 1, NOW(), NOW()),

-- =====================================================
-- PASO 6C: CATEGORÍA ESTÉTICA/COSMÉTICA
-- =====================================================

-- COSMÉTICOS - Tratamientos estéticos
('COSM001', 'Blanqueamiento Dental en Consultorio', 'Blanqueamiento profesional con gel de alta concentración', 'cosmetic', 200.00, 90, false, false, 'available', 1, NOW(), NOW()),
('COSM002', 'Blanqueamiento Ambulatorio', 'Kit de blanqueamiento para uso domiciliario supervisado', 'cosmetic', 150.00, 30, false, false, 'available', 1, NOW(), NOW()),
('COSM003', 'Microabrasión del Esmalte', 'Remoción de manchas superficiales del esmalte', 'cosmetic', 100.00, 45, false, true, 'available', 1, NOW(), NOW()),
('COSM004', 'Contorneado Estético', 'Remodelado menor de forma dental', 'cosmetic', 80.00, 30, false, true, 'available', 1, NOW(), NOW()),
('COSM005', 'Cierre de Diastema', 'Corrección estética de espacios interdentales', 'cosmetic', 250.00, 90, false, true, 'available', 1, NOW(), NOW()),
('COSM006', 'Sonrisa Gingival (Gingivectomía)', 'Corrección de encía excesiva en sonrisa', 'cosmetic', 300.00, 75, true, false, 'available', 1, NOW(), NOW()),
('COSM007', 'Armonización Facial', 'Procedimientos complementarios para estética facial', 'cosmetic', 400.00, 60, false, false, 'available', 1, NOW(), NOW()),

-- =====================================================
-- PASO 6D: CATEGORÍA EMERGENCIA
-- =====================================================

-- EMERGENCIAS - Tratamientos de urgencia
('EMER001', 'Consulta de Emergencia', 'Atención inmediata por dolor o trauma dental', 'emergency', 80.00, 30, false, false, 'available', 1, NOW(), NOW()),
('EMER002', 'Drenaje de Absceso', 'Evacuación de colección purulenta oral', 'emergency', 120.00, 45, true, false, 'available', 1, NOW(), NOW()),
('EMER003', 'Sutura de Herida Oral', 'Cierre quirúrgico de laceración en tejidos blandos', 'emergency', 100.00, 30, true, false, 'available', 1, NOW(), NOW()),
('EMER004', 'Reimplante Dental', 'Reposición de diente avulsionado', 'emergency', 200.00, 60, true, true, 'available', 1, NOW(), NOW()),
('EMER005', 'Ferulización Dental', 'Inmovilización de dientes traumatizados', 'emergency', 150.00, 45, false, true, 'available', 1, NOW(), NOW()),
('EMER006', 'Medicación de Emergencia', 'Colocación de medicamento analgésico intraconducto', 'emergency', 60.00, 20, false, true, 'available', 1, NOW(), NOW()),

-- =====================================================
-- PASO 6E: CATEGORÍA CONSULTA
-- =====================================================

-- CONSULTAS - Servicios de evaluación
('CONS001', 'Primera Consulta', 'Evaluación inicial completa y plan de tratamiento', 'consultation', 50.00, 45, false, false, 'available', 1, NOW(), NOW()),
('CONS002', 'Consulta de Seguimiento', 'Evaluación de progreso de tratamiento', 'consultation', 30.00, 20, false, false, 'available', 1, NOW(), NOW()),
('CONS003', 'Segunda Opinión', 'Evaluación especializada para confirmar diagnóstico', 'consultation', 60.00, 30, false, false, 'available', 1, NOW(), NOW()),
('CONS004', 'Interconsulta Especializada', 'Evaluación por especialista en área específica', 'consultation', 80.00, 45, false, false, 'available', 1, NOW(), NOW()),
('CONS005', 'Teleodontología', 'Consulta remota por videoconferencia', 'consultation', 25.00, 15, false, false, 'available', 1, NOW(), NOW());

-- Para verificar la inserción de todas las categorías restantes:
SELECT 
    category,
    COUNT(*) as total_treatments,
    AVG(base_cost) as costo_promedio,
    AVG(estimated_duration) as duracion_promedio,
    COUNT(CASE WHEN requires_anesthesia = true THEN 1 END) as con_anestesia,
    COUNT(CASE WHEN tooth_specific = true THEN 1 END) as diente_especifico
FROM treatments 
WHERE category IN ('orthodontic', 'prosthodontic', 'cosmetic', 'emergency', 'consultation')
GROUP BY category 
ORDER BY category;
