import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim() || ''
  const limit = parseInt(searchParams.get('limit') || '5')

  if (q.length < 2) return NextResponse.json([])

  try {
    const palabras = q.split(/\s+/).filter(Boolean)
    const terminoLike = '%' + q + '%'

    const productos = await prisma.producto.findMany({
      where: {
        activo: true,
        AND: palabras.map((palabra) => {
          const p = palabra.toLowerCase()
            .replace(/[áàä]/g, 'a')
            .replace(/[éèë]/g, 'e')
            .replace(/[íìï]/g, 'i')
            .replace(/[óòö]/g, 'o')
            .replace(/[úùü]/g, 'u')
            .replace(/ñ/g, 'n')

          const variantes = [palabra, p]
          return {
            OR: variantes.flatMap((v) => [
              { nombre: { contains: v, mode: 'insensitive' as const } },
              { descripcion: { contains: v, mode: 'insensitive' as const } },
              { voltaje: { contains: v, mode: 'insensitive' as const } },
              { protocolo: { contains: v, mode: 'insensitive' as const } },
              { tipo_salida: { contains: v, mode: 'insensitive' as const } },
            ]),
          }
        }),
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
    console.error('Error busqueda:', error)
    return NextResponse.json([])
  }
}