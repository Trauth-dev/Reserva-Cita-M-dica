import { createClient } from "@/lib/supabase/client"

export type Schedule = {
  id: string
  day_of_week: number // 0=Domingo, 1=Lunes, ..., 6=Sábado
  start_time: string
  end_time: string
  is_active: boolean
  created_at: string
}

const DAYS_MAP = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

export function getDayName(dayNumber: number): string {
  return DAYS_MAP[dayNumber] || "Desconocido"
}

export async function getSchedules(): Promise<Schedule[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from("schedules").select("*").order("day_of_week", { ascending: true })

  if (error) {
    console.error("Error fetching schedules:", error)
    return []
  }

  return data || []
}

export async function saveSchedule(schedule: {
  day_of_week: number
  start_time: string
  end_time: string
}): Promise<Schedule | null> {
  const supabase = createClient()

  const { data, error } = await supabase.from("schedules").insert(schedule).select().single()

  if (error) {
    console.error("Error saving schedule:", error)
    return null
  }

  return data
}

export async function updateSchedule(
  id: string,
  updates: { start_time?: string; end_time?: string; is_active?: boolean },
): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase.from("schedules").update(updates).eq("id", id)

  if (error) {
    console.error("Error updating schedule:", error)
    return false
  }

  return true
}

export async function deleteSchedule(id: string): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase.from("schedules").delete().eq("id", id)

  if (error) {
    console.error("Error deleting schedule:", error)
    return false
  }

  return true
}
