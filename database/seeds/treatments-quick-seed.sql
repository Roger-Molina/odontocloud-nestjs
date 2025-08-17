-- Script simplificado para insertar tratamientos
-- Limpiar datos existentes
DELETE FROM budget_items WHERE treatment_id IN (SELECT id FROM treatments);
DELETE FROM medical_record_treatments WHERE treatment_id IN (SELECT id FROM treatments);
DELETE FROM treatments;

-- Insertar tratamientos con estructura simplificada
INSERT INTO treatments (treatment_code, name, description, category, "basePrice", base_cost, estimated_duration, requires_anesthesia, tooth_specific, status) VALUES

-- RESTAURATIVOS
('REST001', 'Obturación con Amalgama', 'Restauración con amalgama dental para caries pequeñas a moderadas', 'restorative', 60.00, 60.00, 45, true, true, 'available'),
('REST002', 'Obturación con Resina', 'Restauración estética con composite para caries anteriores y posteriores', 'restorative', 80.00, 80.00, 60, true, true, 'available'),
('REST003', 'Obturación con Ionómero', 'Restauración con ionómero de vidrio para áreas cervicales', 'restorative', 70.00, 70.00, 50, false, true, 'available'),
('REST004', 'Incrustación (Inlay)', 'Restauración indirecta de resina o cerámica para cavidades moderadas', 'restorative', 250.00, 250.00, 90, true, true, 'available'),
('REST005', 'Incrustación (Onlay)', 'Restauración indirecta que cubre cúspides dentales', 'restorative', 300.00, 300.00, 120, true, true, 'available'),
('REST006', 'Corona de Porcelana', 'Corona completa de cerámica para restauración estética', 'restorative', 500.00, 500.00, 150, true, true, 'available'),
('REST007', 'Corona Metal-Porcelana', 'Corona con base metálica y recubrimiento cerámico', 'restorative', 400.00, 400.00, 120, true, true, 'available'),
('REST008', 'Corona de Zirconia', 'Corona de óxido de zirconio de alta resistencia', 'restorative', 600.00, 600.00, 150, true, true, 'available'),

-- ENDODÓNTICOS
('ENDO001', 'Endodoncia Unirradicular', 'Tratamiento de conducto en diente de una raíz', 'endodontic', 200.00, 200.00, 120, true, true, 'available'),
('ENDO002', 'Endodoncia Birradicular', 'Tratamiento de conducto en diente de dos raíces', 'endodontic', 280.00, 280.00, 150, true, true, 'available'),
('ENDO003', 'Endodoncia Multirradicular', 'Tratamiento de conducto en diente de múltiples raíces', 'endodontic', 350.00, 350.00, 180, true, true, 'available'),
('ENDO004', 'Retratamiento Endodóntico', 'Nuevo tratamiento de conducto en diente previamente tratado', 'endodontic', 400.00, 400.00, 200, true, true, 'available'),

-- PREVENTIVOS
('PREV001', 'Profilaxis Dental', 'Limpieza dental profesional básica', 'preventive', 50.00, 50.00, 30, false, false, 'available'),
('PREV002', 'Fluorización', 'Aplicación tópica de flúor para prevención de caries', 'preventive', 25.00, 25.00, 15, false, false, 'available'),
('PREV003', 'Sellantes de Fosas y Fisuras', 'Sellado preventivo de molares y premolares', 'preventive', 35.00, 35.00, 20, false, true, 'available'),
('PREV004', 'Detartraje Supragingival', 'Remoción de cálculo dental por encima de la encía', 'preventive', 80.00, 80.00, 45, false, false, 'available'),

-- PERIODONTALES
('PERIO001', 'Curetaje Dental', 'Limpieza profunda de las raíces dentales', 'periodontic', 100.00, 100.00, 60, true, true, 'available'),
('PERIO002', 'Cirugía Periodontal', 'Cirugía para tratar enfermedad periodontal avanzada', 'periodontic', 500.00, 500.00, 120, true, false, 'available'),

-- CIRUGÍA ORAL
('SURG001', 'Extracción Simple', 'Extracción dental sin complicaciones', 'oral_surgery', 80.00, 80.00, 30, true, true, 'available'),
('SURG002', 'Extracción Compleja', 'Extracción dental con osteotomía o odontosección', 'oral_surgery', 150.00, 150.00, 60, true, true, 'available'),
('SURG003', 'Extracción de Cordal', 'Extracción de muelas del juicio', 'oral_surgery', 200.00, 200.00, 45, true, true, 'available'),

-- PROTÉSICOS
('PROT001', 'Prótesis Total Superior', 'Dentadura completa para maxilar superior', 'prosthodontic', 800.00, 800.00, 300, false, false, 'available'),
('PROT002', 'Prótesis Total Inferior', 'Dentadura completa para maxilar inferior', 'prosthodontic', 800.00, 800.00, 300, false, false, 'available'),
('PROT003', 'Implante Dental', 'Colocación de implante de titanio', 'prosthodontic', 1500.00, 1500.00, 120, true, true, 'available'),

-- ESTÉTICOS
('ESTH001', 'Blanqueamiento en Consultorio', 'Blanqueamiento dental profesional con luz LED', 'cosmetic', 300.00, 300.00, 90, false, false, 'available'),
('ESTH002', 'Blanqueamiento Casero', 'Kit de blanqueamiento para uso domiciliario', 'cosmetic', 200.00, 200.00, 30, false, false, 'available'),

-- ORTODÓNCICOS
('ORTHO001', 'Consulta Ortodóncica', 'Evaluación inicial para tratamiento ortodóncico', 'orthodontic', 100.00, 100.00, 60, false, false, 'available'),
('ORTHO002', 'Brackets Metálicos', 'Instalación de aparatología fija metálica', 'orthodontic', 2000.00, 2000.00, 120, false, false, 'available'),

-- EMERGENCIAS
('EMERG001', 'Consulta de Urgencia', 'Atención inmediata por dolor o trauma dental', 'emergency', 80.00, 80.00, 30, false, false, 'available'),
('EMERG002', 'Drenaje de Absceso', 'Procedimiento para drenar infección dental', 'emergency', 150.00, 150.00, 45, true, true, 'available'),

-- CONSULTAS
('CONS001', 'Consulta General', 'Evaluación dental general y diagnóstico', 'consultation', 60.00, 60.00, 30, false, false, 'available'),
('CONS002', 'Radiografía Periapical', 'Radiografía de diente específico', 'consultation', 25.00, 25.00, 10, false, true, 'available'),
('CONS003', 'Radiografía Panorámica', 'Radiografía completa de ambos maxilares', 'consultation', 80.00, 80.00, 15, false, false, 'available');

-- Verificar los datos insertados
SELECT COUNT(*) as total_treatments FROM treatments;
SELECT category, COUNT(*) as count FROM treatments GROUP BY category ORDER BY category;
