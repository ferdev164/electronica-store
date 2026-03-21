import Link from 'next/link'
import { prisma } from '@/lib/db'
import ProductCard from '@/components/ProductCard'

export default async function HomePage() {
  const productosDestacados = await prisma.producto.findMany({
    where: { activo: true },
    include: { categoria: true, imagenes: { orderBy: { orden: 'asc' } } },
    orderBy: { createdAt: 'desc' },
    take: 4,
  })

  return (
    <div>

      {/* Hero */}
      <section className="bg-white py-20 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-1 rounded-full mb-6 border border-emerald-100">
            Soluciones industriales — Todo el Peru
          </span>
          <h1 className="text-4xl font-semibold text-gray-900 leading-tight mb-4">
            Automatización, control electrico<br />y conectividad industrial
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8 leading-relaxed">
            Diseñamos tableros, integramos redes industriales y suministramos componentes tecnicos 
            para empresas en todo el Peru. Soluciones completas a la mano.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/productos" className="bg-gray-900 text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-700 transition-colors text-sm">
              Ver catálogo
            </Link>
            <a
              href={"https://wa.me/" + process.env.NEXT_PUBLIC_WHATSAPP_NUMBER + "?text=" + encodeURIComponent("Hola, quisiera informacion sobre sus soluciones industriales.")}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-200 text-gray-700 px-8 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm flex items-center gap-2"
            >
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </section>


      {/* 3 Líneas de negocio */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Nuestras lineas de servicio</h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              Tres areas especializadas para cubrir las necesidades tecnicas de tu empresa o proyecto industrial.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-sm transition-shadow">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-5">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8">
                  <rect x="2" y="3" width="20" height="14" rx="2"/>
                  <path d="M7 8h4M7 11h2"/>
                  <rect x="14" y="7" width="4" height="5" rx="1"/>
                </svg>
              </div>
              <div className="w-full h-0.5 bg-blue-500 rounded mb-5"></div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">Automatizacion & Control</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-5">
                Diseño y montaje de tableros electricos, programacion de PLCs, integracion de sensores y actuadores para procesos industriales y de manufactura.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {["Tableros", "PLCs", "HMI", "Variadores", "SCADA"].map((tag) => (
                  <span key={tag} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md">{tag}</span>
                ))}
              </div>
              <Link href="/control" className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors">
                Ver productos
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-sm transition-shadow">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-5">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="1.8">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              </div>
              <div className="w-full h-0.5 bg-amber-500 rounded mb-5"></div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">Electricidad</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-5">
                Suministro de componentes electricos industriales. Fuentes de alimentacion, contactores, reles, breakers y
                 todo lo necesario para instalaciones electricas.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {["Fuentes", "Contactores", "Reles", "Breakers", "Cables"].map((tag) => (
                  <span key={tag} className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-md">{tag}</span>
                ))}
              </div>
              <Link href="/electricidad" className="text-sm font-medium text-amber-600 hover:text-amber-800 flex items-center gap-1 transition-colors">
                Ver productos
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-sm transition-shadow">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-5">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.8">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div className="w-full h-0.5 bg-emerald-500 rounded mb-5"></div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">Redes Industriales & IoT</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-5">
                Implementación de redes industriales y soluciones IoT. Equipos multiprotocolo, monitoreo remoto en tiempo real
                 y conectividad para industria 4.0.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {["Modbus", "Profibus", "MQTT", "LoRa", "IoT"].map((tag) => (
                  <span key={tag} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md">{tag}</span>
                ))}
              </div>
              <Link href="/redes" className="text-sm font-medium text-emerald-600 hover:text-emerald-800 flex items-center gap-1 transition-colors">
                Ver productos
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="py-10 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
            {[
              { icon: "M5 12h14M12 5l7 7-7 7", titulo: "Envios a todo el Peru", sub: "Alcance nacional" },
              { icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", titulo: "Componentes originales", sub: "Distribuidores autorizados" },
              { icon: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z", titulo: "Facturacion electronica", sub: "Boleta y factura para empresas" },
              { icon: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z", titulo: "Soporte tecnico", sub: "Asesoria por WhatsApp" },
            ].map((item) => (
              <div key={item.titulo} className="flex items-start gap-3">
                <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
                    <path d={item.icon}/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.titulo}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Productos destacados */}
      {productosDestacados.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Productos destacados</h2>
                <p className="text-sm text-gray-400 mt-1">Los mas recientes en el catálogo</p>
              </div>
              <Link href="/productos" className="text-sm text-emerald-600 hover:text-emerald-800 font-medium flex items-center gap-1">
                Ver todos
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {productosDestacados.map((producto) => (
                <ProductCard key={producto.id} producto={producto as any} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-semibold text-white mb-3">
            Tienes un proyecto en mente?
          </h2>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            Cuentanos tu necesidad y te preparamos una solución técnica completa. Desde el diseño hasta la puesta en marcha.
          </p>
          <a
            href={"https://wa.me/" + process.env.NEXT_PUBLIC_WHATSAPP_NUMBER + "?text=" + encodeURIComponent("Hola, tengo un proyecto y quisiera una cotizacion.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-medium transition-colors text-sm"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Cotizar proyecto por WhatsApp
          </a>
        </div>
      </section>

    </div>
  )
}