import { prisma } from '@/lib/db'
import ProductoForm from '@/components/ProductoForm'

export default async function NuevoProductoPage() {
  const categorias = await prisma.categoria.findMany({
    orderBy: { nombre: 'asc' },
  })

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Nuevo producto</h1>
      <ProductoForm categorias={categorias} />
    </div>
  )
}