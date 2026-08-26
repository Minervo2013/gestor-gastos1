import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

async function requireAdmin(adminUserId: string | null) {
  if (!adminUserId) return null
  const adminUser = await prisma.user.findUnique({ where: { id: adminUserId } })
  return adminUser?.isAdmin ? adminUser : null
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const adminUserId = searchParams.get('adminUserId')

    const admin = await requireAdmin(adminUserId)
    if (!admin) {
      return NextResponse.json({ error: 'Acceso no autorizado' }, { status: 403 })
    }

    const unidades = await prisma.unidad.findMany({ orderBy: { nombre: 'asc' } })

    return NextResponse.json({ success: true, unidades })
  } catch (error) {
    console.error('Error al obtener unidades:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { adminUserId, nombre, descripcion } = body

    const admin = await requireAdmin(adminUserId)
    if (!admin) {
      return NextResponse.json({ error: 'Acceso no autorizado' }, { status: 403 })
    }

    if (!nombre || !nombre.trim()) {
      return NextResponse.json({ error: 'El nombre de la unidad es requerido' }, { status: 400 })
    }

    const unidad = await prisma.unidad.create({
      data: { nombre: nombre.trim(), descripcion: descripcion || null },
    })

    return NextResponse.json({ success: true, unidad })
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'Ya existe una unidad con ese nombre' }, { status: 409 })
    }
    console.error('Error al crear unidad:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const unidadId = searchParams.get('unidadId')
    const adminUserId = searchParams.get('adminUserId')

    const admin = await requireAdmin(adminUserId)
    if (!admin) {
      return NextResponse.json({ error: 'Acceso no autorizado' }, { status: 403 })
    }

    if (!unidadId) {
      return NextResponse.json({ error: 'unidadId es requerido' }, { status: 400 })
    }

    await prisma.unidad.delete({ where: { id: unidadId } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error al eliminar unidad:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
