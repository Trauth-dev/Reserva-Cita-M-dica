"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Calendar, Search } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { getBookingsByCedula, type Booking } from "@/lib/bookings"

export default function MisCitasPage() {
  const [cedula, setCedula] = useState("")
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const foundBookings = await getBookingsByCedula(cedula)
    setBookings(foundBookings)
    setSearchPerformed(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Mis Citas</h1>
            <p className="text-muted-foreground">Consulta el estado de tus reservas</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Buscar Mis Citas</CardTitle>
              <CardDescription>Ingresa tu número de cédula para ver tus citas</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  placeholder="Número de cédula"
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                  required
                />
                <Button type="submit" disabled={loading}>
                  <Search className="w-4 h-4 mr-2" />
                  {loading ? "Buscando..." : "Buscar"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {searchPerformed && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">
                {bookings.length > 0 ? `Tus Citas (${bookings.length})` : "No se encontraron citas"}
              </h2>
              {bookings.length === 0 ? (
                <Card className="border-2">
                  <CardContent className="pt-12 pb-12 text-center text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No se encontraron citas con esta cédula</p>
                  </CardContent>
                </Card>
              ) : (
                bookings.map((booking) => (
                  <Card key={booking.id} className="border-2">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold">{booking.date}</p>
                            <p className="text-sm text-muted-foreground">{booking.time}</p>
                          </div>
                        </div>
                        <Badge
                          className={cn(
                            booking.status === "confirmado" && "bg-accent text-accent-foreground",
                            booking.status === "pendiente" && "bg-warning text-warning-foreground",
                            booking.status === "cancelado" && "bg-destructive text-destructive-foreground",
                          )}
                        >
                          {booking.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
