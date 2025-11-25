"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  MoreVertical,
  Search,
  User,
  XCircle,
  Edit,
  Settings,
  Plus,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { getBookings, updateBooking, updateBookingDateTime, type Booking } from "@/lib/bookings"
import { getSchedules, saveSchedule, updateSchedule, deleteSchedule, getDayName, type Schedule } from "@/lib/schedules"

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [bookings, setBookings] = useState<Booking[]>([])
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editDate, setEditDate] = useState("")
  const [editTime, setEditTime] = useState("")
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [newScheduleDay, setNewScheduleDay] = useState<number>(1)
  const [newScheduleStart, setNewScheduleStart] = useState("08:00 AM")
  const [newScheduleEnd, setNewScheduleEnd] = useState("05:00 PM")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isLoggedIn) {
      loadBookings()
      loadSchedules()
    }
  }, [isLoggedIn])

  const loadBookings = async () => {
    setLoading(true)
    const allBookings = await getBookings()
    setBookings(allBookings)
    setLoading(false)
  }

  const loadSchedules = async () => {
    const allSchedules = await getSchedules()
    setSchedules(allSchedules)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === "admin" && password === "123") {
      setIsLoggedIn(true)
    } else {
      alert("Credenciales incorrectas")
    }
  }

  const updateBookingStatus = async (id: string, status: Booking["status"]) => {
    const success = await updateBooking(id, { status })
    if (success) {
      await loadBookings()
      setShowDetails(false)
    } else {
      alert("Error al actualizar la reserva")
    }
  }

  const handleEditBooking = async () => {
    if (!selectedBooking) return

    const success = await updateBookingDateTime(selectedBooking.id, {
      date: editDate,
      time: editTime,
    })

    if (success) {
      await loadBookings()
      setShowEditDialog(false)
      setShowDetails(false)
      alert("Reserva actualizada exitosamente")
    } else {
      alert("Error al actualizar la reserva")
    }
  }

  const handleAddSchedule = async () => {
    const newSchedule = await saveSchedule({
      day_of_week: newScheduleDay,
      start_time: newScheduleStart,
      end_time: newScheduleEnd,
    })

    if (newSchedule) {
      await loadSchedules()
      setShowScheduleDialog(false)
      setNewScheduleDay(1)
      setNewScheduleStart("08:00 AM")
      setNewScheduleEnd("05:00 PM")
    } else {
      alert("Error al agregar horario")
    }
  }

  const handleDeleteSchedule = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este horario?")) return

    const success = await deleteSchedule(id)
    if (success) {
      await loadSchedules()
    } else {
      alert("Error al eliminar horario")
    }
  }

  const toggleScheduleActive = async (id: string, isActive: boolean) => {
    const success = await updateSchedule(id, { is_active: !isActive })
    if (success) {
      await loadSchedules()
    }
  }

  const filteredBookings = bookings.filter(
    (b) =>
      b.status !== "cancelado" &&
      (b.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) || b.patient_id.includes(searchTerm)),
  )

  const stats = {
    total: bookings.filter((b) => b.status !== "cancelado").length,
    confirmados: bookings.filter((b) => b.status === "confirmado").length,
    pendientes: bookings.filter((b) => b.status === "pendiente").length,
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-2">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Panel de Administrador</CardTitle>
            <CardDescription>Ingresa tus credenciales para continuar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuario</Label>
                <Input
                  id="username"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="text-xs text-muted-foreground bg-secondary/50 p-3 rounded-lg">
                <p className="font-medium mb-1">Credenciales de prueba:</p>
                <p>
                  Usuario: <span className="font-mono">admin</span>
                </p>
                <p>
                  Contraseña: <span className="font-mono">123</span>
                </p>
              </div>
              <Button type="submit" className="w-full" size="lg">
                Iniciar Sesión
              </Button>
              <Link href="/">
                <Button variant="outline" className="w-full bg-transparent" size="sm">
                  Volver al Inicio
                </Button>
              </Link>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Admin</span>
            <Button variant="outline" size="sm" onClick={() => setIsLoggedIn(false)}>
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Panel Administrativo</h1>
            <p className="text-muted-foreground">Gestiona reservas y horarios de atención</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Citas</p>
                    <p className="text-3xl font-bold">{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Confirmadas</p>
                    <p className="text-3xl font-bold text-accent-foreground">{stats.confirmados}</p>
                  </div>
                  <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-accent-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pendientes</p>
                    <p className="text-3xl font-bold text-warning">{stats.pendientes}</p>
                  </div>
                  <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-warning" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="bookings" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="bookings">
                <Calendar className="w-4 h-4 mr-2" />
                Reservas
              </TabsTrigger>
              <TabsTrigger value="schedules">
                <Settings className="w-4 h-4 mr-2" />
                Horarios
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bookings" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle>Todas las Reservas</CardTitle>
                      <CardDescription>Lista completa de citas médicas</CardDescription>
                    </div>
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar por nombre o cédula..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>Cargando reservas...</p>
                    </div>
                  ) : filteredBookings.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
                      <p>No hay reservas registradas aún</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredBookings.map((booking) => {
                        const fullName = booking.patient_name.trim()
                        const names = fullName.split(" ")

                        let initials = ""
                        if (names.length >= 2) {
                          initials = `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
                        } else {
                          initials = names[0][0].toUpperCase()
                        }

                        const lastDigits = booking.patient_id.slice(-2)

                        return (
                          <div
                            key={booking.id}
                            className="flex items-center justify-between p-4 rounded-lg border-2 hover:bg-secondary/50 transition-colors"
                          >
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                              <div
                                className={cn(
                                  "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-lg font-bold",
                                  booking.status === "confirmado" && "bg-accent text-accent-foreground",
                                  booking.status === "pendiente" && "bg-yellow-100 text-yellow-800",
                                  booking.status === "cancelado" && "bg-destructive/10 text-destructive",
                                )}
                              >
                                <div className="text-center">
                                  <div className="text-xs">{initials}</div>
                                  <div className="text-[10px] opacity-70">{lastDigits}</div>
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold truncate">{booking.patient_name}</p>
                                <p className="text-sm text-muted-foreground">
                                  CI: •••{lastDigits} | {booking.date} - {booking.time}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  booking.status === "confirmado"
                                    ? "default"
                                    : booking.status === "pendiente"
                                      ? "secondary"
                                      : "destructive"
                                }
                                className={cn(
                                  booking.status === "confirmado" &&
                                    "bg-accent hover:bg-accent/90 text-accent-foreground border-0",
                                  booking.status === "pendiente" &&
                                    "bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-200",
                                )}
                              >
                                {booking.status}
                              </Badge>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedBooking(booking)
                                      setShowDetails(true)
                                    }}
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    Ver Detalles
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedBooking(booking)
                                      setEditDate(booking.date)
                                      setEditTime(booking.time)
                                      setShowEditDialog(true)
                                    }}
                                  >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Editar Horario
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => updateBookingStatus(booking.id, "confirmado")}
                                    disabled={booking.status === "confirmado"}
                                  >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Confirmar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => updateBookingStatus(booking.id, "cancelado")}
                                    className="text-destructive"
                                  >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Cancelar
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedules" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle>Horarios de Atención</CardTitle>
                      <CardDescription>Gestiona tu disponibilidad semanal</CardDescription>
                    </div>
                    <Button onClick={() => setShowScheduleDialog(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar Horario
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {schedules.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Clock className="w-12 h-12 mx-auto mb-4 opacity-20" />
                      <p>No hay horarios configurados aún</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {schedules.map((schedule) => (
                        <div
                          key={schedule.id}
                          className="flex items-center justify-between p-4 rounded-lg border-2 hover:bg-secondary/50 transition-colors"
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                              <Clock className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold">{getDayName(schedule.day_of_week)}</p>
                              <p className="text-sm text-muted-foreground">
                                {schedule.start_time} - {schedule.end_time}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge variant={schedule.is_active ? "default" : "secondary"}>
                              {schedule.is_active ? "Activo" : "Inactivo"}
                            </Badge>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleScheduleActive(schedule.id, schedule.is_active)}
                            >
                              <Settings className="w-4 h-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteSchedule(schedule.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalles de la Cita</DialogTitle>
            <DialogDescription>Información completa del paciente</DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Paciente</Label>
                  <p className="font-medium">{selectedBooking.patient_name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Teléfono</Label>
                  <p className="font-medium">{selectedBooking.patient_phone}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Cédula</Label>
                  <p className="font-medium">{selectedBooking.patient_id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Fecha</Label>
                  <p className="font-medium">{selectedBooking.date}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Hora</Label>
                  <p className="font-medium">{selectedBooking.time}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Estado</Label>
                  <Badge
                    className={cn(
                      selectedBooking.status === "confirmado" && "bg-accent text-accent-foreground",
                      selectedBooking.status === "pendiente" && "bg-yellow-100 text-yellow-800",
                    )}
                  >
                    {selectedBooking.status}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => updateBookingStatus(selectedBooking.id, "confirmado")}
                  disabled={selectedBooking.status === "confirmado"}
                  className="flex-1"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirmar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => updateBookingStatus(selectedBooking.id, "cancelado")}
                  className="flex-1"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Horario de Cita</DialogTitle>
            <DialogDescription>Modifica la fecha y hora de la reserva</DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="p-4 bg-secondary/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Paciente</p>
                <p className="font-semibold">{selectedBooking.patient_name}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-date">Nueva Fecha</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-time">Nueva Hora</Label>
                <Select value={editTime} onValueChange={setEditTime}>
                  <SelectTrigger id="edit-time">
                    <SelectValue placeholder="Selecciona una hora" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="08:00 AM">08:00 AM</SelectItem>
                    <SelectItem value="09:00 AM">09:00 AM</SelectItem>
                    <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                    <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                    <SelectItem value="12:00 PM">12:00 PM</SelectItem>
                    <SelectItem value="01:00 PM">01:00 PM</SelectItem>
                    <SelectItem value="02:00 PM">02:00 PM</SelectItem>
                    <SelectItem value="03:00 PM">03:00 PM</SelectItem>
                    <SelectItem value="04:00 PM">04:00 PM</SelectItem>
                    <SelectItem value="05:00 PM">05:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleEditBooking} className="flex-1">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Guardar Cambios
                </Button>
                <Button variant="outline" onClick={() => setShowEditDialog(false)} className="flex-1">
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Horario de Atención</DialogTitle>
            <DialogDescription>Define tu disponibilidad para este día</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="schedule-day">Día de la Semana</Label>
              <Select value={String(newScheduleDay)} onValueChange={(value) => setNewScheduleDay(Number(value))}>
                <SelectTrigger id="schedule-day">
                  <SelectValue placeholder="Selecciona un día" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Domingo</SelectItem>
                  <SelectItem value="1">Lunes</SelectItem>
                  <SelectItem value="2">Martes</SelectItem>
                  <SelectItem value="3">Miércoles</SelectItem>
                  <SelectItem value="4">Jueves</SelectItem>
                  <SelectItem value="5">Viernes</SelectItem>
                  <SelectItem value="6">Sábado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="schedule-start">Hora Inicio</Label>
                <Select value={newScheduleStart} onValueChange={setNewScheduleStart}>
                  <SelectTrigger id="schedule-start">
                    <SelectValue placeholder="Inicio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="06:00 AM">06:00 AM</SelectItem>
                    <SelectItem value="07:00 AM">07:00 AM</SelectItem>
                    <SelectItem value="08:00 AM">08:00 AM</SelectItem>
                    <SelectItem value="09:00 AM">09:00 AM</SelectItem>
                    <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                    <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                    <SelectItem value="12:00 PM">12:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="schedule-end">Hora Fin</Label>
                <Select value={newScheduleEnd} onValueChange={setNewScheduleEnd}>
                  <SelectTrigger id="schedule-end">
                    <SelectValue placeholder="Fin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="01:00 PM">01:00 PM</SelectItem>
                    <SelectItem value="02:00 PM">02:00 PM</SelectItem>
                    <SelectItem value="03:00 PM">03:00 PM</SelectItem>
                    <SelectItem value="04:00 PM">04:00 PM</SelectItem>
                    <SelectItem value="05:00 PM">05:00 PM</SelectItem>
                    <SelectItem value="06:00 PM">06:00 PM</SelectItem>
                    <SelectItem value="07:00 PM">07:00 PM</SelectItem>
                    <SelectItem value="08:00 PM">08:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleAddSchedule} className="flex-1">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Horario
              </Button>
              <Button variant="outline" onClick={() => setShowScheduleDialog(false)} className="flex-1">
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
