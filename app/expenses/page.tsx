"use client"

import { useState, useEffect } from "react"
import { ExpenseForm } from "@/components/expense-form"
import { ExpenseTable } from "@/components/expense-table"
import type { Expense, UserExpense } from "@/lib/types"
import { Receipt, LogOut } from "lucide-react"
import { getCurrentUser, logout } from "@/lib/auth"
import { Button } from "@/components/ui/button"

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [user, setUser] = useState<ReturnType<typeof getCurrentUser>>(null)

  const loadUserExpenses = async (userId: string) => {
    try {
      const response = await fetch(`/api/expenses?userId=${userId}`)
      const data = await response.json()
      
      if (data.success) {
        setExpenses(data.expenses)
      } else {
        console.error('Error cargando gastos:', data.error)
      }
    } catch (error) {
      console.error('Error al cargar gastos:', error)
    }
  }

  const createExpense = async (expenseData: Expense) => {
    if (!user) return

    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...expenseData,
          userId: user.id,
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        // Recargar la lista de gastos
        loadUserExpenses(user.id)
      } else {
        console.error('Error creando gasto:', data.error)
        alert('Error al guardar el gasto: ' + data.error)
      }
    } catch (error) {
      console.error('Error al crear gasto:', error)
      alert('Error de conexión al guardar el gasto')
    }
  }

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser || currentUser.isAdmin) {
      window.location.href = "/"
      return
    }
    setUser(currentUser)

    // Cargar gastos del usuario actual desde PostgreSQL
    loadUserExpenses(currentUser.id)
  }, [])

  const handleAddExpense = (expense: Expense) => {
    createExpense(expense)
  }

  const handleLogout = () => {
    logout()
    window.location.href = "/"
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Receipt className="h-6 w-6 sm:h-8 sm:w-8" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">GestorGastos</h1>
                <p className="text-sm text-muted-foreground">
                  {user.nombre} - {user.sector}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mx-auto grid max-w-7xl gap-6 sm:gap-8 lg:grid-cols-[400px_1fr]">
          <div className="lg:sticky lg:top-8 lg:self-start">
            <ExpenseForm onSubmit={handleAddExpense} />
          </div>
          <div>
            <ExpenseTable expenses={expenses} />
          </div>
        </div>
      </main>
    </div>
  )
}
