import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, periodo, archivo, archivoNombre, archivoTipo, descripcion, adminUserId } = body

    if (!userId || !periodo || !archivo || !archivoNombre || !archivoTipo || !adminUserId) {
      return NextResponse.json(
        { success: false, error: "Faltan campos requeridos" },
        { status: 400 }
      )
    }

    // Verificar que quien hace el request es admin
    const adminUser = await prisma.user.findUnique({
      where: { id: adminUserId },
    })

    if (!adminUser || !adminUser.isAdmin) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 403 }
      )
    }

    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Usuario no encontrado" },
        { status: 404 }
      )
    }

    // Crear el resumen de tarjeta
    const cardSummary = await prisma.cardSummary.create({
      data: {
        userId,
        periodo,
        archivo,
        archivoNombre,
        archivoTipo,
        descripcion: descripcion || null,
      },
    })

    return NextResponse.json({
      success: true,
      cardSummary,
    })
  } catch (error) {
    console.error("Error al crear resumen de tarjeta:", error)
    return NextResponse.json(
      { success: false, error: "Error al crear resumen de tarjeta" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId es requerido" },
        { status: 400 }
      )
    }

    // Obtener todos los resúmenes del usuario, ordenados por período descendente
    const cardSummaries = await prisma.cardSummary.findMany({
      where: { userId },
      orderBy: { periodo: "desc" },
    })

    return NextResponse.json({
      success: true,
      cardSummaries,
    })
  } catch (error) {
    console.error("Error al obtener resúmenes:", error)
    return NextResponse.json(
      { success: false, error: "Error al obtener resúmenes" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const summaryId = searchParams.get("summaryId")
    const adminUserId = searchParams.get("adminUserId")

    if (!summaryId || !adminUserId) {
      return NextResponse.json(
        { success: false, error: "summaryId y adminUserId son requeridos" },
        { status: 400 }
      )
    }

    // Verificar que quien hace el request es admin
    const adminUser = await prisma.user.findUnique({
      where: { id: adminUserId },
    })

    if (!adminUser || !adminUser.isAdmin) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 403 }
      )
    }

    // Eliminar el resumen
    await prisma.cardSummary.delete({
      where: { id: summaryId },
    })

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error("Error al eliminar resumen:", error)
    return NextResponse.json(
      { success: false, error: "Error al eliminar resumen" },
      { status: 500 }
    )
  }
}
