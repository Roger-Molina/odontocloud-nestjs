-- Script de inserción de tratamientos para el sistema multiclinica
-- Ejecutar después de que la tabla treatments esté creada

-- Limpiar datos existentes (opcional, descomentar si necesario)
DELETE FROM treatments;

-- Insertar tratamientos restaurativos
INSERT INTO treatments (
    treatment_code, name, description, category, base_cost, "basePrice",
    estimated_duration, requires_anesthesia, tooth_specific, 
    status, created_at, updated_at
) VALUES
-- RESTAURATIVOS - Tratamientos de restauración
('REST001', 'Obturación con Amalgama', 'Restauración con amalgama dental para caries pequeñas a moderadas', 'restorative', 60.00, 60.00, 45, true, true, 'available', NOW(), NOW()),
('REST002', 'Obturación con Resina', 'Restauración estética con composite para caries anteriores y posteriores', 'restorative', 80.00, 80.00, 60, true, true, 'available', NOW(), NOW()),
('REST003', 'Obturación con Ionómero', 'Restauración con ionómero de vidrio para áreas cervicales', 'restorative', 70.00, 70.00, 50, false, true, 'available', NOW(), NOW()),
('REST004', 'Incrustación (Inlay)', 'Restauración indirecta de resina o cerámica para cavidades moderadas', 'restorative', 250.00, 250.00, 90, true, true, 'available', NOW(), NOW()),
('REST005', 'Incrustación (Onlay)', 'Restauración indirecta que cubre cúspides dentales', 'restorative', 300.00, 300.00, 120, true, true, 'available', NOW(), NOW()),

-- ENDODÓNTICOS - Tratamientos de conducto
('ENDO001', 'Endodoncia Unirradicular', 'Tratamiento de conducto en diente de una raíz', 'endodontic', 200.00, 200.00, 120, true, true, 'available', NOW(), NOW()),
('ENDO002', 'Endodoncia Birradicular', 'Tratamiento de conducto en diente de dos raíces', 'endodontic', 280.00, 280.00, 150, true, true, 'available', NOW(), NOW()),
('ENDO003', 'Endodoncia Multirradicular', 'Tratamiento de conducto en diente de múltiples raíces', 'endodontic', 350.00, 350.00, 180, true, true, 'available', NOW(), NOW()),

-- PREVENTIVOS - Tratamientos de prevención
('PREV001', 'Profilaxis Dental', 'Limpieza dental profesional básica', 'preventive', 50.00, 50.00, 30, false, false, 'available', NOW(), NOW()),
('PREV002', 'Fluorización', 'Aplicación tópica de flúor para prevención de caries', 'preventive', 25.00, 25.00, 15, false, false, 'available', NOW(), NOW()),
('PREV003', 'Sellantes de Fosas y Fisuras', 'Sellado preventivo de molares y premolares', 'preventive', 35.00, 35.00, 20, false, true, 'available', NOW(), NOW()),

-- PERIODONTALES - Tratamientos de encías
('PERIO001', 'Curetaje Dental', 'Limpieza profunda de las raíces dentales', 'periodontic', 100.00, 100.00, 60, true, true, 'available', NOW(), NOW()),
('PERIO002', 'Cirugía Periodontal', 'Cirugía para tratar enfermedad periodontal avanzada', 'periodontic', 500.00, 500.00, 120, true, false, 'available', NOW(), NOW()),

-- CIRUGÍA ORAL - Procedimientos quirúrgicos
('SURG001', 'Extracción Simple', 'Extracción dental sin complicaciones', 'oral_surgery', 80.00, 80.00, 30, true, true, 'available', NOW(), NOW()),
('SURG002', 'Extracción Compleja', 'Extracción dental con osteotomía o odontosección', 'oral_surgery', 150.00, 150.00, 60, true, true, 'available', NOW(), NOW()),
('SURG003', 'Extracción de Cordal', 'Extracción de muelas del juicio', 'oral_surgery', 200.00, 200.00, 45, true, true, 'available', NOW(), NOW()),

-- PROTÉSICOS - Prótesis dentales
('PROT001', 'Prótesis Total Superior', 'Dentadura completa para maxilar superior', 'prosthodontic', 800.00, 800.00, 300, false, false, 'available', NOW(), NOW()),
('PROT002', 'Prótesis Total Inferior', 'Dentadura completa para maxilar inferior', 'prosthodontic', 800.00, 800.00, 300, false, false, 'available', NOW(), NOW()),
('PROT003', 'Implante Dental', 'Colocación de implante de titanio', 'prosthodontic', 1500.00, 1500.00, 120, true, true, 'available', NOW(), NOW()),

-- ESTÉTICOS - Tratamientos cosméticos
('ESTH001', 'Blanqueamiento en Consultorio', 'Blanqueamiento dental profesional con luz LED', 'cosmetic', 300.00, 300.00, 90, false, false, 'available', NOW(), NOW()),
('ESTH002', 'Blanqueamiento Casero', 'Kit de blanqueamiento para uso domiciliario', 'cosmetic', 200.00, 200.00, 30, false, false, 'available', NOW(), NOW()),
('ESTH003', 'Carilla de Porcelana', 'Lámina cerámica para mejorar estética dental anterior', 'cosmetic', 350.00, 350.00, 120, false, true, 'available', NOW(), NOW()),

-- ORTODÓNCICOS - Tratamientos de ortodoncia
('ORTHO001', 'Consulta Ortodóncica', 'Evaluación inicial para tratamiento ortodóncico', 'orthodontic', 100.00, 100.00, 60, false, false, 'available', NOW(), NOW()),
('ORTHO002', 'Brackets Metálicos', 'Instalación de aparatología fija metálica', 'orthodontic', 2000.00, 2000.00, 120, false, false, 'available', NOW(), NOW()),
('ORTHO003', 'Brackets Estéticos', 'Instalación de brackets de cerámica o zafiro', 'orthodontic', 2800.00, 2800.00, 120, false, false, 'available', NOW(), NOW()),

-- EMERGENCIAS - Tratamientos de urgencia
('EMERG001', 'Consulta de Urgencia', 'Atención inmediata por dolor o trauma dental', 'emergency', 80.00, 80.00, 30, false, false, 'available', NOW(), NOW()),
('EMERG002', 'Drenaje de Absceso', 'Procedimiento para drenar infección dental', 'emergency', 150.00, 150.00, 45, true, true, 'available', NOW(), NOW()),
('EMERG003', 'Medicación Intraconducto', 'Colocación de medicamento en conducto infectado', 'emergency', 100.00, 100.00, 30, true, true, 'available', NOW(), NOW()),

-- CONSULTAS - Evaluaciones y diagnósticos
('CONS001', 'Consulta General', 'Evaluación dental general y diagnóstico', 'consultation', 60.00, 60.00, 30, false, false, 'available', NOW(), NOW()),
('CONS002', 'Consulta Especializada', 'Evaluación por especialista dental', 'consultation', 100.00, 100.00, 45, false, false, 'available', NOW(), NOW()),
('CONS003', 'Radiografía Periapical', 'Radiografía de diente específico', 'consultation', 25.00, 25.00, 10, false, true, 'available', NOW(), NOW()),
('CONS004', 'Radiografía Panorámica', 'Radiografía completa de ambos maxilares', 'consultation', 80.00, 80.00, 15, false, false, 'available', NOW(), NOW());

-- Verificar que se insertaron correctamente
SELECT COUNT(*) as total_treatments FROM treatments;
SELECT category, COUNT(*) as count FROM treatments GROUP BY category ORDER BY category;
