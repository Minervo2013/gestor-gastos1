import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { users, expenses } = body;

    let migratedUsers = 0;
    let migratedExpenses = 0;

    // Migrar usuarios si existen
    if (users && Array.isArray(users)) {
      for (const userData of users) {
        try {
          // Verificar si el usuario ya existe
          const existingUser = await prisma.user.findUnique({
            where: { email: userData.email }
          });

          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: userData.email,
                nombre: userData.nombre,
                sector: userData.sector,
                tarjetaUltimos4: userData.tarjetaUltimos4,
                isAdmin: userData.isAdmin || false,
                isCodeVerified: false, // Todos los usuarios migrados necesitarán verificar el código
              }
            });
            migratedUsers++;
          }
        } catch (error) {
          console.error(`Error migrando usuario ${userData.email}:`, error);
        }
      }
    }

    // Migrar gastos si existen
    if (expenses && Array.isArray(expenses)) {
      for (const expenseData of expenses) {
        try {
          // Buscar el usuario por email
          const user = await prisma.user.findUnique({
            where: { email: expenseData.userEmail }
          });

          if (user) {
            await prisma.expense.create({
              data: {
                userId: user.id,
                fechaGasto: new Date(expenseData.fechaGasto),
                motivo: expenseData.motivo,
                detalle: expenseData.detalle,
                monto: parseFloat(expenseData.monto),
                importeTotal: parseFloat(expenseData.importeTotal),
                moneda: expenseData.moneda,
                tipoCambio: expenseData.tipoCambio ? parseFloat(expenseData.tipoCambio) : null,
                canalPago: expenseData.canalPago,
                canalPagoDetalle: expenseData.canalPagoDetalle,
                tieneCuotas: Boolean(expenseData.tieneCuotas),
                cantidadCuotas: expenseData.cantidadCuotas ? parseInt(expenseData.cantidadCuotas) : null,
                documento: expenseData.documento,
                documentoNombre: expenseData.documentoNombre,
                documentoTipo: expenseData.documentoTipo
              }
            });
            migratedExpenses++;
          }
        } catch (error) {
          console.error(`Error migrando gasto ${expenseData.id}:`, error);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Migración completada: ${migratedUsers} usuarios y ${migratedExpenses} gastos migrados`,
      migratedUsers,
      migratedExpenses
    });

  } catch (error) {
    console.error('Error en migración:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor durante la migración' },
      { status: 500 }
    );
  }
}