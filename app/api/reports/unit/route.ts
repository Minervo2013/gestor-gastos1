import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const unidadId = searchParams.get('unidadId');
    const month = searchParams.get('month'); // YYYY-MM
    const adminUserId = searchParams.get('adminUserId');

    if (!unidadId || !adminUserId) {
      return NextResponse.json(
        { error: 'unidadId y adminUserId son requeridos' },
        { status: 400 }
      );
    }

    const adminUser = await prisma.user.findUnique({ where: { id: adminUserId } });
    if (!adminUser || !adminUser.isAdmin) {
      return NextResponse.json({ error: 'Acceso no autorizado' }, { status: 403 });
    }

    const unidad = await prisma.unidad.findUnique({ where: { id: unidadId } });
    if (!unidad) {
      return NextResponse.json({ error: 'Unidad no encontrada' }, { status: 404 });
    }

    // Tarjetas asignadas a esta unidad
    const tarjetasDeLaUnidad = await prisma.tarjeta.findMany({
      where: { unidadId },
      select: { id: true, ultimos4: true },
    });
    const tarjetaIds = tarjetasDeLaUnidad.map((t) => t.id);

    // Todos los gastos hechos con tarjetas de esta unidad
    const allExpenses = tarjetaIds.length
      ? await prisma.expense.findMany({
          where: { tarjetaId: { in: tarjetaIds } },
          include: {
            user: { select: { id: true, nombre: true, email: true } },
            tarjeta: { select: { id: true, ultimos4: true, descripcion: true } },
            unidadDestino: { select: { id: true, nombre: true } },
          },
          orderBy: { fechaGasto: 'desc' },
        })
      : [];

    let expenses = allExpenses;
    let actualPeriod = 'Todos los períodos';

    if (month && allExpenses.length > 0) {
      const startDate = new Date(`${month}-01T00:00:00.000Z`);
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
      endDate.setHours(23, 59, 59, 999);

      const monthlyExpenses = allExpenses.filter((expense) => {
        const expenseDate = new Date(expense.fechaGasto);
        return expenseDate >= startDate && expenseDate <= endDate;
      });

      if (monthlyExpenses.length > 0) {
        expenses = monthlyExpenses;
        actualPeriod = `${month} (${monthlyExpenses.length} gastos)`;
      } else {
        actualPeriod = `Todos los períodos (${allExpenses.length} gastos) - No hay gastos en ${month}`;
      }
    } else {
      actualPeriod = `Todos los períodos (${allExpenses.length} gastos)`;
    }

    // Agrupar por unidad de destino
    type GroupEntry = { unidadId: string | null; unidadNombre: string; total: number; count: number; expenses: typeof expenses };
    const grupos = new Map<string, GroupEntry>();

    for (const expense of expenses) {
      const destinoId = expense.unidadDestino?.id || null;
      const destinoNombre = expense.unidadDestino?.nombre || unidad.nombre; // sin destino explícito = queda en la propia unidad
      const key = destinoId || `__propia__${unidad.id}`;

      if (!grupos.has(key)) {
        grupos.set(key, { unidadId: destinoId, unidadNombre: destinoNombre, total: 0, count: 0, expenses: [] });
      }
      const grupo = grupos.get(key)!;
      grupo.total += expense.importeTotal;
      grupo.count += 1;
      grupo.expenses.push(expense);
    }

    const gruposArray = Array.from(grupos.values()).sort((a, b) => b.total - a.total);
    const gastosParaOtrasUnidades = gruposArray.filter((g) => g.unidadId && g.unidadId !== unidad.id);
    const gastosPropios = gruposArray.filter((g) => !g.unidadId || g.unidadId === unidad.id);

    const totalAmount = expenses.reduce((sum, e) => sum + e.importeTotal, 0);
    const totalParaOtrasUnidades = gastosParaOtrasUnidades.reduce((sum, g) => sum + g.total, 0);

    return NextResponse.json({
      success: true,
      data: {
        unidad,
        period: actualPeriod,
        tarjetas: tarjetasDeLaUnidad,
        statistics: {
          totalAmount,
          totalExpenses: expenses.length,
          totalParaOtrasUnidades,
        },
        gastosParaOtrasUnidades,
        gastosPropios,
      },
    });
  } catch (error) {
    console.error('Error al generar reporte de unidad:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
