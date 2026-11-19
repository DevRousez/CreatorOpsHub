import { NextResponse } from 'next/server';
import { getAppSettings, saveAppSettings } from '@/lib/settings';

export async function GET() {
  try {
    const settings = getAppSettings();
    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error al obtener configuraciones' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const updated = saveAppSettings(body);
    return NextResponse.json({
      success: true,
      message: 'Configuraciones guardadas correctamente',
      settings: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error al guardar configuraciones' },
      { status: 500 }
    );
  }
}
