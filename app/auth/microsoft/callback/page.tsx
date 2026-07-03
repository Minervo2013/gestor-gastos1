"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { setCurrentUser } from "@/lib/auth"
import { Receipt } from "lucide-react"

export default function MicrosoftCallbackPage() {
  const { data: session, status } = useSession()
  const [error, setError] = useState("")

  useEffect(() => {
    if (status === "loading") return

    if (status === "unauthenticated") {
      window.location.href = "/"
      return
    }

    if (status === "authenticated") {
      fetch("/api/auth/microsoft-user")
        .then((r) => r.json())
        .then((data) => {
          if (data.success) {
            setCurrentUser(data.user)
            window.location.href = data.user.isAdmin ? "/admin" : "/expenses"
          } else {
            setError(data.error || "Error al obtener el usuario")
          }
        })
        .catch(() => setError("Error de conexión"))
    }
  }, [session, status])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-destructive">{error}</p>
          <a href="/" className="text-sm text-primary underline">
            Volver al inicio
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <Receipt className="mx-auto h-12 w-12 animate-pulse" />
        <p className="mt-4 text-muted-foreground">Iniciando sesión con Microsoft...</p>
      </div>
    </div>
  )
}
