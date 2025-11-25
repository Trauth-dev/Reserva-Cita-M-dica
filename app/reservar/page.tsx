"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ArrowLeft, Star, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { saveBooking, getBookingsByDate } from "@/lib/bookings"

type TimeSlot = {
  time: string
  status: "available" | "confirmed" | "pending"
  patient?: { initials: string; lastDigits: string }
}

export default function ReservarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    cedula: "",
  })

  const [weekDates, setWeekDates] = useState<Date[]>([])

  useEffect(() => {
    generateWeekDates(selectedDate)
  }, [])

  useEffect(() => {
    loadTimeSlots(selectedDate)
  }, [selectedDate])

  const generateWeekDates = (centerDate: Date) => {
    const dates: Date[] = []
    const startOfWeek = new Date(centerDate)
    startOfWeek.setDate(centerDate.getDate() - 3)

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      dates.push(date)
    }
    setWeekDates(dates)
  }

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate)
    newDate.setDate(selectedDate.getDate() + (direction === "next" ? 7 : -7))
    setSelectedDate(newDate)
    generateWeekDates(newDate)
  }

  const loadTimeSlots = async (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    const bookings = await getBookingsByDate(dateStr)

    const baseSlots = [
      "8:00 AM",
      "9:30 AM",
      "10:00 AM",
      "10:30 AM",
      "11:00 AM",
      "11:30 AM",
      "12:00 PM",
      "12:30 PM",
      "2:00 PM",
    ]

    const slots: TimeSlot[] = baseSlots.map((time) => {
      const booking = bookings.find((b) => b.time === time)
      if (booking) {
        const fullName = booking.patient_name.trim()
        const names = fullName.split(" ")

        let initials = ""
        if (names.length >= 2) {
          // Obtener primera letra del primer nombre y primera letra del último apellido
          initials = `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
        } else {
          // Si solo hay un nombre, usar su primera letra
          initials = names[0][0].toUpperCase()
        }

        const lastDigits = booking.patient_id.slice(-2)
        return {
          time,
          status: booking.status === "confirmado" ? "confirmed" : "pending",
          patient: { initials, lastDigits },
        }
      }
      return { time, status: "available" }
    })

    setTimeSlots(slots)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const dateStr = selectedDate.toISOString().split("T")[0]
    const result = await saveBooking({
      ...formData,
      fecha: dateStr,
      hora: selectedTime,
    })

    if (result) {
      setShowForm(false)
      setShowSuccess(true)
      await loadTimeSlots(selectedDate)
    } else {
      alert("Error al guardar la reserva")
    }
    setLoading(false)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", { month: "long", year: "numeric" })
  }

  const getDayName = (date: Date) => {
    return date.toLocaleDateString("es-ES", { weekday: "short" }).replace(".", "")
  }

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    )
  }

  const availableSlots = timeSlots.filter((s) => s.status === "available").length

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-md">
        <div className="space-y-6">
          {/* Doctor Info Card with Photo */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-0">
              <div className="relative">
                <div className="absolute top-4 left-4 z-10 bg-white rounded-lg px-2.5 py-1 shadow-sm flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold">4.9</span>
                </div>

                <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-t-xl overflow-hidden">
                  <Image
                    src="/doctor-photo.png"
                    alt="Dr. Especialista"
                    fill
                    className="object-contain object-center scale-110"
                    priority
                  />
                </div>
              </div>

              <div className="p-6 pb-4">
                <h1 className="text-2xl font-bold mb-1">Dr. Especialista</h1>
                <p className="text-muted-foreground">Cardiology</p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">Select Date</h2>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigateWeek("prev")}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-muted-foreground min-w-[120px] text-center">
                  {formatDate(selectedDate)}
                </span>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigateWeek("next")}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {weekDates.map((date, index) => {
                const isSelected = isSameDay(date, selectedDate)
                const isPast = date < new Date() && !isSameDay(date, new Date())

                return (
                  <button
                    key={index}
                    onClick={() => !isPast && setSelectedDate(date)}
                    disabled={isPast}
                    className={cn(
                      "flex flex-col items-center gap-1 py-3 rounded-xl transition-all",
                      "disabled:opacity-40 disabled:cursor-not-allowed",
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "hover:bg-secondary active:scale-95",
                    )}
                  >
                    <span className="text-xs font-medium">{getDayName(date)}</span>
                    <span className="text-lg font-semibold">{date.getDate()}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">Select Time</h2>
              <span className="text-sm text-muted-foreground">{availableSlots} Slots</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {timeSlots.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => slot.status === "available" && handleTimeSelect(slot.time)}
                  disabled={slot.status !== "available"}
                  className={cn(
                    "py-3 px-2 rounded-xl text-sm font-medium transition-all border-2",
                    "disabled:cursor-not-allowed",
                    slot.status === "available" && "border-border hover:border-primary hover:bg-primary/5",
                    selectedTime === slot.time && "border-primary bg-primary text-primary-foreground shadow-sm",
                    slot.status === "confirmed" && "bg-accent border-accent text-accent-foreground",
                    slot.status === "pending" && "bg-yellow-100 border-yellow-200 text-yellow-800",
                  )}
                >
                  {slot.status !== "available" && slot.patient ? (
                    <div className="flex flex-col items-center gap-1">
                      <div className="text-xs font-semibold">{slot.time}</div>
                      <div className="text-xs">
                        {slot.patient.initials} - {slot.patient.lastDigits}
                      </div>
                    </div>
                  ) : (
                    slot.time
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" size="lg" className="rounded-full bg-transparent">
              <MessageCircle className="w-5 h-5" />
            </Button>
            <Button
              size="lg"
              className="flex-1 rounded-full bg-primary hover:bg-primary/90 shadow-md"
              disabled={!selectedTime}
              onClick={() => setShowForm(true)}
            >
              Book an Appointment
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Your Information</DialogTitle>
            <DialogDescription>Fill in your details to confirm the appointment</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">First Name</Label>
              <Input
                id="nombre"
                placeholder="Your first name"
                required
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apellido">Last Name</Label>
              <Input
                id="apellido"
                placeholder="Your last name"
                required
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono">Phone Number</Label>
              <Input
                id="telefono"
                type="tel"
                placeholder="0999999999"
                required
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cedula">ID Number</Label>
              <Input
                id="cedula"
                placeholder="1234567890"
                required
                value={formData.cedula}
                onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
              />
            </div>

            <div className="bg-secondary/50 rounded-lg p-3 text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium">{selectedDate.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time:</span>
                <span className="font-medium">{selectedTime}</span>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Booking..." : "Confirm Appointment"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appointment Booked!</DialogTitle>
            <DialogDescription>Your appointment has been successfully scheduled</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-accent/30 border border-accent/50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Patient:</span>
                <span className="font-medium">
                  {formData.nombre} {formData.apellido}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium">{selectedDate.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time:</span>
                <span className="font-medium">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-medium text-accent-foreground">Pending Confirmation</span>
              </div>
            </div>
            <Button
              className="w-full"
              onClick={() => {
                setShowSuccess(false)
                setFormData({ nombre: "", apellido: "", telefono: "", cedula: "" })
                setSelectedTime("")
              }}
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
