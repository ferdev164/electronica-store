require('dotenv').config()
const { PrismaClient } = require('./.prisma/client/default')

const prisma = new PrismaClient()
async function main() {
  const sensores = await prisma.categoria.upsert({
    where: { slug: 'sensores' },
    update: {},
    create: {
      nombre: 'Sensores',
      slug: 'sensores',
      descripcion: 'Sensores industriales y de laboratorio',
    },
  })

  const actuadores = await prisma.categoria.upsert({
    where: { slug: 'actuadores' },
    update: {},
    create: {
      nombre: 'Actuadores',
      slug: 'actuadores',
      descripcion: 'Motores, servos y relés',
    },
  })

  const comunicacion = await prisma.categoria.upsert({
    where: { slug: 'comunicacion' },
    update: {},
    create: {
      nombre: 'Comunicación',
      slug: 'comunicacion',
      descripcion: 'Módulos de comunicación inalámbrica y serial',
    },
  })

  await prisma.producto.upsert({
    where: { slug: 'sensor-ultrasonico-hc-sr04' },
    update: {},
    create: {
      nombre: 'Sensor Ultrasónico HC-SR04',
      slug: 'sensor-ultrasonico-hc-sr04',
      descripcion: 'Sensor de distancia por ultrasonido. Rango 2cm a 400cm.',
      precio: 8.50,
      stock: 45,
      voltaje: '5V',
      protocolo: 'GPIO',
      tipo_salida: 'Digital',
      categoriaId: sensores.id,
      imagenes: {
        create: [
          {
            url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
            alt: 'HC-SR04 vista frontal',
            orden: 0,
          },
        ],
      },
    },
  })

  await prisma.producto.upsert({
    where: { slug: 'sensor-temperatura-dht22' },
    update: {},
    create: {
      nombre: 'Sensor Temperatura y Humedad DHT22',
      slug: 'sensor-temperatura-dht22',
      descripcion: 'Sensor digital de temperatura y humedad. Alta precisión.',
      precio: 12.00,
      stock: 30,
      voltaje: '3.3V-5V',
      protocolo: 'Single-wire',
      tipo_salida: 'Digital',
      categoriaId: sensores.id,
      imagenes: {
        create: [
          {
            url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
            alt: 'DHT22 vista frontal',
            orden: 0,
          },
        ],
      },
    },
  })

  await prisma.producto.upsert({
    where: { slug: 'modulo-rele-5v-2-canales' },
    update: {},
    create: {
      nombre: 'Módulo Relé 5V 2 Canales',
      slug: 'modulo-rele-5v-2-canales',
      descripcion: 'Módulo de relé para control de cargas de alta potencia.',
      precio: 11.00,
      stock: 25,
      voltaje: '5V',
      protocolo: 'GPIO',
      tipo_salida: 'Relay',
      categoriaId: actuadores.id,
      imagenes: {
        create: [
          {
            url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
            alt: 'Relé 2 canales',
            orden: 0,
          },
        ],
      },
    },
  })

  await prisma.producto.upsert({
    where: { slug: 'modulo-wifi-esp8266-nodemcu' },
    update: {},
    create: {
      nombre: 'Módulo WiFi ESP8266 NodeMCU',
      slug: 'modulo-wifi-esp8266-nodemcu',
      descripcion: 'Microcontrolador con WiFi integrado. Ideal para proyectos IoT.',
      precio: 18.00,
      stock: 20,
      voltaje: '3.3V',
      protocolo: 'WiFi / UART',
      tipo_salida: 'Digital',
      categoriaId: comunicacion.id,
      imagenes: {
        create: [
          {
            url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
            alt: 'NodeMCU ESP8266',
            orden: 0,
          },
        ],
      },
    },
  })

  console.log('Seed completado exitosamente')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())