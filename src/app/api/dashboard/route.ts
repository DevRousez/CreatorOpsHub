import { NextResponse } from 'next/server';
import { fetchServerDashboardData } from '@/lib/server-data';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const mockParam = searchParams.get('mock');
    const forceMock = mockParam !== null ? mockParam === 'true' : undefined;

    const data = await fetchServerDashboardData(forceMock);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error en /api/dashboard:', error);
    return NextResponse.json(
      { error: error.message || 'Error al obtener datos' },
      { status: 500 }
    );
  }
}
