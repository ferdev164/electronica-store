import { prisma } from '@/lib/db'
import ProductoForm from '@/components/ProductoForm'

export default async function NuevoProductoPage() {
  const categorias = await prisma.categoria.findMany({
    orderBy: { nombre: 'asc' },
    select: { id: true, nombre: true, slug: true },
  })

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Nuevo producto</h1>
      </div>
      <ProductoForm categorias={categorias} />
    </div>
  )
}