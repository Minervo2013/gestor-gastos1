"use client"

import { useState } from "react"
import type { Expense } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FileText, Eye, Globe, Store, Info } from "lucide-react"

interface ExpenseTableProps {
  expenses: Expense[]
}

export function ExpenseTable({ expenses }: ExpenseTableProps) {
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: currency === "ARS" ? "ARS" : "USD",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-AR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getCanalIcon = (canal: string) => {
    switch (canal) {
      case "web":
        return <Globe className="h-4 w-4" />
      case "local":
        return <Store className="h-4 w-4" />
      case "otro":
        return <Info className="h-4 w-4" />
      default:
        return null
    }
  }

  const totalGeneral = expenses.reduce((acc, expense) => acc + expense.importeTotal, 0)

  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-semibold">No hay gastos registrados</h3>
        <p className="text-sm text-muted-foreground">Comienza registrando tu primer gasto usando el formulario</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold">Gastos Registrados</h2>
          <div className="text-left sm:text-right">
            <p className="text-sm text-muted-foreground">Total General</p>
            <p className="text-2xl font-bold">{formatCurrency(totalGeneral, "ARS")}</p>
          </div>
        </div>

        <div className="block md:hidden space-y-3">
          {expenses.map((expense) => (
            <div key={expense.id} className="rounded-lg border p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{expense.motivo}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(expense.fechaGasto)}</p>
                </div>
                <Badge variant="outline" className="flex items-center gap-1">
                  {getCanalIcon(expense.canalPago)}
                  <span className="capitalize">{expense.canalPago}</span>
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Monto</p>
                  <p className="font-semibold">{formatCurrency(expense.monto, expense.moneda)}</p>
                </div>
                {expense.tieneCuotas && (
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Cuotas</p>
                    <p className="font-medium">{expense.cantidadCuotas}x</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div>
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-lg font-bold">{formatCurrency(expense.importeTotal, expense.moneda)}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setSelectedExpense(expense)}>
                  <Eye className="h-4 w-4 mr-1" />
                  Ver detalle
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden md:block overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha Gasto</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Cuotas</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Canal</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{formatDate(expense.fechaGasto)}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{expense.motivo}</TableCell>
                  <TableCell>{formatCurrency(expense.monto, expense.moneda)}</TableCell>
                  <TableCell>
                    {expense.tieneCuotas ? (
                      <span className="text-sm font-medium">{expense.cantidadCuotas}x</span>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(expense.importeTotal, expense.moneda)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="flex items-center gap-1 w-fit">
                      {getCanalIcon(expense.canalPago)}
                      <span className="capitalize">{expense.canalPago}</span>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedExpense(expense)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={!!selectedExpense} onOpenChange={() => setSelectedExpense(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalle del Gasto</DialogTitle>
          </DialogHeader>
          {selectedExpense && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fecha del Gasto</p>
                  <p className="text-lg">{formatDate(selectedExpense.fechaGasto)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fecha de Carga</p>
                  <p className="text-lg">{formatDateTime(selectedExpense.fechaCarga)}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Motivo</p>
                <p className="text-lg">{selectedExpense.motivo}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Detalle</p>
                <p className="text-lg">{selectedExpense.detalle}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Monto</p>
                  <p className="text-lg font-semibold">
                    {formatCurrency(selectedExpense.monto, selectedExpense.moneda)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Moneda</p>
                  <p className="text-lg">{selectedExpense.moneda}</p>
                </div>
                {selectedExpense.tipoCambio && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tipo de Cambio</p>
                    <p className="text-lg">{selectedExpense.tipoCambio}</p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Canal de Pago</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="flex items-center gap-1">
                    {getCanalIcon(selectedExpense.canalPago)}
                    <span className="capitalize">{selectedExpense.canalPago}</span>
                  </Badge>
                  {selectedExpense.canalPagoDetalle && (
                    <span className="text-sm">
                      {selectedExpense.canalPago === "web" ? (
                        <a
                          href={selectedExpense.canalPagoDetalle}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {selectedExpense.canalPagoDetalle}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">{selectedExpense.canalPagoDetalle}</span>
                      )}
                    </span>
                  )}
                </div>
              </div>

              {selectedExpense.tieneCuotas && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cuotas</p>
                  <p className="text-lg">
                    {selectedExpense.cantidadCuotas} cuotas de{" "}
                    {formatCurrency(selectedExpense.monto, selectedExpense.moneda)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Total: {formatCurrency(selectedExpense.importeTotal, selectedExpense.moneda)}
                  </p>
                </div>
              )}

              {selectedExpense.documento && (
                <div>
                  <p className="mb-2 text-sm font-medium text-muted-foreground">Documento</p>
                  <div className="rounded-lg border p-4">
                    <p className="mb-2 text-sm">{selectedExpense.documentoNombre}</p>
                    {selectedExpense.documentoTipo?.startsWith("image/") ? (
                      <div className="flex flex-col items-center">
                        <img
                          src={selectedExpense.documento || "/placeholder.svg"}
                          alt="Comprobante"
                          className="max-h-64 rounded object-contain border"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.svg";
                            target.alt = "Error cargando imagen";
                          }}
                        />
                        <a
                          href={selectedExpense.documento}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 text-xs text-primary hover:underline"
                        >
                          Ver en tamaño completo
                        </a>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <a
                          href={selectedExpense.documento}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          Ver documento
                        </a>
                        <a
                          href={selectedExpense.documento}
                          download={selectedExpense.documentoNombre}
                          className="text-xs text-muted-foreground hover:underline"
                        >
                          Descargar documento
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
