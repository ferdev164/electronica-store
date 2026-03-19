import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await request.json()

  const producto = await prisma.producto.create({
    data: {
      nombre: body.nombre,
      slug: body.nombre.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      descripcion: body.descripcion,
      precio: body.precio,
      stock: body.stock,
      voltaje: body.voltaje,
      protocolo: body.protocolo,
      tipo_salida: body.tipo_salida,
      categoriaId: body.categoriaId,
    },
  })

  return NextResponse.json(producto)
}