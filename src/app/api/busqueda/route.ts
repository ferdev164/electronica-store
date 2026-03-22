import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim() || ''
  const limit = parseInt(searchParams.get('limit') || '5')

  if (q.length < 2) return NextResponse.json([])

  try {
    const palabras = q.split(/\s+/).filter(Boolean)

    const productos = await prisma.producto.findMany({
      where: {
        activo: true,
        AND: palabras.map((palabra) => ({
          OR: [
            { nombre: { contains: palabra, mode: 'insensitive' as const } },
            { descripcion: { contains: palabra, mode: 'insensitive' as const } },
            { voltaje: { contains: palabra, mode: 'insensitive' as const } },
            { protocolo: { contains: palabra, mode: 'insensitive' as const } },
            { tipo_salida: { contains: palabra, mode: 'insensitive' as const } },
          ],
        })),
      },
      include: {
        categoria: { select: { nombre: true } },
        imagenes: { orderBy: { orden: 'asc' }, take: 1 },
      },
      take: limit,
      orderBy: { nombre: 'asc' },
    })

    return NextResponse.json(productos)
  } catch (error) {
    console.error('Error en busqueda:', error)
    return NextResponse.json([], { status: 200 })
  }
}