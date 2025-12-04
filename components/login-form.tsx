"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserByEmail, setCurrentUser } from "@/lib/auth"
import { LogIn } from "lucide-react"
import { VerificationForm } from "./verification-form"

interface LoginFormProps {
  onLogin: () => void
  onSwitchToRegister: () => void
}

export function LoginForm({ onLogin, onSwitchToRegister }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showVerification, setShowVerification] = useState(false)
  const [currentUser, setCurrentUserData] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!email || !password) {
      setError("Por favor ingresa tu email y contraseña")
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        setCurrentUserData(data.user)
        
        if (data.requiresCodeVerification) {
          setShowVerification(true)
        } else {
          // Usuario ya verificado, hacer login directamente
          setCurrentUser(data.user)
          onLogin()
        }
      } else {
        setError(data.error || 'Error en el login')
      }
    } catch (error) {
      setError('Error de conexión. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerificationSuccess = () => {
    if (currentUser) {
      // Actualizar el estado del usuario para marcar como verificado
      const updatedUser = { ...currentUser, isCodeVerified: true }
      setCurrentUser(updatedUser)
      onLogin()
    }
  }

  const handleBackToLogin = () => {
    setShowVerification(false)
    setCurrentUserData(null)
  }

  if (showVerification) {
    return (
      <VerificationForm
        email={email}
        onVerificationSuccess={handleVerificationSuccess}
        onBack={handleBackToLogin}
      />
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <LogIn className="h-5 w-5" />
          <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
        </div>
        <CardDescription>Ingresa tu email para acceder al sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full button-elegant" disabled={loading}>
            {loading ? "Iniciando..." : "Iniciar Sesión"}
          </Button>

          <div className="text-center">
            <Button type="button" variant="link" onClick={onSwitchToRegister} className="text-sm text-primary hover:text-accent transition-colors" disabled={loading}>
              ¿No tienes cuenta? Regístrate aquí
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
