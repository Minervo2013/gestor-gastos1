import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, nombre, sector, tarjetaUltimos4, password } = body;

    // Validar que el email termine con @pueblaequipo.com.ar
    if (!email.endsWith('@pueblaequipo.com.ar')) {
      return NextResponse.json(
        { error: 'Dominio no permitido' },
        { status: 400 }
      );
    }

    // Validar que todos los campos estén presentes
    if (!email || !nombre || !sector || !tarjetaUltimos4 || !password) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Validar formato de tarjeta (4 dígitos)
    if (tarjetaUltimos4.length !== 4 || !/^\d{4}$/.test(tarjetaUltimos4)) {
      return NextResponse.json(
        { error: 'Los últimos 4 dígitos de la tarjeta deben ser números' },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Este email ya está registrado' },
        { status: 400 }
      );
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear el usuario
    const user = await prisma.user.create({
      data: {
        email,
        nombre,
        sector,
        tarjetaUltimos4,
        password: hashedPassword,
        isAdmin: false,
        isCodeVerified: false,
      }
    });

    // Retornar el usuario sin información sensible
    const { password: _, ...userResponse } = user;
    
    return NextResponse.json({
      success: true,
      user: userResponse
    });

  } catch (error) {
    console.error('Error en registro:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}