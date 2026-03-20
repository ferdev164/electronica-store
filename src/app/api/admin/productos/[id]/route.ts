import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await context.params
  const body = await request.json()

  await prisma.imagenProducto.deleteMany({
    where: { productoId: Number(id) },
  })

  const producto = await prisma.producto.update({
    where: { id: Number(id) },
    data: {
      nombre: body.nombre,
      descripcion: body.descripcion || null,
      precio: body.precio,
      stock: body.stock,
      voltaje: body.voltaje || null,
      protocolo: body.protocolo || null,
      tipo_salida: body.tipo_salida || null,
      pdf_url: body.pdf_url || null,
      activo: body.activo,
      categoriaId: body.categoriaId,
      imagenes: {
        create: body.imagenes.map((img: { url: string; alt: string }, index: number) => ({
          url: img.url,
          alt: img.alt,
          orden: index,
        })),
      },
    },
  })

  return NextResponse.json(producto)
}