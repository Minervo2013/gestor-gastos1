import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const adminUserId = searchParams.get('adminUserId')

    if (!adminUserId) {
      return NextResponse.json({ error: 'adminUserId es requerido' }, { status: 400 })
    }

    const adminUser = await prisma.user.findUnique({ where: { id: adminUserId } })
    if (!adminUser || !adminUser.isAdmin) {
      return NextResponse.json({ error: 'Acceso no autorizado' }, { status: 403 })
    }

    const tarjetas = await prisma.tarjeta.findMany({
      include: {
        user: { select: { id: true, nombre: true, email: true } },
        unidad: { select: { id: true, nombre: true, descripcion: true } },
      },
      orderBy: { createdAt: 'asc' },
    })

    const result = tarjetas.map((t) => ({
      ...t,
      userNombre: t.user.nombre,
      userEmail: t.user.email,
    }))

    return NextResponse.json({ success: true, tarjetas: result })
  } catch (error) {
    console.error('Error al obtener todas las tarjetas:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
