import { createClient } from "@/lib/supabase/client"

export type Booking = {
  id: string
  patient_name: string
  patient_id: string
  patient_phone: string
  date: string
  time: string
  doctor_name: string
  doctor_specialty: string
  status: "pendiente" | "confirmado" | "cancelado"
  created_at: string
}

export async function getBookings(): Promise<Booking[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from("bookings").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching bookings:", error)
    return []
  }

  return data || []
}

export async function saveBooking(booking: {
  nombre: string
  apellido: string
  telefono: string
  cedula: string
  fecha: string
  hora: string
}): Promise<Booking | null> {
  const supabase = createClient()

  const newBooking = {
    patient_name: `${booking.nombre} ${booking.apellido}`,
    patient_id: booking.cedula,
    patient_phone: booking.telefono,
    date: booking.fecha,
    time: booking.hora,
    doctor_name: "Dr. Pendiente",
    doctor_specialty: "General",
    status: "pendiente" as const,
  }

  const { data, error } = await supabase.from("bookings").insert(newBooking).select().single()

  if (error) {
    console.error("Error saving booking:", error)
    return null
  }

  return data
}

export async function updateBooking(id: string, updates: { status?: Booking["status"] }): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase.from("bookings").update(updates).eq("id", id)

  if (error) {
    console.error("Error updating booking:", error)
    return false
  }

  return true
}

export async function updateBookingDateTime(id: string, updates: { date?: string; time?: string }): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase.from("bookings").update(updates).eq("id", id)

  if (error) {
    console.error("Error updating booking date/time:", error)
    return false
  }

  return true
}

export async function getBookingsByCedula(cedula: string): Promise<Booking[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("patient_id", cedula)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching bookings by cedula:", error)
    return []
  }

  return data || []
}

export async function getBookingsByDate(date: string): Promise<Booking[]> {
  const supabase = createClient()

  const { data, error } = await supabase.from("bookings").select("*").eq("date", date).neq("status", "cancelado")

  if (error) {
    console.error("Error fetching bookings by date:", error)
    return []
  }

  return data || []
}
