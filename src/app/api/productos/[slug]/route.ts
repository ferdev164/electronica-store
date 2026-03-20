import { NextRequest, NextResponse } from 'next/server'
import { getProductoBySlug } from '@/lib/productos'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params
  const producto = await getProductoBySlug(slug)

  if (!producto) {
    return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
  }

  return NextResponse.json(producto)
}