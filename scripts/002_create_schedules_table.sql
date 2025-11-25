-- Tabla para horarios disponibles del doctor
CREATE TABLE IF NOT EXISTS schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Domingo, 6=Sábado
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Índice para búsquedas rápidas
CREATE INDEX idx_schedules_day ON schedules(day_of_week);
CREATE INDEX idx_schedules_active ON schedules(is_active);

-- Horarios predeterminados (Lunes a Viernes 8:00 AM - 5:00 PM)
INSERT INTO schedules (day_of_week, start_time, end_time, is_active) VALUES
  (1, '08:00 AM', '05:00 PM', true), -- Lunes
  (2, '08:00 AM', '05:00 PM', true), -- Martes
  (3, '08:00 AM', '05:00 PM', true), -- Miércoles
  (4, '08:00 AM', '05:00 PM', true), -- Jueves
  (5, '08:00 AM', '05:00 PM', true); -- Viernes
