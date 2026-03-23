import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim() || ''
  const limit = parseInt(searchParams.get('limit') || '5')

  if (q.length < 2) return NextResponse.json([])

  try {
    const palabras = q.split(/\s+/).filter(Boolean)

    const ids = await prisma.$queryRaw<{ id: number }[]>`
      SELECT DISTINCT p.id
      FROM "Producto" p
      WHERE p.activo = true
      AND (
        ${Prisma.join(
          palabras.map(palabra => Prisma.sql`(
            unaccent(lower(p.nombre)) ILIKE unaccent(lower(${'%' + palabra + '%'}))
            OR unaccent(lower(COALESCE(p.descripcion,''))) ILIKE unaccent(lower(${'%' + palabra + '%'}))
            OR unaccent(lower(COALESCE(p.voltaje,''))) ILIKE unaccent(lower(${'%' + palabra + '%'}))
            OR unaccent(lower(COALESCE(p.protocolo,''))) ILIKE unaccent(lower(${'%' + palabra + '%'}))
          )`),
          ' AND '
        )}
      )
      LIMIT ${limit}
    `

    if (ids.length === 0) return NextResponse.json([])

    const productos = await prisma.producto.findMany({
      where: { id: { in: ids.map(r => r.id) } },
      include: {
        categoria: { select: { nombre: true } },
        imagenes: { orderBy: { orden: 'asc' }, take: 1 },
      },
      take: limit,
    })

    return NextResponse.json(productos)
  } catch (error) {
    console.error('Error sugerencias:', error)
    return NextResponse.json([])
  }
}