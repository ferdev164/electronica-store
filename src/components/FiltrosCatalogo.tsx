'use client'

import { useRouter, useSearchParams } from 'next/navigation'

interface Categoria {
  id: number
  nombre: string
  slug: string
}

interface Props {
  categorias: Categoria[]
  baseUrl: string
  color: 'blue' | 'amber' | 'emerald'
}

const colores = {
  blue: 'bg-blue-50 text-blue-700 font-medium',
  amber: 'bg-amber-50 text-amber-700 font-medium',
  emerald: 'bg-emerald-50 text-emerald-700 font-medium',
}

export default function FiltrosCatalogo({ categorias, baseUrl, color }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoriaActiva = searchParams.get('categoria')

  const navegar = (slug?: string) => {
    if (slug) {
      router.push(baseUrl + '?categoria=' + slug)
    } else {
      router.push(baseUrl)
    }
  }

  return (
    <aside className="w-full md:w-48 flex-shrink-0">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
        Categorias
      </p>
      <ul className="flex overflow-x-auto pb-2 scrollbar-hide flex-nowrap md:flex-wrap md:flex-col gap-2 md:gap-0 md:space-y-1">
        <li>
          <button
            onClick={() => navegar()}
            className={"inline-block md:block text-sm px-3 py-1.5 md:py-2 rounded-lg transition-colors " + (!categoriaActiva ? colores[color] : 'text-gray-600 hover:bg-gray-50')}
          >
            Todos
          </button>
        </li>
        {categorias.map((cat) => (
          <li key={cat.id}>
            <button
              onClick={() => navegar(cat.slug)}
              className={"inline-block md:block text-sm px-3 py-1.5 md:py-2 rounded-lg transition-colors " + (categoriaActiva === cat.slug ? colores[color] : 'text-gray-600 hover:bg-gray-50')}
            >
              {cat.nombre}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}