-- =====================================================
-- MASTER SCRIPT - EJECUTAR TODOS LOS TRATAMIENTOS
-- =====================================================
-- Este archivo ejecuta todos los seeds de tratamientos en orden

-- CATEGORÍAS DISPONIBLES (Enum TreatmentCategory):
-- 'preventive' - Tratamientos preventivos
-- 'restorative' - Tratamientos restaurativos  
-- 'endodontic' - Tratamientos endodónticos
-- 'periodontic' - Tratamientos periodontales
-- 'oral_surgery' - Cirugía oral
-- 'orthodontic' - Tratamientos ortodónticos
-- 'prosthodontic' - Tratamientos protésicos
-- 'cosmetic' - Tratamientos estéticos
-- 'emergency' - Tratamientos de emergencia
-- 'consultation' - Consultas y evaluaciones

-- Ejecutar en orden:
-- \i 01-preventive-treatments.sql
-- \i 02-restorative-treatments.sql  
-- \i 03-endodontic-treatments.sql
-- \i 04-periodontic-treatments.sql
-- \i 05-oral-surgery-treatments.sql
-- \i 06-remaining-treatments.sql

-- =====================================================
-- RESUMEN COMPLETO DE TRATAMIENTOS
-- =====================================================

SELECT 
    'RESUMEN POR CATEGORÍA' as tipo_reporte,
    category as categoria,
    COUNT(*) as total_tratamientos,
    ROUND(AVG(base_cost), 2) as costo_promedio,
    ROUND(AVG(estimated_duration), 0) as duracion_promedio_min,
    COUNT(CASE WHEN requires_anesthesia = true THEN 1 END) as requiere_anestesia,
    COUNT(CASE WHEN tooth_specific = true THEN 1 END) as diente_especifico,
    MIN(base_cost) as costo_minimo,
    MAX(base_cost) as costo_maximo
FROM treatments 
GROUP BY category 
ORDER BY category;

-- Total general
SELECT 
    'ESTADÍSTICAS GENERALES' as tipo_reporte,
    COUNT(*) as total_tratamientos,
    COUNT(DISTINCT category) as categorias_diferentes,
    ROUND(AVG(base_cost), 2) as costo_promedio_general,
    ROUND(AVG(estimated_duration), 0) as duracion_promedio_general,
    COUNT(CASE WHEN requires_anesthesia = true THEN 1 END) as total_con_anestesia,
    COUNT(CASE WHEN tooth_specific = true THEN 1 END) as total_diente_especifico,
    COUNT(CASE WHEN status = 'available' THEN 1 END) as tratamientos_disponibles
FROM treatments;

-- Tratamientos más caros por categoría
SELECT 
    'TRATAMIENTOS MÁS COSTOSOS' as tipo_reporte,
    category,
    treatment_code,
    name,
    base_cost,
    estimated_duration
FROM treatments t1
WHERE base_cost = (
    SELECT MAX(base_cost) 
    FROM treatments t2 
    WHERE t2.category = t1.category
)
ORDER BY category, base_cost DESC;

-- Tratamientos que requieren anestesia
SELECT 
    'TRATAMIENTOS CON ANESTESIA' as tipo_reporte,
    category,
    COUNT(*) as cantidad_con_anestesia,
    ROUND(AVG(base_cost), 2) as costo_promedio_con_anestesia
FROM treatments 
WHERE requires_anesthesia = true
GROUP BY category
ORDER BY cantidad_con_anestesia DESC;
