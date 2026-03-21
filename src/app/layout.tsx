import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import CartSidebar from '@/components/CartSidebar'
import './globals.css'

import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'

import WhatsAppButton from '@/components/WhatsAppButton'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mecatronica Store',
  description: 'Componentes mecatronicos y electronicos de alto rendimiento',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Navbar />
        <CartSidebar />
        <WhatsAppButton />
        <ScrollToTop />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}