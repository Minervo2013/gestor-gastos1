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
    <div className="page-container flex items-center justify-center">
      <div className="container flex flex-col items-center justify-center px-4 py-12 max-w-md mx-auto">
        <div className="mb-8 text-center">
          <div className="gradient-header rounded-2xl p-6 mb-6 shadow-lg">
            <div className="flex justify-center items-center space-x-3 mb-4">
              <Receipt className="h-14 w-14 text-white" />
              <h1 className="text-4xl font-bold text-white">GestorGastos</h1>
            </div>
            <p className="text-xl text-white/90 font-medium">Sistema de gestión de gastos corporativos</p>
            <div className="mt-4 w-20 h-1 bg-white/30 mx-auto rounded-full"></div>
          </div>
        </div>

        <div className="w-full card-elegant shadow-xl p-8">
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
