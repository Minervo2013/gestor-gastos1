"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserByEmail, setCurrentUser } from "@/lib/auth"
import { LogIn } from "lucide-react"
import { signIn } from "next-auth/react"
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
        <CardDescription>Usá tu cuenta corporativa de Microsoft para entrar</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Botón Microsoft — opción principal */}
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center gap-3 h-11 text-base font-medium border-2 hover:bg-accent"
            disabled={loading}
            onClick={() => signIn("azure-ad", { callbackUrl: "/auth/microsoft/callback" })}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23" className="h-5 w-5 shrink-0">
              <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
              <path fill="#f35325" d="M1 1h10v10H1z"/>
              <path fill="#81bc06" d="M12 1h10v10H12z"/>
              <path fill="#05a6f0" d="M1 12h10v10H1z"/>
              <path fill="#ffba08" d="M12 12h10v10H12z"/>
            </svg>
            Iniciar sesión con Microsoft
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">o con contraseña</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@pueblaequipo.com.ar"
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
          </form>

          <div className="text-center">
            <Button type="button" variant="link" onClick={onSwitchToRegister} className="text-sm text-primary hover:text-accent transition-colors" disabled={loading}>
              ¿No tienes cuenta? Regístrate aquí
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
