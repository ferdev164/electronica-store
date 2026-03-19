import { NextRequest, NextResponse } from 'next/server'
import { getProductos } from '@/lib/productos'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const categoriaSlug = searchParams.get('categoria') || undefined
  const busqueda = searchParams.get('q') || undefined

  const productos = await getProductos({ categoriaSlug, busqueda })
  return NextResponse.json(productos)
}