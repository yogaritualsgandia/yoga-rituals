import type { Metadata } from "next"
import { Literata, Source_Sans_3 } from "next/font/google"

import "./globals.css"
import { AvisoCookies } from "@/components/consentimiento/aviso-cookies"
import { ProveedorConsentimiento } from "@/components/consentimiento/proveedor-consentimiento"
import { AccionFija } from "@/components/layout/accion-fija"
import { Cabecera } from "@/components/layout/cabecera"
import { FondoAmbiente } from "@/components/layout/fondo-ambiente"
import { Pie } from "@/components/layout/pie"
import { WhatsAppFlotante } from "@/components/layout/whatsapp-flotante"
import { ProveedorMovimiento } from "@/components/movimiento/proveedor-movimiento"
import { TransicionPagina } from "@/components/movimiento/transicion-pagina"
import { ThemeProvider } from "@/components/theme-provider"
import { site } from "@/content/site"
import { datosEstructuradosComoTexto } from "@/lib/datos-estructurados"
import { GUION_MOVIMIENTO } from "@/lib/movimiento"
import { cn } from "@/lib/utils"

/**
 * Literata — titulares. Serif con x-height grande y algo de carácter:
 * aguanta los tamaños grandes sin volverse fría.
 */
const literata = Literata({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
})

/**
 * Source Sans 3 — texto e interfaz. Humanista y muy legible en cuerpos
 * pequeños; deliberadamente no es Inter.
 */
const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-text",
  display: "swap",
})

const descripcion =
  "Yoga en el centro de Gandia: Hatha, Vinyasa, Yoga Nidra, mindfulness y yoga oncológico. Horarios libres, sin reservar. Primera clase de prueba gratis."

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "YOGA Rituals · Estudio de yoga en Gandia",
    template: "%s · YOGA Rituals",
  },
  description: descripcion,
  applicationName: site.nombre,
  authors: [{ name: site.fundadora }],
  creator: site.fundadora,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "/",
    siteName: site.nombre,
    title: "YOGA Rituals · Estudio de yoga en Gandia",
    description: descripcion,
    images: [
      {
        url: "/compartir.png",
        width: 1200,
        height: 630,
        /* El texto alternativo describe lo que se ve, no repite el titular:
           quien no ve la imagen ya tiene el título y la descripción al lado. */
        alt: "YOGA Rituals, estudio de yoga en Gandia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YOGA Rituals · Estudio de yoga en Gandia",
    description: descripcion,
    images: ["/compartir.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  formatDetection: { telephone: true, address: true },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={cn("antialiased", literata.variable, sourceSans.variable)}
    >
      <body className="flex min-h-dvh flex-col">
        {/* El primero de todo, y a propósito.
            Dice si el movimiento está permitido poniendo un atributo en el
            <html>, y tiene que hacerlo antes de que se pinte el primer
            elemento: las entradas de más abajo parten escondidas, y el CSS
            solo las esconde si ve ese atributo. Puesto desde aquí no hay
            ningún instante en que se vean de más, y si el paquete de
            JavaScript no llegara, el atributo no estaría y no se escondería
            nada. El porqué completo, en `GUION_MOVIMIENTO`. */}
        <script dangerouslySetInnerHTML={{ __html: GUION_MOVIMIENTO }} />

        <ThemeProvider>
          <ProveedorConsentimiento>
            <ProveedorMovimiento>
              {/* El fondo de toda la web. Va detrás de todo —`z-index: -1`— y no
                entra ni en el orden de lectura ni en el del teclado. */}
              <FondoAmbiente />

              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: datosEstructuradosComoTexto(),
                }}
              />

              <a href="#contenido" className="salto-contenido">
                Saltar al contenido
              </a>

              <Cabecera />

              <main id="contenido" className="flex-1">
                <TransicionPagina>{children}</TransicionPagina>
              </main>

              <Pie />

              {/* El hueco que ocupa la barra fija de móvil, para que no tape el
                final del pie. */}
              <div aria-hidden="true" className="h-24 lg:hidden" />

              <AccionFija />

              <WhatsAppFlotante />

              {/* Lo último del documento, y a propósito: el cartel de cookies no
                entra en el orden de lectura por delante del contenido —quien
                navegue con lector de pantalla llega antes a la web que al
                aviso— y, si aparece, está donde no tapa nada. Se pinta solo si
                hay analítica configurada y todavía no se ha contestado. */}
              <AvisoCookies />
            </ProveedorMovimiento>
          </ProveedorConsentimiento>
        </ThemeProvider>
      </body>
    </html>
  )
}
