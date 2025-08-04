-- =====================================================
-- MASTER SCRIPT - EJECUTAR TODOS LOS DIAGNÓSTICOS
-- =====================================================
-- Este archivo ejecuta todos los seeds de diagnósticos en orden

-- Ejecutar en orden:
-- 1. Caries
\i 01-caries-diagnoses.sql

-- 2. Periodontal
\i 02-periodontal-diagnoses.sql

-- 3. Endodóntica
\i 03-endodontic-diagnoses.sql

-- 4. Para las otras categorías, crear archivos similares...

-- RESUMEN FINAL
SELECT 
    'RESUMEN GENERAL' as info,
    category,
    COUNT(*) as total_diagnoses,
    COUNT(CASE WHEN severity = 'mild' THEN 1 END) as mild,
    COUNT(CASE WHEN severity = 'moderate' THEN 1 END) as moderate,
    COUNT(CASE WHEN severity = 'severe' THEN 1 END) as severe,
    COUNT(CASE WHEN severity = 'critical' THEN 1 END) as critical,
    COUNT(CASE WHEN requires_immediate_attention = true THEN 1 END) as urgente,
    COUNT(CASE WHEN tooth_specific = true THEN 1 END) as diente_especifico
FROM diagnoses 
GROUP BY category 
ORDER BY category;

-- Total general
SELECT 
    'TOTAL GENERAL' as categoria,
    COUNT(*) as total_diagnoses,
    COUNT(DISTINCT category) as categorias_diferentes
FROM diagnoses;
