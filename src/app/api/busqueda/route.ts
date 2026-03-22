import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim() || ''
  const limit = parseInt(searchParams.get('limit') || '5')

  if (q.length < 2) return NextResponse.json([])

  const productos = await prisma.producto.findMany({
    where: {
      activo: true,
      OR: [
        { nombre: { contains: q, mode: 'insensitive' } },
        { descripcion: { contains: q, mode: 'insensitive' } },
      ],
    },
    include: {
      categoria: { select: { nombre: true } },
      imagenes: { orderBy: { orden: 'asc' }, take: 1 },
    },
    take: limit,
    orderBy: { nombre: 'asc' },
  })

  return NextResponse.json(productos)
}