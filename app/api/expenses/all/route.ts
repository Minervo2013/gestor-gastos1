import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminUserId = searchParams.get('adminUserId');

    if (!adminUserId) {
      return NextResponse.json(
        { error: 'adminUserId es requerido' },
        { status: 400 }
      );
    }

    // Verificar que el usuario sea administrador
    const adminUser = await prisma.user.findUnique({
      where: { id: adminUserId }
    });

    if (!adminUser || !adminUser.isAdmin) {
      return NextResponse.json(
        { error: 'Acceso no autorizado' },
        { status: 403 }
      );
    }

    // Obtener todos los gastos con información del usuario
    const expenses = await prisma.expense.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            nombre: true,
            sector: true,
            tarjetaUltimos4: true,
          }
        }
      },
      orderBy: { fechaGasto: 'desc' }
    });

    // Transformar a formato UserExpense
    const userExpenses = expenses.map(expense => ({
      ...expense,
      userId: expense.user.id,
      userName: expense.user.nombre,
      userEmail: expense.user.email,
      userSector: expense.user.sector,
      userTarjeta: expense.user.tarjetaUltimos4,
    }));

    return NextResponse.json({
      success: true,
      expenses: userExpenses
    });

  } catch (error) {
    console.error('Error al obtener todos los gastos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}