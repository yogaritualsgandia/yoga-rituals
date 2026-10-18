import { Mail, MapPin, Phone } from "lucide-react"
import Link from "next/link"

import { mapaUrl, navegacionLegal, site, whatsappUrl } from "@/content/site"

import { BotonPausa } from "@/components/movimiento/boton-pausa"

import { BotonTema } from "./boton-tema"
import { Contenedor } from "./contenedor"
import { Marca } from "./marca"

/**
 * Pie.
 *
 * En dos franjas: quién es y cómo se le contacta, y lo legal. Tuvo una tercera
 * en medio —el mapa del sitio, en tres columnas— y se ha quitado entera: era un
 * índice de trece enlaces que repetía lo que ya estaba en la cabecera y en la
 * portada, y convertía el pie en la parte más densa de la web.
 *
 * De aquel bloque quedó un rato un enlace a la página de contacto, y también se
 * ha ido. Sobraba por dos motivos: el contacto entero está aquí al lado —la
 * dirección, el teléfono y el correo se pulsan— y la reserva no se hace en
 * ninguna página, se hace por WhatsApp, que es lo que hay justo a la derecha.
 * Un enlace que dice «Contacto y reserva» y lleva a un sitio donde no se
 * reserva es peor que no tenerlo.
 *
 * Aquí vive el SEO local: la dirección completa como texto, en un <address>
 * de verdad, con el nombre del estudio y la ciudad. Es lo que leen Google y
 * quien busca «yoga en Gandia».
 */
export function Pie() {
  const anio = new Date().getFullYear()
  const { calle, piso, codigoPostal, ciudad, provincia } = site.direccion

  return (
    <footer className="border-t border-line bg-surface-2/50">
      <Contenedor className="py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5 lg:col-span-4">
            <Marca />
            <p className="paso-pequeno mt-5 max-w-[32ch] text-ink-soft">
              Estudio de yoga en Gandia. Presencial, en grupos pequeños, con
              horarios libres.
            </p>
            <p className="paso-pequeno mt-2 text-ink-soft">
              {site.aniversarioTexto}
            </p>
          </div>

          <div className="flex flex-col gap-3 md:col-span-4 lg:col-span-4 lg:col-start-6">
            <address className="flex flex-col gap-3 not-italic">
              {/* La dirección es un enlace al mapa, y ese es el arreglo más útil
                  que se le podía hacer a este bloque: quien la lee la está
                  leyendo para venir, y hasta ahora tenía que copiarla en otra
                  pestaña para saber por dónde se entra. Junto con el teléfono y
                  el correo, las tres cosas se pulsan. */}
              <a
                href={mapaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 items-start gap-2.5 hover:text-brand"
              >
                <MapPin
                  aria-hidden="true"
                  className="mt-1 size-4 shrink-0 text-ink-soft"
                />
                <span>
                  {calle}, {piso}
                  <br />
                  {codigoPostal} {ciudad} ({provincia})
                </span>
              </a>

              <a
                href={`tel:${site.contacto.telefono}`}
                className="inline-flex items-center gap-2.5 min-h-11 hover:text-brand"
              >
                <Phone
                  aria-hidden="true"
                  className="size-4 shrink-0 text-ink-soft"
                />
                {site.contacto.telefonoVisible}
              </a>

              <a
                href={`mailto:${site.contacto.email}`}
                className="inline-flex items-center gap-2.5 min-h-11 hover:text-brand"
              >
                <Mail
                  aria-hidden="true"
                  className="size-4 shrink-0 text-ink-soft"
                />
                {site.contacto.email}
              </a>
            </address>
          </div>

          <div className="md:col-span-3 lg:col-start-10">
            <h2 className="etiqueta">Sígueme</h2>
            <ul className="mt-4 flex flex-col gap-1">
              <li>
                <a
                  href={site.redes.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center hover:text-brand"
                >
                  @{site.redes.instagram.usuario}
                </a>
              </li>
              <li>
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center hover:text-brand"
                >
                  WhatsApp
                </a>
              </li>
            </ul>

            {/* Los dos mandos de la casa: el tema y el movimiento. Van juntos
                porque son las dos únicas cosas que alguien puede querer
                cambiar de cómo se ve la web. */}
            <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-1 border-t border-line pt-5">
              <BotonTema />
              <BotonPausa />
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-7 text-sm text-ink-soft lg:flex-row lg:items-center lg:justify-between">
          <p>
            © {site.apertura.getFullYear()}–{anio} {site.nombre}. Gandia.
          </p>

          <ul className="flex flex-wrap items-center gap-x-5 gap-y-1">
            {navegacionLegal.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-ink">
                  {item.etiqueta}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Contenedor>
    </footer>
  )
}
