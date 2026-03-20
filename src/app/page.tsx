import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-semibold text-gray-900">
          Componentes Mecatronicos y Electronicos
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          Sensores, actuadores y modulos de comunicacion para tus proyectos de automatizacion e IoT.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/productos"
            className="bg-gray-900 text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-700 transition-colors"
          >
            Ver catalogo
          </Link>
          <Link
            href="/productos?categoria=sensores"
            className="border border-gray-200 text-gray-600 px-8 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            Ver sensores
          </Link>
        </div>
      </div>
    </div>
  )
}