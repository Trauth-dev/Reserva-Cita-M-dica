import Link from "next/link"
import { Calendar, Clock, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold">MediCitas</h1>
          </div>
          <Link href="/admin">
            <Button variant="outline" size="sm">
              Administrador
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
            <UserCheck className="w-4 h-4" />
            Sistema de Reservas Médicas
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance">Agenda tu Cita Médica en Minutos</h2>

          <p className="text-lg md:text-xl text-muted-foreground text-balance">
            Sistema profesional de reservas médicas. Selecciona tu fecha y horario preferido de forma rápida y sencilla.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/reservar">
              <Button size="lg" className="w-full sm:w-auto text-base">
                <Calendar className="w-5 h-5 mr-2" />
                Reservar Cita
              </Button>
            </Link>
            <Link href="/mis-citas">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base bg-transparent">
                <Clock className="w-5 h-5 mr-2" />
                Ver Mis Citas
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 text-center space-y-3">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                <Calendar className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Fácil y Rápido</h3>
              <p className="text-sm text-muted-foreground">
                Reserva tu cita en pocos minutos desde cualquier dispositivo
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 text-center space-y-3">
              <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto">
                <Clock className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-semibold text-lg">Horarios Flexibles</h3>
              <p className="text-sm text-muted-foreground">Múltiples horarios disponibles para adaptarse a tu agenda</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 text-center space-y-3">
              <div className="w-14 h-14 bg-warning/10 rounded-2xl flex items-center justify-center mx-auto">
                <UserCheck className="w-7 h-7 text-warning" />
              </div>
              <h3 className="font-semibold text-lg">Confirmación Inmediata</h3>
              <p className="text-sm text-muted-foreground">Recibe notificación cuando tu cita sea confirmada</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
