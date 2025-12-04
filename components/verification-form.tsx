"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield } from "lucide-react"

interface VerificationFormProps {
  email: string
  onVerificationSuccess: () => void
  onBack: () => void
}

export function VerificationForm({ email, onVerificationSuccess, onBack }: VerificationFormProps) {
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!code) {
      setError("Por favor ingresa el código de verificación")
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      })

      const data = await response.json()

      if (data.success) {
        onVerificationSuccess()
      } else {
        setError(data.error || 'Error en la verificación')
      }
    } catch (error) {
      setError('Error de conexión. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          <CardTitle className="text-2xl">Verificación de Código</CardTitle>
        </div>
        <CardDescription>
          Este es tu primer inicio de sesión. Por favor ingresa el código de verificación para continuar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              disabled
              className="bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Código de Verificación</Label>
            <Input
              id="code"
              type="text"
              placeholder="Ingresa tu código"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="space-y-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Verificando..." : "Verificar Código"}
            </Button>
            
            <Button type="button" variant="outline" className="w-full" onClick={onBack} disabled={loading}>
              Volver
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}