-- =====================================================
-- SEED DATA PARA ESPECIALIDADES ODONTOLÓGICAS
-- =====================================================
-- Este archivo inserta las especialidades odontológicas básicas
-- Debe ejecutarse ANTES que otros seeds que dependan de especialidades

-- Limpiar datos existentes (opcional)
-- DELETE FROM specialties;

INSERT INTO specialties (name, description) VALUES
('Odontología General', 'Práctica general de odontología, diagnóstico y tratamientos básicos'),
('Endodoncia', 'Especialidad que trata enfermedades de la pulpa dental y tejidos periapicales'),
('Periodoncia', 'Especialidad enfocada en enfermedades de las encías y estructuras de soporte dental'),
('Ortodoncia', 'Corrección de malposiciones dentales y anomalías del desarrollo maxilofacial'),
('Cirugía Oral y Maxilofacial', 'Procedimientos quirúrgicos en cavidad oral, maxilares y estructuras faciales'),
('Odontopediatría', 'Atención odontológica especializada para niños y adolescentes'),
('Prostodoncia', 'Rehabilitación oral mediante prótesis fijas, removibles e implantes'),
('Patología Oral', 'Diagnóstico y tratamiento de enfermedades de la mucosa oral'),
('Radiología Oral', 'Interpretación de estudios radiográficos para diagnóstico odontológico'),
('Odontología Estética', 'Procedimientos enfocados en mejorar la apariencia de la sonrisa'),
('Implantología', 'Colocación y rehabilitación de implantes dentales'),
('Odontología Preventiva', 'Enfoque en prevención de enfermedades orales y promoción de salud');

-- Verificar inserción
SELECT COUNT(*) as total_specialties FROM specialties;
SELECT * FROM specialties ORDER BY name;
