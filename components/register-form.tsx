"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserByEmail, saveUser, setCurrentUser } from "@/lib/auth"
import { UserPlus } from "lucide-react"
import type { User } from "@/lib/types"

interface RegisterFormProps {
  onRegister: () => void
  onSwitchToLogin: () => void
}

export function RegisterForm({ onRegister, onSwitchToLogin }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    nombre: "",
    sector: "",
    tarjetaUltimos4: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    // Validaciones del lado del cliente
    if (!formData.email || !formData.nombre || !formData.sector || !formData.tarjetaUltimos4 || !formData.password || !formData.confirmPassword) {
      setError("Todos los campos son requeridos")
      setLoading(false)
      return
    }

    if (!formData.email.endsWith('@pueblaequipo.com.ar')) {
      setError("Dominio no permitido")
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      setLoading(false)
      return
    }

    if (formData.tarjetaUltimos4.length !== 4 || !/^\d{4}$/.test(formData.tarjetaUltimos4)) {
      setError("Los últimos 4 dígitos de la tarjeta deben ser números")
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        // Guardar usuario en localStorage para compatibilidad con el sistema existente
        saveUser(data.user)
        setSuccess("¡Registro exitoso! Ahora inicia sesión para verificar tu código.")
        // Esperar 2 segundos antes de cambiar a login para que vea el mensaje
        setTimeout(() => {
          onSwitchToLogin()
        }, 2000)
      } else {
        setError(data.error || 'Error en el registro')
      }
    } catch (error) {
      setError('Error de conexión. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          <CardTitle className="text-2xl">Registro</CardTitle>
        </div>
        <CardDescription>Crea tu cuenta para acceder al sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre Completo</Label>
            <Input
              id="nombre"
              type="text"
              placeholder="Juan Pérez"
              value={formData.nombre}
              onChange={(e) => handleChange("nombre", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sector">Sector</Label>
            <Input
              id="sector"
              type="text"
              placeholder="Ventas, Marketing, IT, etc."
              value={formData.sector}
              onChange={(e) => handleChange("sector", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tarjeta">Últimos 4 dígitos de la tarjeta corporativa</Label>
            <Input
              id="tarjeta"
              type="text"
              placeholder="1234"
              maxLength={4}
              value={formData.tarjetaUltimos4}
              onChange={(e) => handleChange("tarjetaUltimos4", e.target.value.replace(/\D/g, ""))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirma tu contraseña"
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              required
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <Button type="submit" className="w-full button-elegant" disabled={loading || success}>
            {loading ? "Registrando..." : "Registrarse"}
          </Button>

          <div className="text-center">
            <Button type="button" variant="link" onClick={onSwitchToLogin} className="text-sm text-primary hover:text-accent transition-colors" disabled={loading || success}>
              ¿Ya tienes cuenta? Inicia sesión aquí
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
