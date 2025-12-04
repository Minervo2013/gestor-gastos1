import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  // Verificar que Supabase esté configurado
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Supabase no está configurado correctamente' },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;
    const expenseId = formData.get('expenseId') as string;

    if (!file || !userId) {
      return NextResponse.json(
        { error: 'Archivo y userId son requeridos' },
        { status: 400 }
      );
    }

    // Generar nombre único para el archivo
    const timestamp = new Date().getTime();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${userId}/${expenseId || timestamp}.${fileExtension}`;

    // Convertir archivo a buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Subir a Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from('documentos') // bucket name
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true
      });

    if (error) {
      console.error('Error subiendo archivo:', error);
      return NextResponse.json(
        { error: 'Error al subir el archivo' },
        { status: 500 }
      );
    }

    // Obtener URL pública del archivo
    const { data: urlData } = supabaseAdmin.storage
      .from('documentos')
      .getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      fileName: fileName,
      url: urlData.publicUrl,
      path: data.path
    });

  } catch (error) {
    console.error('Error en upload:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}