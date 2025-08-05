-- =====================================================
-- SCRIPT PARA CREAR TABLAS DE CATÁLOGO EXPENSE
-- =====================================================

-- 1. Crear tabla expense_categories
CREATE TABLE IF NOT EXISTS public.expense_categories (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now(),
    deleted_at TIMESTAMP,
    code character varying(50) NOT NULL UNIQUE,
    name character varying(100) NOT NULL,
    description text,
    is_active boolean NOT NULL DEFAULT true,
    display_order integer NOT NULL DEFAULT 0,
    is_deductible boolean NOT NULL DEFAULT false,
    requires_receipt boolean NOT NULL DEFAULT false,
    max_amount numeric(10,2),
    requires_approval boolean NOT NULL DEFAULT false,
    icon_class character varying,
    color_hex character varying(7) NOT NULL DEFAULT '#6c757d'
);

-- 2. Crear tabla expense_statuses
CREATE TABLE IF NOT EXISTS public.expense_statuses (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now(),
    deleted_at TIMESTAMP,
    code character varying(50) NOT NULL UNIQUE,
    name character varying(100) NOT NULL,
    description text,
    color_hex character varying(7) NOT NULL DEFAULT '#6c757d',
    is_active boolean NOT NULL DEFAULT true,
    display_order integer NOT NULL DEFAULT 0,
    is_final boolean NOT NULL DEFAULT false,
    requires_approval boolean NOT NULL DEFAULT false,
    can_edit boolean NOT NULL DEFAULT true,
    can_delete boolean NOT NULL DEFAULT true
);

-- 3. Verificar si las columnas de FK ya existen antes de agregarlas
DO $$
BEGIN
    -- Agregar columna expense_category_id si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'expenses' AND column_name = 'expense_category_id') THEN
        ALTER TABLE public.expenses ADD COLUMN expense_category_id integer;
    END IF;

    -- Agregar columna expense_status_id si no existe  
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'expenses' AND column_name = 'expense_status_id') THEN
        ALTER TABLE public.expenses ADD COLUMN expense_status_id integer;
    END IF;
END $$;

-- 4. Poblar las tablas de catálogo con datos iniciales
INSERT INTO public.expense_categories (code, name, description, is_active, display_order, is_deductible, requires_receipt, requires_approval, icon_class, color_hex, created_at, updated_at) VALUES
('OFFICE_SUPPLIES', 'Suministros de Oficina', 'Papelería, material de oficina', true, 1, true, true, false, 'fa-paperclip', '#17a2b8', NOW(), NOW()),
('MEDICAL_SUPPLIES', 'Suministros Médicos', 'Materiales y equipos médicos', true, 2, true, true, true, 'fa-stethoscope', '#28a745', NOW(), NOW()),
('UTILITIES', 'Servicios Públicos', 'Agua, luz, teléfono, internet', true, 3, true, true, false, 'fa-bolt', '#ffc107', NOW(), NOW()),
('RENT', 'Alquiler', 'Alquiler de local, equipos', true, 4, true, true, true, 'fa-home', '#fd7e14', NOW(), NOW()),
('MAINTENANCE', 'Mantenimiento', 'Reparaciones y mantenimiento', true, 5, true, true, false, 'fa-wrench', '#6f42c1', NOW(), NOW()),
('MARKETING', 'Marketing', 'Publicidad y promoción', true, 6, true, true, false, 'fa-bullhorn', '#e83e8c', NOW(), NOW()),
('TRAINING', 'Capacitación', 'Cursos y entrenamientos', true, 7, true, true, true, 'fa-graduation-cap', '#20c997', NOW(), NOW()),
('TRAVEL', 'Viajes', 'Viáticos y gastos de viaje', true, 8, true, true, true, 'fa-plane', '#dc3545', NOW(), NOW()),
('OTHER', 'Otros', 'Gastos varios', true, 9, false, false, false, 'fa-ellipsis-h', '#6c757d', NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.expense_statuses (code, name, description, color_hex, is_active, display_order, is_final, requires_approval, can_edit, can_delete, created_at, updated_at) VALUES
('DRAFT', 'Borrador', 'Gasto en borrador', '#6c757d', true, 1, false, false, true, true, NOW(), NOW()),
('PENDING', 'Pendiente', 'Pendiente de aprobación', '#ffc107', true, 2, false, true, true, true, NOW(), NOW()),
('APPROVED', 'Aprobado', 'Gasto aprobado', '#28a745', true, 3, false, false, false, false, NOW(), NOW()),
('PAID', 'Pagado', 'Gasto pagado', '#17a2b8', true, 4, true, false, false, false, NOW(), NOW()),
('REJECTED', 'Rechazado', 'Gasto rechazado', '#dc3545', true, 5, true, false, false, false, NOW(), NOW()),
('CANCELLED', 'Cancelado', 'Gasto cancelado', '#6c757d', true, 6, true, false, false, false, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- 5. Actualizar expenses existentes con valores por defecto
UPDATE public.expenses 
SET expense_category_id = (SELECT id FROM public.expense_categories WHERE code = 'OTHER' LIMIT 1)
WHERE expense_category_id IS NULL;

UPDATE public.expenses 
SET expense_status_id = (SELECT id FROM public.expense_statuses WHERE code = 'DRAFT' LIMIT 1)
WHERE expense_status_id IS NULL;

-- 6. Hacer las columnas NOT NULL después de actualizar
ALTER TABLE public.expenses ALTER COLUMN expense_category_id SET NOT NULL;
ALTER TABLE public.expenses ALTER COLUMN expense_status_id SET NOT NULL;

-- 7. Agregar las constraints de foreign key
DO $$
BEGIN
    -- Agregar FK para expense_category_id si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'FK_expenses_expense_category') THEN
        ALTER TABLE public.expenses 
        ADD CONSTRAINT FK_expenses_expense_category 
        FOREIGN KEY (expense_category_id) REFERENCES public.expense_categories(id);
    END IF;

    -- Agregar FK para expense_status_id si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'FK_expenses_expense_status') THEN
        ALTER TABLE public.expenses 
        ADD CONSTRAINT FK_expenses_expense_status 
        FOREIGN KEY (expense_status_id) REFERENCES public.expense_statuses(id);
    END IF;
END $$;

-- 8. Eliminar las columnas string después de migrar datos (opcional)
-- Descomenta estas líneas solo cuando estés seguro de que todo funciona correctamente
-- ALTER TABLE public.expenses DROP COLUMN IF EXISTS category;
-- ALTER TABLE public.expenses DROP COLUMN IF EXISTS status;

-- =====================================================
-- VERIFICACIÓN - Consultas para verificar los datos
-- =====================================================

SELECT 'expense_categories' as tabla, COUNT(*) as total FROM public.expense_categories
UNION ALL
SELECT 'expense_statuses' as tabla, COUNT(*) as total FROM public.expense_statuses
UNION ALL
SELECT 'expenses' as tabla, COUNT(*) as total FROM public.expenses;
