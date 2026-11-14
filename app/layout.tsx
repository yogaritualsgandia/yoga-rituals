import type { Metadata, Viewport } from "next"
import { Literata, Source_Sans_3 } from "next/font/google"

import "./globals.css"
import { AvisoCookies } from "@/components/consentimiento/aviso-cookies"
import { ProveedorConsentimiento } from "@/components/consentimiento/proveedor-consentimiento"
import { Cabecera } from "@/components/layout/cabecera"
import { FondoAmbiente } from "@/components/layout/fondo-ambiente"
import { Pie } from "@/components/layout/pie"
import { WhatsAppFlotante } from "@/components/layout/whatsapp-flotante"
import { ProveedorMovimiento } from "@/components/movimiento/proveedor-movimiento"
import { TransicionPagina } from "@/components/movimiento/transicion-pagina"
import { ThemeProvider } from "@/components/theme-provider"
import { site } from "@/content/site"
import { GUION_CONSENTIMIENTO } from "@/lib/consentimiento"
import { GUION_CONTROL_RECARGAS } from "@/lib/control-recargas"
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
  alternates: {
    canonical: "/",
    types: { "text/markdown": "/index.md" },
  },
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
           quien no veo la imagen ya tiene el título y la descripción al lado. */
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

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F4EFE7" },
    { media: "(prefers-color-scheme: dark)", color: "#2B2621" },
  ],
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
        {/* El banner del plugin de Netlify se oculta desde el primer pintado.
            Basta con el CSS: no hace falta borrar nodos ni quedarse mirando
            cada cambio del documento, y ese vigilante permanente costaba más
            que el problema que resolvía. */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          netlify-next-dev-toolbar, 
          [id*="netlify-dev-toolbar"], 
          .netlify-dt-element,
          #netlify-dev-toolbar-root,
          iframe[src*="netlify"] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
            position: absolute !important;
            top: -9999px !important;
            left: -9999px !important;
            width: 0 !important;
            height: 0 !important;
          }
        `,
          }}
        />

        {/* El primero de todo, y a propósito: si hay un castigo por recargas
            corriendo, devuelve a la pantalla de aviso antes de que se pinte la
            web. Sin esto, el minuto de espera solo valdría mientras se
            estuviera en esa pantalla: bastaría con escribir otra dirección
            para entrar. Lee el estado que guarda
            `public/demasiadas-peticiones.html`; el porqué completo, en
            `GUION_CONTROL_RECARGAS`. */}
        <script dangerouslySetInnerHTML={{ __html: GUION_CONTROL_RECARGAS }} />

        {/* El segundo, por el mismo motivo.
            Dice si el movimiento está permitido poniendo un atributo en el
            <html>, y tiene que hacerlo antes de que se pinte el primer
            elemento: las entradas de más abajo parten escondidas, y el CSS
            solo las esconde si ve ese atributo. Puesto desde aquí no hay
            ningún instante en que se vean de más, y si el paquete de
            JavaScript no llegara, el atributo no estaría y no se escondería
            nada. El porqué completo, en `GUION_MOVIMIENTO`. */}
        <script dangerouslySetInnerHTML={{ __html: GUION_MOVIMIENTO }} />

        {/* El segundo, por el mismo motivo y en el mismo sitio.

            El HTML se construye sin saber qué contestó nadie, así que el cartel
            de cookies nace dentro. Si ya se había contestado, React lo quita al
            hidratar, pero entre el primer pintado y ese momento se veía: un
            parpadeo en cada visita. Este guion lee la respuesta guardada antes
            de que se pinte nada y deja el cartel escondido por CSS. Quien no ha
            contestado nunca no tiene nada guardado: no se esconde nada y el
            cartel sale al instante, sin esperar al JavaScript. El porqué
            completo, en `GUION_CONSENTIMIENTO`. */}
        <script dangerouslySetInnerHTML={{ __html: GUION_CONSENTIMIENTO }} />

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
