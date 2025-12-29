"use client"

import { useState, useEffect } from "react"
import { ExpenseForm } from "@/components/expense-form"
import { ExpenseTable } from "@/components/expense-table"
import type { Expense, UserExpense } from "@/lib/types"
import { Receipt, LogOut, CreditCard, Eye, Download } from "lucide-react"
import { getCurrentUser, logout } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type CardSummary = {
  id: string
  periodo: string
  archivo: string
  archivoNombre: string
  archivoTipo: string
  descripcion?: string
  createdAt: string
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [user, setUser] = useState<ReturnType<typeof getCurrentUser>>(null)
  const [showSummariesDialog, setShowSummariesDialog] = useState(false)
  const [cardSummaries, setCardSummaries] = useState<CardSummary[]>([])
  const [selectedSummary, setSelectedSummary] = useState<CardSummary | null>(null)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)

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

  const handleEditExpense = async (expenseData: Expense) => {
    if (!user || !editingExpense) return

    try {
      const response = await fetch('/api/expenses', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...expenseData,
          expenseId: editingExpense.id,
          userId: user.id,
        }),
      })

      const data = await response.json()

      if (data.success) {
        loadUserExpenses(user.id)
        setEditingExpense(null)
        alert('Gasto actualizado exitosamente')
      } else {
        console.error('Error actualizando gasto:', data.error)
        alert('Error al actualizar el gasto: ' + data.error)
      }
    } catch (error) {
      console.error('Error al actualizar gasto:', error)
      alert('Error de conexión al actualizar el gasto')
    }
  }

  const handleLogout = () => {
    logout()
    window.location.href = "/"
  }

  const loadCardSummaries = async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/card-summaries?userId=${user.id}`)
      const data = await response.json()

      if (data.success) {
        setCardSummaries(data.cardSummaries)
      } else {
        console.error("Error cargando resúmenes:", data.error)
      }
    } catch (error) {
      console.error("Error al cargar resúmenes:", error)
    }
  }

  const handleOpenSummaries = async () => {
    await loadCardSummaries()
    setShowSummariesDialog(true)
  }

  const formatPeriod = (periodo: string) => {
    const [year, month] = periodo.split("-")
    const monthNames = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ]
    return `${monthNames[parseInt(month) - 1]} ${year}`
  }

  if (!user) {
    return null
  }

  return (
    <div className="page-container">
      <header className="gradient-header shadow-lg">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Receipt className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">GestorGastos</h1>
                <p className="text-sm text-white/90">
                  {user.nombre} - {user.sector}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenSummaries}
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Ver Resúmenes
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout} className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                <LogOut className="mr-2 h-4 w-4" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mx-auto grid max-w-7xl gap-6 sm:gap-8 lg:grid-cols-[400px_1fr]">
          <div className="lg:sticky lg:top-8 lg:self-start">
            <ExpenseForm onSubmit={handleAddExpense} />
          </div>
          <div>
            <ExpenseTable expenses={expenses} onEdit={(expense) => setEditingExpense(expense)} />
          </div>
        </div>
      </main>

      <Dialog open={!!editingExpense} onOpenChange={() => setEditingExpense(null)}>
        <DialogContent
          className="sm:max-w-3xl max-h-[90vh] overflow-y-auto border shadow-lg"
          style={{
            backgroundColor: '#ffffff',
            backdropFilter: 'none',
            opacity: 1
          }}
        >
          <DialogHeader style={{ backgroundColor: '#ffffff' }}>
            <DialogTitle>Editar Gasto</DialogTitle>
          </DialogHeader>
          <div style={{ backgroundColor: '#ffffff' }}>
            {editingExpense && (
              <ExpenseForm
                onSubmit={handleEditExpense}
                initialData={editingExpense}
                isEditing={true}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSummariesDialog} onOpenChange={setShowSummariesDialog}>
        <DialogContent
          className="sm:max-w-3xl max-h-[80vh] overflow-y-auto border shadow-lg"
          style={{
            backgroundColor: '#ffffff',
            backdropFilter: 'none',
            opacity: 1
          }}
        >
          <DialogHeader style={{ backgroundColor: '#ffffff' }}>
            <DialogTitle>Resúmenes de Tarjeta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4" style={{ backgroundColor: '#ffffff' }}>
            {cardSummaries.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No hay resúmenes de tarjeta disponibles todavía
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {cardSummaries.map((summary) => (
                  <Card key={summary.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {formatPeriod(summary.periodo)}
                          </CardTitle>
                          {summary.descripcion && (
                            <CardDescription className="mt-1">
                              {summary.descripcion}
                            </CardDescription>
                          )}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => setSelectedSummary(summary)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Ver
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{summary.archivoNombre}</span>
                        <span>
                          Subido: {new Date(summary.createdAt).toLocaleDateString("es-AR")}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedSummary} onOpenChange={() => setSelectedSummary(null)}>
        <DialogContent
          className="sm:max-w-4xl max-h-[90vh] overflow-y-auto border shadow-lg"
          style={{
            backgroundColor: '#ffffff',
            backdropFilter: 'none',
            opacity: 1
          }}
        >
          <DialogHeader style={{ backgroundColor: '#ffffff' }}>
            <DialogTitle>
              Resumen - {selectedSummary && formatPeriod(selectedSummary.periodo)}
            </DialogTitle>
          </DialogHeader>
          {selectedSummary && (
            <div className="space-y-4" style={{ backgroundColor: '#ffffff' }}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Archivo</p>
                  <p className="font-medium">{selectedSummary.archivoNombre}</p>
                </div>
                <a
                  href={selectedSummary.archivo}
                  download={selectedSummary.archivoNombre}
                  className="inline-flex"
                >
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Descargar
                  </Button>
                </a>
              </div>

              {selectedSummary.archivoTipo?.startsWith("image/") ? (
                <div className="rounded-lg border overflow-hidden">
                  <img
                    src={selectedSummary.archivo}
                    alt="Resumen de tarjeta"
                    className="w-full h-auto"
                  />
                </div>
              ) : selectedSummary.archivoTipo === "application/pdf" ? (
                <div className="rounded-lg border overflow-hidden">
                  <iframe
                    src={selectedSummary.archivo}
                    className="w-full h-[600px]"
                    title="Vista previa del resumen"
                  />
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No se puede previsualizar este archivo. Descárgalo para verlo.
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
