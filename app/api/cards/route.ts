import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId es requerido' }, { status: 400 })
    }

    const tarjetas = await prisma.tarjeta.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json({ success: true, tarjetas })
  } catch (error) {
    console.error('Error al obtener tarjetas:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, ultimos4, descripcion } = body

    if (!userId || !ultimos4) {
      return NextResponse.json({ error: 'userId y ultimos4 son requeridos' }, { status: 400 })
    }

    if (!/^\d{4}$/.test(ultimos4)) {
      return NextResponse.json({ error: 'Debe ingresar exactamente 4 dígitos' }, { status: 400 })
    }

    const tarjeta = await prisma.tarjeta.create({
      data: { userId, ultimos4, descripcion: descripcion || null },
    })

    return NextResponse.json({ success: true, tarjeta })
  } catch (error) {
    console.error('Error al crear tarjeta:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tarjetaId = searchParams.get('tarjetaId')
    const userId = searchParams.get('userId')

    if (!tarjetaId || !userId) {
      return NextResponse.json({ error: 'tarjetaId y userId son requeridos' }, { status: 400 })
    }

    const tarjeta = await prisma.tarjeta.findUnique({ where: { id: tarjetaId } })

    if (!tarjeta || tarjeta.userId !== userId) {
      return NextResponse.json({ error: 'Tarjeta no encontrada' }, { status: 404 })
    }

    await prisma.tarjeta.delete({ where: { id: tarjetaId } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error al eliminar tarjeta:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
