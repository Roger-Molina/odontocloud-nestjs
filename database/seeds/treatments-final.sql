-- Script de inserción de tratamientos para el sistema multiclinica
-- Catálogo básico de tratamientos sin costos ni duración

-- Limpiar datos existentes
DELETE FROM treatments;

-- Insertar catálogo de tratamientos
INSERT INTO treatments (
    treatment_code, name, description, category, status, created_at, updated_at
) VALUES
-- RESTAURATIVOS - Tratamientos de restauración
('REST001', 'Obturación con Amalgama', 'Restauración con amalgama dental para caries pequeñas a moderadas', 'restorative', 'available', NOW(), NOW()),
('REST002', 'Obturación con Resina', 'Restauración estética con composite para caries anteriores y posteriores', 'restorative', 'available', NOW(), NOW()),
('REST003', 'Obturación con Ionómero', 'Restauración con ionómero de vidrio para áreas cervicales', 'restorative', 'available', NOW(), NOW()),
('REST004', 'Incrustación (Inlay)', 'Restauración indirecta de resina o cerámica para cavidades moderadas', 'restorative', 'available', NOW(), NOW()),
('REST005', 'Incrustación (Onlay)', 'Restauración indirecta que cubre cúspides dentales', 'restorative', 'available', NOW(), NOW()),
('REST006', 'Corona de Porcelana', 'Corona completa de cerámica para restauración estética', 'restorative', 'available', NOW(), NOW()),
('REST007', 'Corona Metal-Porcelana', 'Corona con base metálica y recubrimiento cerámico', 'restorative', 'available', NOW(), NOW()),
('REST008', 'Corona de Zirconia', 'Corona de óxido de zirconio de alta resistencia', 'restorative', 'available', NOW(), NOW()),
('REST009', 'Reconstrucción con Poste', 'Reconstrucción de diente con poste de fibra de vidrio', 'restorative', 'available', NOW(), NOW()),
('REST010', 'Carilla de Porcelana', 'Lámina cerámica para mejorar estética dental anterior', 'restorative', 'available', NOW(), NOW()),
('REST011', 'Carilla de Resina', 'Lámina de composite para corrección estética menor', 'restorative', 'available', NOW(), NOW()),
('REST012', 'Reparación de Fractura', 'Restauración de diente fracturado con resina', 'restorative', 'available', NOW(), NOW()),

-- ENDODÓNTICOS - Tratamientos de conducto
('ENDO001', 'Endodoncia Unirradicular', 'Tratamiento de conducto en diente de una raíz', 'endodontic', 'available', NOW(), NOW()),
('ENDO002', 'Endodoncia Birradicular', 'Tratamiento de conducto en diente de dos raíces', 'endodontic', 'available', NOW(), NOW()),
('ENDO003', 'Endodoncia Multirradicular', 'Tratamiento de conducto en diente de múltiples raíces', 'endodontic', 'available', NOW(), NOW()),
('ENDO004', 'Retratamiento Endodóntico', 'Nuevo tratamiento de conducto en diente previamente tratado', 'endodontic', 'available', NOW(), NOW()),
('ENDO005', 'Apicectomía', 'Cirugía apical para resolver infección en el ápice radicular', 'endodontic', 'available', NOW(), NOW()),
('ENDO006', 'Pulpotomía', 'Remoción parcial de la pulpa dental en dientes temporales', 'endodontic', 'available', NOW(), NOW()),
('ENDO007', 'Pulpectomía', 'Remoción completa de la pulpa en dientes temporales', 'endodontic', 'available', NOW(), NOW()),

-- PREVENTIVOS - Tratamientos de prevención
('PREV001', 'Profilaxis Dental', 'Limpieza dental profesional básica', 'preventive', 'available', NOW(), NOW()),
('PREV002', 'Fluorización', 'Aplicación tópica de flúor para prevención de caries', 'preventive', 'available', NOW(), NOW()),
('PREV003', 'Sellantes de Fosas y Fisuras', 'Sellado preventivo de molares y premolares', 'preventive', 'available', NOW(), NOW()),
('PREV004', 'Detartraje Supragingival', 'Remoción de cálculo dental por encima de la encía', 'preventive', 'available', NOW(), NOW()),
('PREV005', 'Detartraje Subgingival', 'Remoción de cálculo dental por debajo de la encía', 'preventive', 'available', NOW(), NOW()),
('PREV006', 'Educación en Higiene Oral', 'Instrucción personalizada en técnicas de higiene', 'preventive', 'available', NOW(), NOW()),

-- PERIODONTALES - Tratamientos de encías
('PERIO001', 'Curetaje Dental', 'Limpieza profunda de las raíces dentales', 'periodontic', 'available', NOW(), NOW()),
('PERIO002', 'Cirugía Periodontal', 'Cirugía para tratar enfermedad periodontal avanzada', 'periodontic', 'available', NOW(), NOW()),
('PERIO003', 'Injerto de Encía', 'Trasplante de tejido gingival para cubrir recesiones', 'periodontic', 'available', NOW(), NOW()),
('PERIO004', 'Gingivectomía', 'Remoción quirúrgica de tejido gingival excesivo', 'periodontic', 'available', NOW(), NOW()),
('PERIO005', 'Alargamiento de Corona', 'Exposición de más superficie dental mediante cirugía', 'periodontic', 'available', NOW(), NOW()),

-- CIRUGÍA ORAL - Procedimientos quirúrgicos
('SURG001', 'Extracción Simple', 'Extracción dental sin complicaciones', 'oral_surgery', 'available', NOW(), NOW()),
('SURG002', 'Extracción Compleja', 'Extracción dental con osteotomía o odontosección', 'oral_surgery', 'available', NOW(), NOW()),
('SURG003', 'Extracción de Cordal', 'Extracción de muelas del juicio', 'oral_surgery', 'available', NOW(), NOW()),
('SURG004', 'Extracción Quirúrgica', 'Extracción con colgajo y osteotomía', 'oral_surgery', 'available', NOW(), NOW()),
('SURG005', 'Biopsia Oral', 'Toma de muestra de tejido para análisis histopatológico', 'oral_surgery', 'available', NOW(), NOW()),
('SURG006', 'Frenectomía', 'Cirugía para corregir frenillo lingual o labial', 'oral_surgery', 'available', NOW(), NOW()),

-- PROTÉSICOS - Prótesis dentales
('PROT001', 'Prótesis Total Superior', 'Dentadura completa para maxilar superior', 'prosthodontic', 'available', NOW(), NOW()),
('PROT002', 'Prótesis Total Inferior', 'Dentadura completa para maxilar inferior', 'prosthodontic', 'available', NOW(), NOW()),
('PROT003', 'Prótesis Parcial Removible', 'Prótesis para reemplazar algunos dientes perdidos', 'prosthodontic', 'available', NOW(), NOW()),
('PROT004', 'Prótesis Fija (Puente)', 'Puente fijo para reemplazar dientes perdidos', 'prosthodontic', 'available', NOW(), NOW()),
('PROT005', 'Implante Dental', 'Colocación de implante de titanio', 'prosthodontic', 'available', NOW(), NOW()),
('PROT006', 'Corona sobre Implante', 'Corona protésica sobre implante dental', 'prosthodontic', 'available', NOW(), NOW()),

-- ESTÉTICOS - Tratamientos cosméticos
('ESTH001', 'Blanqueamiento en Consultorio', 'Blanqueamiento dental profesional con luz LED', 'cosmetic', 'available', NOW(), NOW()),
('ESTH002', 'Blanqueamiento Casero', 'Kit de blanqueamiento para uso domiciliario', 'cosmetic', 'available', NOW(), NOW()),
('ESTH003', 'Microabrasión del Esmalte', 'Remoción de manchas superficiales del esmalte', 'cosmetic', 'available', NOW(), NOW()),
('ESTH004', 'Contorno Estético', 'Remodelado del contorno dental con resina', 'cosmetic', 'available', NOW(), NOW()),
('ESTH005', 'Cierre de Diastema', 'Cierre de espacios entre dientes con resina', 'cosmetic', 'available', NOW(), NOW()),

-- ORTODÓNCICOS - Tratamientos de ortodoncia
('ORTHO001', 'Consulta Ortodóncica', 'Evaluación inicial para tratamiento ortodóncico', 'orthodontic', 'available', NOW(), NOW()),
('ORTHO002', 'Brackets Metálicos', 'Instalación de aparatología fija metálica', 'orthodontic', 'available', NOW(), NOW()),
('ORTHO003', 'Brackets Estéticos', 'Instalación de brackets de cerámica o zafiro', 'orthodontic', 'available', NOW(), NOW()),
('ORTHO004', 'Invisalign', 'Tratamiento con alineadores transparentes', 'orthodontic', 'available', NOW(), NOW()),
('ORTHO005', 'Retenedores', 'Aparatos de retención post-tratamiento', 'orthodontic', 'available', NOW(), NOW()),
('ORTHO006', 'Expansor Palatino', 'Aparato para expandir el paladar', 'orthodontic', 'available', NOW(), NOW()),

-- EMERGENCIAS - Tratamientos de urgencia
('EMERG001', 'Consulta de Urgencia', 'Atención inmediata por dolor o trauma dental', 'emergency', 'available', NOW(), NOW()),
('EMERG002', 'Drenaje de Absceso', 'Procedimiento para drenar infección dental', 'emergency', 'available', NOW(), NOW()),
('EMERG003', 'Reimplante Dental', 'Reimplantación de diente avulsionado', 'emergency', 'available', NOW(), NOW()),
('EMERG004', 'Ferulización Dental', 'Estabilización de dientes traumatizados', 'emergency', 'available', NOW(), NOW()),
('EMERG005', 'Medicación Intraconducto', 'Colocación de medicamento en conducto infectado', 'emergency', 'available', NOW(), NOW()),

-- CONSULTAS - Evaluaciones y diagnósticos
('CONS001', 'Consulta General', 'Evaluación dental general y diagnóstico', 'consultation', 'available', NOW(), NOW()),
('CONS002', 'Consulta Especializada', 'Evaluación por especialista dental', 'consultation', 'available', NOW(), NOW()),
('CONS003', 'Radiografía Periapical', 'Radiografía de diente específico', 'consultation', 'available', NOW(), NOW()),
('CONS004', 'Radiografía Panorámica', 'Radiografía completa de ambos maxilares', 'consultation', 'available', NOW(), NOW()),
('CONS005', 'Fotografías Intraorales', 'Documentación fotográfica para diagnóstico', 'consultation', 'available', NOW(), NOW()),
('CONS006', 'Modelos de Estudio', 'Impresiones para análisis del caso', 'consultation', 'available', NOW(), NOW());

-- Verificar que se insertaron correctamente
SELECT COUNT(*) as total_treatments FROM treatments;
SELECT category, COUNT(*) as count FROM treatments GROUP BY category ORDER BY category;
