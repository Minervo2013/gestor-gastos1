import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Sin sesión de Microsoft activa" }, { status: 401 })
    }

    const email = session.user.email
    const nombreMicrosoft = session.user.name || email.split("@")[0]

    // Buscar usuario existente en la BD
    let user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      // Primer login con Microsoft: crear cuenta automáticamente
      user = await prisma.user.create({
        data: {
          email,
          nombre: nombreMicrosoft,
          sector: "",
          tarjetaUltimos4: "0000",
          isAdmin: false,
          isCodeVerified: true, // Microsoft ya lo autenticó
        },
      })
    } else if (!user.isCodeVerified) {
      // Si el usuario existía pero no había verificado el código, lo marcamos como verificado
      user = await prisma.user.update({
        where: { id: user.id },
        data: { isCodeVerified: true },
      })
    }

    const { password: _, ...userResponse } = user

    return NextResponse.json({ success: true, user: userResponse })
  } catch (error) {
    console.error("Error en microsoft-user:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
