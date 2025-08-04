-- =====================================================
-- SEED DATA PARA TRATAMIENTOS ODONTOLÓGICOS - PASO 2
-- =====================================================
-- Insertando la categoría RESTAURATIVA

-- =====================================================
-- PASO 2: CATEGORÍA RESTAURATIVA
-- =====================================================
-- Tratamientos de restauración dental

INSERT INTO treatments (
    treatment_code, name, description, category, base_cost, 
    estimated_duration, requires_anesthesia, tooth_specific, 
    status, clinic_id, created_at, updated_at
) VALUES
-- RESTAURATIVOS - Tratamientos de restauración
('REST001', 'Obturación con Amalgama', 'Restauración con amalgama dental para caries pequeñas a moderadas', 'restorative', 60.00, 45, true, true, 'available', 1, NOW(), NOW()),
('REST002', 'Obturación con Resina', 'Restauración estética con composite para caries anteriores y posteriores', 'restorative', 80.00, 60, true, true, 'available', 1, NOW(), NOW()),
('REST003', 'Obturación con Ionómero', 'Restauración con ionómero de vidrio para áreas cervicales', 'restorative', 70.00, 50, false, true, 'available', 1, NOW(), NOW()),
('REST004', 'Incrustación (Inlay)', 'Restauración indirecta de resina o cerámica para cavidades moderadas', 'restorative', 250.00, 90, true, true, 'available', 1, NOW(), NOW()),
('REST005', 'Incrustación (Onlay)', 'Restauración indirecta que cubre cúspides dentales', 'restorative', 300.00, 120, true, true, 'available', 1, NOW(), NOW()),
('REST006', 'Corona de Porcelana', 'Corona completa de cerámica para restauración estética', 'restorative', 500.00, 150, true, true, 'available', 1, NOW(), NOW()),
('REST007', 'Corona Metal-Porcelana', 'Corona con base metálica y recubrimiento cerámico', 'restorative', 400.00, 120, true, true, 'available', 1, NOW(), NOW()),
('REST008', 'Corona de Zirconia', 'Corona de óxido de zirconio de alta resistencia', 'restorative', 600.00, 150, true, true, 'available', 1, NOW(), NOW()),
('REST009', 'Reconstrucción con Poste', 'Reconstrucción de diente con poste de fibra de vidrio', 'restorative', 180.00, 90, true, true, 'available', 1, NOW(), NOW()),
('REST010', 'Carilla de Porcelana', 'Lámina cerámica para mejorar estética dental anterior', 'restorative', 350.00, 120, false, true, 'available', 1, NOW(), NOW()),
('REST011', 'Carilla de Resina', 'Lámina de composite para corrección estética menor', 'restorative', 200.00, 90, false, true, 'available', 1, NOW(), NOW()),
('REST012', 'Reparación de Fractura', 'Restauración de diente fracturado con resina', 'restorative', 120.00, 75, true, true, 'available', 1, NOW(), NOW());

-- Para verificar la inserción:
SELECT 
    category,
    COUNT(*) as total_treatments,
    AVG(base_cost) as costo_promedio,
    AVG(estimated_duration) as duracion_promedio,
    COUNT(CASE WHEN requires_anesthesia = true THEN 1 END) as con_anestesia,
    COUNT(CASE WHEN tooth_specific = true THEN 1 END) as diente_especifico
FROM treatments 
WHERE category = 'restorative'
GROUP BY category;
