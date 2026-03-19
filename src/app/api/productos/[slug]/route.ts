import { NextRequest, NextResponse } from 'next/server'
import { getProductoBySlug } from '@/lib/productos'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const producto = await getProductoBySlug(params.slug)

  if (!producto) {
    return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
  }

  return NextResponse.json(producto)
}
```

Verifica que funcionan abriendo en el navegador:
```
http://localhost:3000/api/productos
http://localhost:3000/api/productos/sensor-ultrasonico-hc-sr04