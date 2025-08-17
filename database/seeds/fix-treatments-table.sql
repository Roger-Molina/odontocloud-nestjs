-- Script para limpiar la estructura de la tabla treatments
-- Eliminar las columnas que ya no necesitamos

-- Eliminar columnas relacionadas con costos y duración
ALTER TABLE treatments DROP COLUMN IF EXISTS base_cost;
ALTER TABLE treatments DROP COLUMN IF EXISTS "basePrice";
ALTER TABLE treatments DROP COLUMN IF EXISTS estimated_duration;
ALTER TABLE treatments DROP COLUMN IF EXISTS requires_anesthesia;
ALTER TABLE treatments DROP COLUMN IF EXISTS tooth_specific;

-- Verificar la estructura resultante
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'treatments' 
ORDER BY ordinal_position;
