import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
const VERIFICATION_CODE = process.env.VERIFICATION_CODE || '25@@puebla!';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email y código son requeridos' },
        { status: 400 }
      );
    }

    // Verificar el código
    if (code !== VERIFICATION_CODE) {
      return NextResponse.json(
        { error: 'Código de verificación incorrecto' },
        { status: 400 }
      );
    }

    // Buscar el usuario
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Marcar como verificado
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { isCodeVerified: true }
    });

    return NextResponse.json({
      success: true,
      user: updatedUser
    });

  } catch (error) {
    console.error('Error en verificación:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}