-- Script de inserción de tratamientos para el sistema multiclinica
-- Catálogo básico de tratamientos sin costos ni duración

-- Limpiar datos existentes
DELETE FROM treatments;

-- Insertar catálogo de tratamientos
INSERT INTO treatments (
    treatment_code, name, description, category, status, created_at, updated_at
) VALUES
-- RESTAURATIVOS - Tratamientos de restauración
('REST001', 'Obturación con Amalgama', 'Restauración con amalgama dental para caries pequeñas a moderadas', 'restorative', 60.00, 60.00, 45, true, true, 'available', NOW(), NOW()),
('REST002', 'Obturación con Resina', 'Restauración estética con composite para caries anteriores y posteriores', 'restorative', 80.00, 80.00, 60, true, true, 'available', NOW(), NOW()),
('REST003', 'Obturación con Ionómero', 'Restauración con ionómero de vidrio para áreas cervicales', 'restorative', 70.00, 70.00, 50, false, true, 'available', NOW(), NOW()),
('REST004', 'Incrustación (Inlay)', 'Restauración indirecta de resina o cerámica para cavidades moderadas', 'restorative', 250.00, 250.00, 90, true, true, 'available', NOW(), NOW()),
('REST005', 'Incrustación (Onlay)', 'Restauración indirecta que cubre cúspides dentales', 'restorative', 300.00, 300.00, 120, true, true, 'available', NOW(), NOW()),
('REST006', 'Corona de Porcelana', 'Corona completa de cerámica para restauración estética', 'restorative', 500.00, 500.00, 150, true, true, 'available', NOW(), NOW()),
('REST007', 'Corona Metal-Porcelana', 'Corona con base metálica y recubrimiento cerámico', 'restorative', 400.00, 400.00, 120, true, true, 'available', NOW(), NOW()),
('REST008', 'Corona de Zirconia', 'Corona de óxido de zirconio de alta resistencia', 'restorative', 600.00, 600.00, 150, true, true, 'available', NOW(), NOW()),
('REST009', 'Reconstrucción con Poste', 'Reconstrucción de diente con poste de fibra de vidrio', 'restorative', 180.00, 180.00, 90, true, true, 'available', NOW(), NOW()),
('REST010', 'Carilla de Porcelana', 'Lámina cerámica para mejorar estética dental anterior', 'restorative', 350.00, 350.00, 120, false, true, 'available', NOW(), NOW()),
('REST011', 'Carilla de Resina', 'Lámina de composite para corrección estética menor', 'restorative', 200.00, 200.00, 90, false, true, 'available', NOW(), NOW()),
('REST012', 'Reparación de Fractura', 'Restauración de diente fracturado con resina', 'restorative', 120.00, 120.00, 75, true, true, 'available', NOW(), NOW()),

-- ENDODÓNTICOS - Tratamientos de conducto
('ENDO001', 'Endodoncia Unirradicular', 'Tratamiento de conducto en diente de una raíz', 'endodontic', 200.00, 200.00, 120, true, true, 'available', NOW(), NOW()),
('ENDO002', 'Endodoncia Birradicular', 'Tratamiento de conducto en diente de dos raíces', 'endodontic', 280.00, 280.00, 150, true, true, 'available', NOW(), NOW()),
('ENDO003', 'Endodoncia Multirradicular', 'Tratamiento de conducto en diente de múltiples raíces', 'endodontic', 350.00, 350.00, 180, true, true, 'available', NOW(), NOW()),
('ENDO004', 'Retratamiento Endodóntico', 'Nuevo tratamiento de conducto en diente previamente tratado', 'endodontic', 400.00, 400.00, 200, true, true, 'available', NOW(), NOW()),
('ENDO005', 'Apicectomía', 'Cirugía apical para resolver infección en el ápice radicular', 'endodontic', 450.00, 450.00, 90, true, true, 'available', NOW(), NOW()),
('ENDO006', 'Pulpotomía', 'Remoción parcial de la pulpa dental en dientes temporales', 'endodontic', 100.00, 100.00, 45, true, true, 'available', NOW(), NOW()),
('ENDO007', 'Pulpectomía', 'Remoción completa de la pulpa en dientes temporales', 'endodontic', 150.00, 150.00, 60, true, true, 'available', NOW(), NOW()),

-- PREVENTIVOS - Tratamientos de prevención
('PREV001', 'Profilaxis Dental', 'Limpieza dental profesional básica', 'preventive', 50.00, 50.00, 30, false, false, 'available', NOW(), NOW()),
('PREV002', 'Fluorización', 'Aplicación tópica de flúor para prevención de caries', 'preventive', 25.00, 25.00, 15, false, false, 'available', NOW(), NOW()),
('PREV003', 'Sellantes de Fosas y Fisuras', 'Sellado preventivo de molares y premolares', 'preventive', 35.00, 35.00, 20, false, true, 'available', NOW(), NOW()),
('PREV004', 'Detartraje Supragingival', 'Remoción de cálculo dental por encima de la encía', 'preventive', 80.00, 80.00, 45, false, false, 'available', NOW(), NOW()),
('PREV005', 'Detartraje Subgingival', 'Remoción de cálculo dental por debajo de la encía', 'preventive', 120.00, 120.00, 60, true, false, 'available', NOW(), NOW()),
('PREV006', 'Educación en Higiene Oral', 'Instrucción personalizada en técnicas de higiene', 'preventive', 30.00, 30.00, 30, false, false, 'available', NOW(), NOW()),

-- PERIODONTALES - Tratamientos de encías
('PERIO001', 'Curetaje Dental', 'Limpieza profunda de las raíces dentales', 'periodontic', 100.00, 100.00, 60, true, true, 'available', NOW(), NOW()),
('PERIO002', 'Cirugía Periodontal', 'Cirugía para tratar enfermedad periodontal avanzada', 'periodontic', 500.00, 120, true, false, 'available', NOW(), NOW()),
('PERIO003', 'Injerto de Encía', 'Trasplante de tejido gingival para cubrir recesiones', 'periodontic', 400.00, 90, true, true, 'available', NOW(), NOW()),
('PERIO004', 'Gingivectomía', 'Remoción quirúrgica de tejido gingival excesivo', 'periodontic', 300.00, 75, true, false, 'available', NOW(), NOW()),
('PERIO005', 'Alargamiento de Corona', 'Exposición de más superficie dental mediante cirugía', 'periodontic', 350.00, 90, true, true, 'available', NOW(), NOW()),

-- CIRUGÍA ORAL - Procedimientos quirúrgicos
('SURG001', 'Extracción Simple', 'Extracción dental sin complicaciones', 'oral_surgery', 80.00, 30, true, true, 'available', NOW(), NOW()),
('SURG002', 'Extracción Compleja', 'Extracción dental con osteotomía o odontosección', 'oral_surgery', 150.00, 60, true, true, 'available', NOW(), NOW()),
('SURG003', 'Extracción de Cordal', 'Extracción de muelas del juicio', 'oral_surgery', 200.00, 45, true, true, 'available', NOW(), NOW()),
('SURG004', 'Extracción Quirúrgica', 'Extracción con colgajo y osteotomía', 'oral_surgery', 250.00, 90, true, true, 'available', NOW(), NOW()),
('SURG005', 'Biopsia Oral', 'Toma de muestra de tejido para análisis histopatológico', 'oral_surgery', 180.00, 30, true, true, 'available', NOW(), NOW()),
('SURG006', 'Frenectomía', 'Cirugía para corregir frenillo lingual o labial', 'oral_surgery', 220.00, 45, true, false, 'available', NOW(), NOW()),

-- PROTÉSICOS - Prótesis dentales
('PROT001', 'Prótesis Total Superior', 'Dentadura completa para maxilar superior', 'prosthodontic', 800.00, 300, false, false, 'available', NOW(), NOW()),
('PROT002', 'Prótesis Total Inferior', 'Dentadura completa para maxilar inferior', 'prosthodontic', 800.00, 300, false, false, 'available', NOW(), NOW()),
('PROT003', 'Prótesis Parcial Removible', 'Prótesis para reemplazar algunos dientes perdidos', 'prosthodontic', 600.00, 240, false, false, 'available', NOW(), NOW()),
('PROT004', 'Prótesis Fija (Puente)', 'Puente fijo para reemplazar dientes perdidos', 'prosthodontic', 1200.00, 360, true, true, 'available', NOW(), NOW()),
('PROT005', 'Implante Dental', 'Colocación de implante de titanio', 'prosthodontic', 1500.00, 120, true, true, 'available', NOW(), NOW()),
('PROT006', 'Corona sobre Implante', 'Corona protésica sobre implante dental', 'prosthodontic', 800.00, 150, false, true, 'available', NOW(), NOW()),

-- ESTÉTICOS - Tratamientos cosméticos
('ESTH001', 'Blanqueamiento en Consultorio', 'Blanqueamiento dental profesional con luz LED', 'cosmetic', 300.00, 90, false, false, 'available', NOW(), NOW()),
('ESTH002', 'Blanqueamiento Casero', 'Kit de blanqueamiento para uso domiciliario', 'cosmetic', 200.00, 30, false, false, 'available', NOW(), NOW()),
('ESTH003', 'Microabrasión del Esmalte', 'Remoción de manchas superficiales del esmalte', 'cosmetic', 150.00, 60, false, true, 'available', NOW(), NOW()),
('ESTH004', 'Contorno Estético', 'Remodelado del contorno dental con resina', 'cosmetic', 120.00, 45, false, true, 'available', NOW(), NOW()),
('ESTH005', 'Cierre de Diastema', 'Cierre de espacios entre dientes con resina', 'cosmetic', 180.00, 75, false, true, 'available', NOW(), NOW()),

-- ORTODÓNCICOS - Tratamientos de ortodoncia
('ORTHO001', 'Consulta Ortodóncica', 'Evaluación inicial para tratamiento ortodóncico', 'orthodontic', 100.00, 60, false, false, 'available', NOW(), NOW()),
('ORTHO002', 'Brackets Metálicos', 'Instalación de aparatología fija metálica', 'orthodontic', 2000.00, 120, false, false, 'available', NOW(), NOW()),
('ORTHO003', 'Brackets Estéticos', 'Instalación de brackets de cerámica o zafiro', 'orthodontic', 2800.00, 120, false, false, 'available', NOW(), NOW()),
('ORTHO004', 'Invisalign', 'Tratamiento con alineadores transparentes', 'orthodontic', 4000.00, 60, false, false, 'available', NOW(), NOW()),
('ORTHO005', 'Retenedores', 'Aparatos de retención post-tratamiento', 'orthodontic', 300.00, 45, false, false, 'available', NOW(), NOW()),
('ORTHO006', 'Expansor Palatino', 'Aparato para expandir el paladar', 'orthodontic', 800.00, 90, false, false, 'available', NOW(), NOW()),

-- EMERGENCIAS - Tratamientos de urgencia
('EMERG001', 'Consulta de Urgencia', 'Atención inmediata por dolor o trauma dental', 'emergency', 80.00, 30, false, false, 'available', NOW(), NOW()),
('EMERG002', 'Drenaje de Absceso', 'Procedimiento para drenar infección dental', 'emergency', 150.00, 45, true, true, 'available', NOW(), NOW()),
('EMERG003', 'Reimplante Dental', 'Reimplantación de diente avulsionado', 'emergency', 300.00, 90, true, true, 'available', NOW(), NOW()),
('EMERG004', 'Ferulización Dental', 'Estabilización de dientes traumatizados', 'emergency', 200.00, 60, true, false, 'available', NOW(), NOW()),
('EMERG005', 'Medicación Intraconducto', 'Colocación de medicamento en conducto infectado', 'emergency', 100.00, 30, true, true, 'available', NOW(), NOW()),

-- CONSULTAS - Evaluaciones y diagnósticos
('CONS001', 'Consulta General', 'Evaluación dental general y diagnóstico', 'consultation', 60.00, 30, false, false, 'available', NOW(), NOW()),
('CONS002', 'Consulta Especializada', 'Evaluación por especialista dental', 'consultation', 100.00, 45, false, false, 'available', NOW(), NOW()),
('CONS003', 'Radiografía Periapical', 'Radiografía de diente específico', 'consultation', 25.00, 10, false, true, 'available', NOW(), NOW()),
('CONS004', 'Radiografía Panorámica', 'Radiografía completa de ambos maxilares', 'consultation', 80.00, 15, false, false, 'available', NOW(), NOW()),
('CONS005', 'Fotografías Intraorales', 'Documentación fotográfica para diagnóstico', 'consultation', 40.00, 20, false, false, 'available', NOW(), NOW()),
('CONS006', 'Modelos de Estudio', 'Impresiones para análisis del caso', 'consultation', 60.00, 30, false, false, 'available', NOW(), NOW());

-- Verificar que se insertaron correctamente
-- SELECT COUNT(*) as total_treatments FROM treatments;
-- SELECT category, COUNT(*) as count FROM treatments GROUP BY category ORDER BY category;
