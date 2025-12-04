export interface Expense {
  id: string
  fechaGasto: string // Fecha del gasto real
  fechaCarga: string // Fecha de registro en el sistema
  motivo: string
  detalle: string
  monto: number
  montoEnPesos?: number // Monto convertido a pesos argentinos (opcional por ahora)
  importeTotal: number
  moneda: string
  tipoCambio?: number
  canalPago: "web" | "local" | "otro"
  canalPagoDetalle?: string // URL de web, nombre de tienda, o comentario de otro
  tieneCuotas: boolean
  cantidadCuotas?: number
  documento?: string // Base64 del archivo o URL
  documentoNombre?: string
  documentoTipo?: string
}

export const MONEDAS = ["ARS", "USD", "EUR", "BRL", "CLP"] as const
export const CANALES_PAGO = ["web", "local", "otro"] as const

export interface User {
  id: string
  email: string
  nombre: string
  sector: string
  tarjetaUltimos4: string
  password?: string // Opcional para no exponer en el frontend
  isAdmin: boolean
  isCodeVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface UserExpense extends Expense {
  userId: string
  userName: string
  userEmail: string
  userSector?: string
  userTarjeta?: string
}
