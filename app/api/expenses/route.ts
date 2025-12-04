import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId es requerido' },
        { status: 400 }
      );
    }

    const expenses = await prisma.expense.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            nombre: true,
          }
        }
      },
      orderBy: { fechaGasto: 'desc' }
    });

    return NextResponse.json({
      success: true,
      expenses
    });

  } catch (error) {
    console.error('Error al obtener gastos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      fechaGasto,
      motivo,
      detalle,
      monto,
      importeTotal,
      moneda,
      tipoCambio,
      canalPago,
      canalPagoDetalle,
      tieneCuotas,
      cantidadCuotas,
      documento,
      documentoNombre,
      documentoTipo
    } = body;

    // Validaciones básicas
    if (!userId || !fechaGasto || !motivo || !detalle || !monto || !importeTotal || !moneda || !canalPago) {
      return NextResponse.json(
        { error: 'Todos los campos obligatorios deben estar presentes' },
        { status: 400 }
      );
    }

    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    const expense = await prisma.expense.create({
      data: {
        userId,
        fechaGasto: new Date(fechaGasto),
        motivo,
        detalle,
        monto: parseFloat(monto),
        importeTotal: parseFloat(importeTotal),
        moneda,
        tipoCambio: tipoCambio ? parseFloat(tipoCambio) : null,
        canalPago,
        canalPagoDetalle,
        tieneCuotas: Boolean(tieneCuotas),
        cantidadCuotas: cantidadCuotas ? parseInt(cantidadCuotas) : null,
        documento,
        documentoNombre,
        documentoTipo
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            nombre: true,
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      expense
    });

  } catch (error) {
    console.error('Error al crear gasto:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}