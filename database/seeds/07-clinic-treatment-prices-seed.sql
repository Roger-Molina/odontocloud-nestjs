-- Seed para precios de tratamientos por clínica
-- Este archivo se debe ejecutar después de tener clínicas y tratamientos

INSERT INTO clinic_treatment_prices (
    clinic_id,
    treatment_id,
    base_price,
    insurance_price,
    min_duration_minutes,
    max_duration_minutes,
    estimated_sessions,
    requires_anesthesia,
    anesthesia_cost,
    material_cost,
    is_active,
    effective_from,
    notes,
    created_at,
    updated_at
) VALUES
-- Clínica 1 - Precios estándar
(1, 1, 50000.00, 40000.00, 30, 45, 1, false, 0, 5000.00, true, '2024-01-01', 'Limpieza dental básica', NOW(), NOW()),
(1, 2, 80000.00, 65000.00, 60, 90, 1, true, 15000.00, 12000.00, true, '2024-01-01', 'Obturación con composite', NOW(), NOW()),
(1, 3, 250000.00, 200000.00, 90, 120, 2, true, 20000.00, 30000.00, true, '2024-01-01', 'Endodoncia molar', NOW(), NOW()),
(1, 4, 120000.00, 100000.00, 45, 60, 1, true, 15000.00, 8000.00, true, '2024-01-01', 'Extracción simple', NOW(), NOW()),

-- Clínica 2 - Precios premium
(2, 1, 65000.00, 50000.00, 30, 45, 1, false, 0, 7000.00, true, '2024-01-01', 'Limpieza dental con flúor', NOW(), NOW()),
(2, 2, 95000.00, 75000.00, 60, 90, 1, true, 18000.00, 15000.00, true, '2024-01-01', 'Obturación estética premium', NOW(), NOW()),
(2, 3, 320000.00, 250000.00, 90, 120, 2, true, 25000.00, 40000.00, true, '2024-01-01', 'Endodoncia con microscopio', NOW(), NOW()),
(2, 4, 150000.00, 120000.00, 45, 60, 1, true, 20000.00, 10000.00, true, '2024-01-01', 'Extracción con cirugía menor', NOW(), NOW()),

-- Clínica 3 - Precios económicos
(3, 1, 35000.00, 30000.00, 25, 40, 1, false, 0, 3000.00, true, '2024-01-01', 'Limpieza básica económica', NOW(), NOW()),
(3, 2, 60000.00, 50000.00, 60, 75, 1, true, 12000.00, 8000.00, true, '2024-01-01', 'Obturación estándar', NOW(), NOW()),
(3, 3, 180000.00, 150000.00, 90, 110, 2, true, 15000.00, 20000.00, true, '2024-01-01', 'Endodoncia estándar', NOW(), NOW()),
(3, 4, 90000.00, 75000.00, 45, 60, 1, true, 12000.00, 5000.00, true, '2024-01-01', 'Extracción básica', NOW(), NOW()),

-- Tratamientos especializados para clínica premium (Clínica 2)
(2, 5, 800000.00, 650000.00, 120, 180, 3, true, 30000.00, 100000.00, true, '2024-01-01', 'Implante dental premium', NOW(), NOW()),
(2, 6, 450000.00, 350000.00, 90, 120, 2, true, 25000.00, 60000.00, true, '2024-01-01', 'Corona porcelana premium', NOW(), NOW()),

-- Precios promocionales (válidos por 3 meses)
(1, 1, 50000.00, 40000.00, 30, 45, 1, false, 0, 5000.00, true, '2024-01-01', 'Promoción limpieza', NOW(), NOW()),
(1, 2, 80000.00, 65000.00, 60, 90, 1, true, 15000.00, 12000.00, true, '2024-01-01', 'Promoción obturación', NOW(), NOW());

-- Actualizar los registros con precios promocionales
UPDATE clinic_treatment_prices 
SET promotional_price = base_price * 0.8,
    promotional_start_date = '2024-08-01',
    promotional_end_date = '2024-11-01'
WHERE clinic_id = 1 AND treatment_id IN (1, 2);

-- Comentarios para documentar los precios
COMMENT ON TABLE clinic_treatment_prices IS 'Tabla que almacena los precios específicos de cada tratamiento por clínica, permitiendo flexibilidad en la gestión de precios';

-- Índices adicionales para optimizar consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_clinic_treatment_prices_active 
ON clinic_treatment_prices (clinic_id, is_active, effective_from);

CREATE INDEX IF NOT EXISTS idx_clinic_treatment_prices_promotion 
ON clinic_treatment_prices (promotional_start_date, promotional_end_date) 
WHERE promotional_price IS NOT NULL;
