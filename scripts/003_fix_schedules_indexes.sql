-- Crear índices solo si no existen (versión corregida)
DO $$ 
BEGIN
    -- Crear índice para day_of_week si no existe
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_schedules_day') THEN
        CREATE INDEX idx_schedules_day ON schedules(day_of_week);
    END IF;
    
    -- Crear índice para is_active si no existe
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_schedules_active') THEN
        CREATE INDEX idx_schedules_active ON schedules(is_active);
    END IF;
END $$;

-- Insertar horarios predeterminados solo si la tabla está vacía
INSERT INTO schedules (day_of_week, start_time, end_time, is_active)
SELECT * FROM (VALUES
  (1, '08:00 AM', '05:00 PM', true), -- Lunes
  (2, '08:00 AM', '05:00 PM', true), -- Martes
  (3, '08:00 AM', '05:00 PM', true), -- Miércoles
  (4, '08:00 AM', '05:00 PM', true), -- Jueves
  (5, '08:00 AM', '05:00 PM', true)  -- Viernes
) AS v(day_of_week, start_time, end_time, is_active)
WHERE NOT EXISTS (SELECT 1 FROM schedules LIMIT 1);
