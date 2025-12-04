import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Actualizar todos los registros existentes que tienen montoEnPesos = 0
    const expensesToUpdate = await prisma.expense.findMany({
      where: {
        montoEnPesos: 0
      }
    });

    console.log(`Encontrados ${expensesToUpdate.length} gastos para actualizar`);

    for (const expense of expensesToUpdate) {
      let montoEnPesos = expense.monto;
      
      // Si la moneda no es ARS y tiene tipo de cambio, calcular el monto en pesos
      if (expense.moneda !== 'ARS' && expense.tipoCambio) {
        montoEnPesos = expense.monto * expense.tipoCambio;
      }

      await prisma.expense.update({
        where: { id: expense.id },
        data: { montoEnPesos }
      });
    }

    return NextResponse.json({
      success: true,
      message: `Se actualizaron ${expensesToUpdate.length} registros`,
      updated: expensesToUpdate.length
    });

  } catch (error) {
    console.error('Error migrando montos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error },
      { status: 500 }
    );
  }
}