import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim() || ''
  const limit = parseInt(searchParams.get('limit') || '5')

  if (q.length < 2) return NextResponse.json([])

  const terminoLike = '%' + q + '%'
  const palabras = q.split(/\s+/).filter(Boolean)

  const ids = await prisma.$queryRaw<{ id: number }[]>`
    SELECT DISTINCT p.id
    FROM "Producto" p
    WHERE p.activo = true
      AND (
        p.nombre ILIKE ${terminoLike}
        OR COALESCE(p.descripcion, '') ILIKE ${terminoLike}
        OR COALESCE(p.voltaje, '') ILIKE ${terminoLike}
        OR COALESCE(p.protocolo, '') ILIKE ${terminoLike}
        OR similarity(p.nombre, ${q}) > 0.1
        ${palabras.length > 1 ? Prisma.sql`
          OR (${Prisma.join(palabras.map(p => Prisma.sql`p.nombre ILIKE ${'%' + p + '%'}`), ' AND ')})
        ` : Prisma.empty}
      )
    ORDER BY similarity(p.nombre, ${q}) DESC
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
}