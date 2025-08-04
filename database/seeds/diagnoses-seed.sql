-- =====================================================
-- SEED DATA PARA DIAGNÓSTICOS ODONTOLÓGICOS
-- =====================================================
-- Este archivo inserta diagnósticos organizados por categorías
-- Primero se definen las categorías disponibles como referencia
-- Luego se insertan los diagnósticos específicos por categoría

-- =====================================================
-- CATEGORÍAS DISPONIBLES (Enum DiagnosisCategory)
-- =====================================================
-- Las siguientes categorías están definidas en el enum:
-- 'caries' - Diagnósticos relacionados con caries dental
-- 'periodontal' - Enfermedades de encías y periodonto
-- 'endodontic' - Problemas de pulpa y endodoncia
-- 'orthodontic' - Malposiciones y ortodoncia
-- 'oral_surgery' - Cirugía oral y maxilofacial
-- 'oral_pathology' - Patologías de la mucosa oral
-- 'tmj' - Trastornos temporomandibulares
-- 'trauma' - Traumatismos dentales y orales
-- 'congenital' - Anomalías congénitas
-- 'preventive' - Diagnósticos preventivos

-- =====================================================
-- PASO 1: CATEGORÍA CARIES
-- =====================================================
-- Diagnósticos relacionados con lesiones cariosas

INSERT INTO diagnoses (
    diagnosis_code, name, description, category, severity, 
    is_chronic, requires_immediate_attention, tooth_specific, 
    status, clinic_id, created_at, updated_at
) VALUES
-- CARIES - Diagnósticos ordenados por severidad
('CAR001', 'Caries Inicial (Esmalte)', 'Desmineralización inicial del esmalte dental, reversible con flúor', 'caries', 'mild', false, false, true, 'active', 1, NOW(), NOW()),
('CAR002', 'Caries Superficial', 'Caries limitada al esmalte superficial, cavitación mínima', 'caries', 'mild', false, false, true, 'active', 1, NOW(), NOW()),
('CAR003', 'Caries Dentinaria', 'Caries que compromete la dentina pero no la pulpa', 'caries', 'moderate', false, false, true, 'active', 1, NOW(), NOW()),
('CAR004', 'Caries Profunda', 'Caries extensa en dentina cerca de la cámara pulpar', 'caries', 'severe', false, true, true, 'active', 1, NOW(), NOW()),
('CAR005', 'Caries Pulpar', 'Caries que ha alcanzado la pulpa dental', 'caries', 'critical', false, true, true, 'active', 1, NOW(), NOW()),
('CAR006', 'Caries Radicular', 'Caries en la superficie radicular expuesta', 'caries', 'moderate', false, false, true, 'active', 1, NOW(), NOW()),
('CAR007', 'Caries Recurrente', 'Caries secundaria alrededor de restauraciones existentes', 'caries', 'moderate', false, false, true, 'active', 1, NOW(), NOW()),
('CAR008', 'Caries Rampante', 'Múltiples caries de progresión rápida', 'caries', 'critical', true, true, false, 'active', 1, NOW(), NOW()),

-- =====================================================
-- PASO 2: CATEGORÍA PERIODONTAL
-- =====================================================
-- Diagnósticos de enfermedades de encías y periodonto

('PER001', 'Gingivitis Leve', 'Inflamación superficial de encías sin pérdida de inserción', 'periodontal', 'mild', false, false, false, 'active', 1, NOW(), NOW()),
('PER002', 'Gingivitis Moderada', 'Inflamación gingival con sangrado al sondaje', 'periodontal', 'moderate', false, false, false, 'active', 1, NOW(), NOW()),
('PER003', 'Gingivitis Severa', 'Inflamación intensa con sangrado espontáneo', 'periodontal', 'severe', false, true, false, 'active', 1, NOW(), NOW()),
('PER004', 'Periodontitis Incipiente', 'Pérdida inicial de inserción (1-2mm)', 'periodontal', 'moderate', false, false, false, 'active', 1, NOW(), NOW()),
('PER005', 'Periodontitis Moderada', 'Pérdida de inserción de 3-4mm', 'periodontal', 'severe', true, false, false, 'active', 1, NOW(), NOW()),
('PER006', 'Periodontitis Severa', 'Pérdida de inserción mayor a 5mm', 'periodontal', 'critical', true, true, false, 'active', 1, NOW(), NOW()),
('PER007', 'Periodontitis Agresiva', 'Forma rápidamente progresiva en pacientes jóvenes', 'periodontal', 'critical', true, true, false, 'active', 1, NOW(), NOW()),
('PER008', 'Recesión Gingival', 'Migración apical del margen gingival', 'periodontal', 'moderate', false, false, true, 'active', 1, NOW(), NOW()),
('PER009', 'Hiperplasia Gingival', 'Crecimiento excesivo del tejido gingival', 'periodontal', 'moderate', false, false, false, 'active', 1, NOW(), NOW()),
('PER010', 'Absceso Periodontal', 'Infección localizada en el periodonto', 'periodontal', 'critical', false, true, true, 'active', 1, NOW(), NOW()),

-- =====================================================
-- PASO 3: CATEGORÍA ENDODÓNTICA
-- =====================================================
-- Diagnósticos de problemas pulpares y periapicales

('END001', 'Pulpa Vital Normal', 'Pulpa sin signos de patología', 'endodontic', NULL, false, false, true, 'active', 1, NOW(), NOW()),
('END002', 'Pulpitis Reversible', 'Inflamación pulpar leve que puede sanar', 'endodontic', 'mild', false, false, true, 'active', 1, NOW(), NOW()),
('END003', 'Pulpitis Irreversible', 'Inflamación pulpar severa que requiere endodoncia', 'endodontic', 'severe', false, true, true, 'active', 1, NOW(), NOW()),
('END004', 'Necrosis Pulpar', 'Muerte del tejido pulpar', 'endodontic', 'severe', false, true, true, 'active', 1, NOW(), NOW()),
('END005', 'Periodontitis Apical Aguda', 'Inflamación aguda del ligamento periodontal apical', 'endodontic', 'severe', false, true, true, 'active', 1, NOW(), NOW()),
('END006', 'Periodontitis Apical Crónica', 'Inflamación crónica periapical con lesión radiolúcida', 'endodontic', 'moderate', true, false, true, 'active', 1, NOW(), NOW()),
('END007', 'Absceso Apical Agudo', 'Colección purulenta en región apical', 'endodontic', 'critical', false, true, true, 'active', 1, NOW(), NOW()),
('END008', 'Absceso Apical Crónico', 'Drenaje crónico por fístula', 'endodontic', 'moderate', true, false, true, 'active', 1, NOW(), NOW()),
('END009', 'Granuloma Apical', 'Tejido de granulación en región apical', 'endodontic', 'moderate', true, false, true, 'active', 1, NOW(), NOW()),
('END010', 'Quiste Radicular', 'Lesión quística en región apical', 'endodontic', 'moderate', true, false, true, 'active', 1, NOW(), NOW()),

-- =====================================================
-- PASO 4: CATEGORÍA ORTODÓNTICA
-- =====================================================
-- Diagnósticos de malposiciones y problemas ortodónticos

('ORT001', 'Oclusión Normal', 'Relación dental y esqueletal normal', 'orthodontic', NULL, false, false, false, 'active', 1, NOW(), NOW()),
('ORT002', 'Maloclusión Clase I', 'Relación molar normal con irregularidades dentales', 'orthodontic', 'mild', false, false, false, 'active', 1, NOW(), NOW()),
('ORT003', 'Maloclusión Clase II División 1', 'Overjet aumentado con incisivos proinclinados', 'orthodontic', 'moderate', false, false, false, 'active', 1, NOW(), NOW()),
('ORT004', 'Maloclusión Clase II División 2', 'Overjet normal con incisivos retroinclinados', 'orthodontic', 'moderate', false, false, false, 'active', 1, NOW(), NOW()),
('ORT005', 'Maloclusión Clase III', 'Prognatismo mandibular o retrognatismo maxilar', 'orthodontic', 'moderate', false, false, false, 'active', 1, NOW(), NOW()),
('ORT006', 'Apiñamiento Dental Leve', 'Desalineación dental menor a 4mm', 'orthodontic', 'mild', false, false, false, 'active', 1, NOW(), NOW()),
('ORT007', 'Apiñamiento Dental Moderado', 'Desalineación dental de 4-8mm', 'orthodontic', 'moderate', false, false, false, 'active', 1, NOW(), NOW()),
('ORT008', 'Apiñamiento Dental Severo', 'Desalineación dental mayor a 8mm', 'orthodontic', 'severe', false, false, false, 'active', 1, NOW(), NOW()),
('ORT009', 'Diastema Central', 'Espacio entre incisivos centrales superiores', 'orthodontic', 'mild', false, false, true, 'active', 1, NOW(), NOW()),
('ORT010', 'Mordida Abierta Anterior', 'Falta de contacto en sector anterior', 'orthodontic', 'moderate', false, false, false, 'active', 1, NOW(), NOW()),
('ORT011', 'Mordida Cruzada Posterior', 'Relación vestíbulo-lingual invertida posterior', 'orthodontic', 'moderate', false, false, false, 'active', 1, NOW(), NOW()),
('ORT012', 'Mordida Profunda', 'Sobremordida vertical excesiva', 'orthodontic', 'moderate', false, false, false, 'active', 1, NOW(), NOW()),

-- =====================================================
-- PASO 5: CATEGORÍA CIRUGÍA ORAL
-- =====================================================
-- Diagnósticos relacionados con cirugía oral y maxilofacial

('CIR001', 'Diente Impactado', 'Diente que no puede erupcionar normalmente', 'oral_surgery', 'moderate', false, false, true, 'active', 1, NOW(), NOW()),
('CIR002', 'Tercer Molar Impactado', 'Muela del juicio que requiere extracción quirúrgica', 'oral_surgery', 'moderate', false, false, true, 'active', 1, NOW(), NOW()),
('CIR003', 'Diente Supernumerario', 'Diente adicional a la dentición normal', 'oral_surgery', 'mild', false, false, true, 'active', 1, NOW(), NOW()),
('CIR004', 'Extracción Simple', 'Extracción dental sin complicaciones', 'oral_surgery', 'mild', false, false, true, 'active', 1, NOW(), NOW()),
('CIR005', 'Extracción Compleja', 'Extracción que requiere técnica quirúrgica', 'oral_surgery', 'moderate', false, false, true, 'active', 1, NOW(), NOW()),
('CIR006', 'Alveolitis Seca', 'Inflamación del alvéolo post-extracción', 'oral_surgery', 'moderate', false, true, true, 'active', 1, NOW(), NOW()),
('CIR007', 'Frenectomía', 'Resección quirúrgica del frenillo', 'oral_surgery', 'mild', false, false, false, 'active', 1, NOW(), NOW()),
('CIR008', 'Biopsia Oral', 'Toma de muestra para estudio histopatológico', 'oral_surgery', 'moderate', false, false, false, 'active', 1, NOW(), NOW()),
('CIR009', 'Implante Dental', 'Colocación de implante osteointegrado', 'oral_surgery', 'moderate', false, false, true, 'active', 1, NOW(), NOW()),
('CIR010', 'Injerto Óseo', 'Regeneración ósea para implantología', 'oral_surgery', 'moderate', false, false, false, 'active', 1, NOW(), NOW()),

-- =====================================================
-- PASO 6: CATEGORÍA PATOLOGÍA ORAL
-- =====================================================
-- Diagnósticos de patologías de mucosa y tejidos blandos

('PAT001', 'Mucosa Oral Normal', 'Tejidos de mucosa sin alteraciones', 'oral_pathology', NULL, false, false, false, 'active', 1, NOW(), NOW()),
('PAT002', 'Aftas Menores', 'Úlceras pequeñas recurrentes de mucosa oral', 'oral_pathology', 'mild', true, false, false, 'active', 1, NOW(), NOW()),
('PAT003', 'Aftas Mayores', 'Úlceras grandes dolorosas de mucosa oral', 'oral_pathology', 'moderate', true, false, false, 'active', 1, NOW(), NOW()),
('PAT004', 'Estomatitis Aftosa', 'Múltiples úlceras en mucosa oral', 'oral_pathology', 'moderate', false, false, false, 'active', 1, NOW(), NOW()),
('PAT005', 'Leucoplasia', 'Placa blanca que no se desprende al raspado', 'oral_pathology', 'moderate', false, false, false, 'active', 1, NOW(), NOW()),
('PAT006', 'Eritroplasia', 'Placa roja de mucosa oral', 'oral_pathology', 'severe', false, true, false, 'active', 1, NOW(), NOW()),
('PAT007', 'Liquen Plano Oral', 'Enfermedad inflamatoria crónica de mucosa', 'oral_pathology', 'moderate', true, false, false, 'active', 1, NOW(), NOW()),
('PAT008', 'Candidiasis Oral', 'Infección micótica de la cavidad oral', 'oral_pathology', 'moderate', false, false, false, 'active', 1, NOW(), NOW()),
('PAT009', 'Herpes Labial', 'Infección viral recurrente en labios', 'oral_pathology', 'mild', true, false, false, 'active', 1, NOW(), NOW()),
('PAT010', 'Glositis', 'Inflamación de la lengua', 'oral_pathology', 'mild', false, false, false, 'active', 1, NOW(), NOW()),

-- =====================================================
-- PASO 7: CATEGORÍA TMJ (Trastornos Temporomandibulares)
-- =====================================================
-- Diagnósticos de la articulación temporomandibular

('TMJ001', 'ATM Normal', 'Articulación temporomandibular sin alteraciones', 'tmj', NULL, false, false, false, 'active', 1, NOW(), NOW()),
('TMJ002', 'Disfunción TMJ Leve', 'Molestias leves en la articulación', 'tmj', 'mild', false, false, false, 'active', 1, NOW(), NOW()),
('TMJ003', 'Disfunción TMJ Moderada', 'Dolor y limitación funcional moderada', 'tmj', 'moderate', true, false, false, 'active', 1, NOW(), NOW()),
('TMJ004', 'Disfunción TMJ Severa', 'Dolor intenso y limitación severa de apertura', 'tmj', 'severe', true, true, false, 'active', 1, NOW(), NOW()),
('TMJ005', 'Bruxismo Nocturno', 'Apretamiento y rechinamiento durante el sueño', 'tmj', 'moderate', true, false, false, 'active', 1, NOW(), NOW()),
('TMJ006', 'Bruxismo Diurno', 'Apretamiento consciente durante el día', 'tmj', 'mild', true, false, false, 'active', 1, NOW(), NOW()),
('TMJ007', 'Luxación TMJ', 'Dislocación de la articulación temporomandibular', 'tmj', 'severe', false, true, false, 'active', 1, NOW(), NOW()),
('TMJ008', 'Artritis TMJ', 'Proceso inflamatorio articular', 'tmj', 'moderate', true, false, false, 'active', 1, NOW(), NOW()),
('TMJ009', 'Anquilosis TMJ', 'Limitación severa de apertura bucal', 'tmj', 'critical', true, true, false, 'active', 1, NOW(), NOW()),

-- =====================================================
-- PASO 8: CATEGORÍA TRAUMA
-- =====================================================
-- Diagnósticos relacionados con traumatismos dentales

('TRA001', 'Fractura de Esmalte', 'Fractura limitada al esmalte dental', 'trauma', 'mild', false, false, true, 'active', 1, NOW(), NOW()),
('TRA002', 'Fractura de Esmalte-Dentina', 'Fractura que compromete esmalte y dentina', 'trauma', 'moderate', false, true, true, 'active', 1, NOW(), NOW()),
('TRA003', 'Fractura Complicada de Corona', 'Fractura con exposición pulpar', 'trauma', 'severe', false, true, true, 'active', 1, NOW(), NOW()),
('TRA004', 'Fractura Radicular', 'Fractura de la raíz dental', 'trauma', 'severe', false, true, true, 'active', 1, NOW(), NOW()),
('TRA005', 'Concusión Dental', 'Trauma sin desplazamiento ni movilidad', 'trauma', 'mild', false, false, true, 'active', 1, NOW(), NOW()),
('TRA006', 'Subluxación', 'Trauma con movilidad pero sin desplazamiento', 'trauma', 'moderate', false, true, true, 'active', 1, NOW(), NOW()),
('TRA007', 'Luxación Lateral', 'Desplazamiento del diente en dirección axial', 'trauma', 'severe', false, true, true, 'active', 1, NOW(), NOW()),
('TRA008', 'Luxación Intrusiva', 'Desplazamiento del diente hacia el alvéolo', 'trauma', 'critical', false, true, true, 'active', 1, NOW(), NOW()),
('TRA009', 'Luxación Extrusiva', 'Desplazamiento del diente fuera del alvéolo', 'trauma', 'severe', false, true, true, 'active', 1, NOW(), NOW()),
('TRA010', 'Avulsión Dental', 'Pérdida completa del diente del alvéolo', 'trauma', 'critical', false, true, true, 'active', 1, NOW(), NOW()),

-- =====================================================
-- PASO 9: CATEGORÍA CONGÉNITAS
-- =====================================================
-- Diagnósticos de anomalías del desarrollo y congénitas

('CON001', 'Desarrollo Normal', 'Desarrollo dental y maxilofacial normal', 'congenital', NULL, false, false, false, 'active', 1, NOW(), NOW()),
('CON002', 'Anodoncia Total', 'Ausencia completa de dientes', 'congenital', 'severe', true, false, false, 'active', 1, NOW(), NOW()),
('CON003', 'Anodoncia Parcial', 'Ausencia de algunos dientes por desarrollo', 'congenital', 'moderate', true, false, true, 'active', 1, NOW(), NOW()),
('CON004', 'Hipodoncia', 'Ausencia de 1-5 dientes por desarrollo', 'congenital', 'mild', true, false, true, 'active', 1, NOW(), NOW()),
('CON005', 'Oligodoncia', 'Ausencia de 6 o más dientes', 'congenital', 'severe', true, false, false, 'active', 1, NOW(), NOW()),
('CON006', 'Supernumerarios Múltiples', 'Presencia de múltiples dientes extras', 'congenital', 'moderate', false, false, false, 'active', 1, NOW(), NOW()),
('CON007', 'Macrodoncia', 'Dientes de tamaño mayor al normal', 'congenital', 'mild', false, false, true, 'active', 1, NOW(), NOW()),
('CON008', 'Microdoncia', 'Dientes de tamaño menor al normal', 'congenital', 'mild', false, false, true, 'active', 1, NOW(), NOW()),
('CON009', 'Fisura Labial', 'Hendidura del labio superior', 'congenital', 'moderate', false, false, false, 'active', 1, NOW(), NOW()),
('CON010', 'Fisura Palatina', 'Hendidura del paladar', 'congenital', 'severe', false, false, false, 'active', 1, NOW(), NOW()),
('CON011', 'Fisura Labiopalatina', 'Hendidura de labio y paladar', 'congenital', 'severe', false, false, false, 'active', 1, NOW(), NOW()),
('CON012', 'Amelogénesis Imperfecta', 'Defecto en la formación del esmalte', 'congenital', 'moderate', true, false, false, 'active', 1, NOW(), NOW()),
('CON013', 'Dentinogénesis Imperfecta', 'Defecto en la formación de la dentina', 'congenital', 'moderate', true, false, false, 'active', 1, NOW(), NOW()),

-- =====================================================
-- PASO 10: CATEGORÍA PREVENTIVA
-- =====================================================
-- Diagnósticos relacionados con prevención y mantenimiento

('PRE001', 'Salud Oral Óptima', 'Estado de salud oral sin patologías', 'preventive', NULL, false, false, false, 'active', 1, NOW(), NOW()),
('PRE002', 'Riesgo de Caries Bajo', 'Paciente con bajo riesgo de desarrollar caries', 'preventive', NULL, false, false, false, 'active', 1, NOW(), NOW()),
('PRE003', 'Riesgo de Caries Moderado', 'Paciente con riesgo moderado de caries', 'preventive', 'mild', false, false, false, 'active', 1, NOW(), NOW()),
('PRE004', 'Riesgo de Caries Alto', 'Paciente con alto riesgo de desarrollar caries', 'preventive', 'moderate', false, false, false, 'active', 1, NOW(), NOW()),
('PRE005', 'Higiene Oral Deficiente', 'Acumulación de placa y cálculo dental', 'preventive', 'mild', false, false, false, 'active', 1, NOW(), NOW()),
('PRE006', 'Necesidad de Selladores', 'Fosas y fisuras susceptibles a caries', 'preventive', NULL, false, false, true, 'active', 1, NOW(), NOW()),
('PRE007', 'Fluorosis Dental', 'Alteración del esmalte por exceso de flúor', 'preventive', 'mild', false, false, false, 'active', 1, NOW(), NOW()),
('PRE008', 'Educación en Higiene', 'Necesidad de instrucción en técnicas de higiene', 'preventive', NULL, false, false, false, 'active', 1, NOW(), NOW()),
('PRE009', 'Control Periódico', 'Seguimiento preventivo de rutina', 'preventive', NULL, false, false, false, 'active', 1, NOW(), NOW()),
('PRE010', 'Aplicación de Flúor', 'Tratamiento preventivo con fluoruros', 'preventive', NULL, false, false, false, 'active', 1, NOW(), NOW());

-- =====================================================
-- INSTRUCCIONES DE USO
-- =====================================================

-- Para ejecutar este archivo:
-- 1. Asegúrate de que la tabla 'diagnoses' existe
-- 2. Ejecuta: mysql -u usuario -p base_de_datos < diagnoses-seed.sql
-- 3. O desde MySQL Workbench: File > Run SQL Script

-- Para verificar la inserción:
SELECT 
    category,
    COUNT(*) as total_diagnoses,
    COUNT(CASE WHEN severity = 'mild' THEN 1 END) as mild,
    COUNT(CASE WHEN severity = 'moderate' THEN 1 END) as moderate,
    COUNT(CASE WHEN severity = 'severe' THEN 1 END) as severe,
    COUNT(CASE WHEN severity = 'critical' THEN 1 END) as critical
FROM diagnoses 
GROUP BY category 
ORDER BY category;

-- Para múltiples clínicas, duplica cambiando clinic_id:
-- INSERT INTO diagnoses (diagnosis_code, name, description, category, severity, is_chronic, requires_immediate_attention, tooth_specific, status, clinic_id, created_at, updated_at)
-- SELECT CONCAT(diagnosis_code, '_C2'), name, description, category, severity, is_chronic, requires_immediate_attention, tooth_specific, status, 2, NOW(), NOW()
-- FROM diagnoses WHERE clinic_id = 1;
