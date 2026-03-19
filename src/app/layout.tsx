import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Electrónica Store',
  description: 'Componentes electrónicos de alto rendimiento',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
          <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="font-semibold text-gray-900 text-lg">
              Electrónica Store
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/productos" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Catálogo
              </Link>
              {/* Sprint 2: aquí va el botón del carrito con badge */}
            </div>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}