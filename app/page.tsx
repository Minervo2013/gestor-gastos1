"use client"

import { useState, useEffect } from "react"
import { LoginForm } from "@/components/login-form"
import { RegisterForm } from "@/components/register-form"
import { getCurrentUser, initializeAdmin } from "@/lib/auth"
import { Receipt } from "lucide-react"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    initializeAdmin()
    const user = getCurrentUser()
    if (user) {
      // Redirigir según el tipo de usuario
      if (user.isAdmin) {
        window.location.href = "/admin"
      } else {
        window.location.href = "/expenses"
      }
    } else {
      setIsLoading(false)
    }
  }, [])

  const handleLogin = () => {
    const user = getCurrentUser()
    if (user?.isAdmin) {
      window.location.href = "/admin"
    } else {
      window.location.href = "/expenses"
    }
  }

  const handleRegister = () => {
    window.location.href = "/expenses"
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Receipt className="mx-auto h-12 w-12 animate-pulse" />
          <p className="mt-4 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="container flex flex-col items-center justify-center px-4 py-12 max-w-md mx-auto">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Receipt className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl">GestorGastos</h1>
          <p className="mt-2 text-muted-foreground">Sistema de gestión de gastos corporativos</p>
        </div>

        <div className="w-full">
          {showRegister ? (
            <RegisterForm onRegister={handleRegister} onSwitchToLogin={() => setShowRegister(false)} />
          ) : (
            <LoginForm onLogin={handleLogin} onSwitchToRegister={() => setShowRegister(true)} />
          )}
        </div>


      </div>
    </div>
  )
}
