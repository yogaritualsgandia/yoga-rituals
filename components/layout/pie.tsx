import { Mail, MapPin, Phone } from "lucide-react"
import Link from "next/link"

import {
  atribucion,
  navegacionLegal,
  navegacionPie,
  site,
  whatsappUrl,
} from "@/content/site"

import { BotonPausa } from "@/components/movimiento/boton-pausa"

import { BotonTema } from "./boton-tema"
import { Contenedor } from "./contenedor"
import { EnlaceNav } from "./enlace-nav"
import { Marca } from "./marca"

/**
 * Pie.
 *
 * En tres franjas, de arriba abajo: quién es y cómo se le contacta, por dónde
 * se navega, y lo legal. Así el bloque de contacto —que es lo que de verdad
 * viene a buscar quien llega al pie— no compite con trece enlaces.
 *
 * Aquí vive el SEO local: la dirección completa como texto, en un <address>
 * de verdad, con el nombre del estudio y la ciudad. Es lo que leen Google y
 * quien busca «yoga en Gandia».
 *
 * Y aquí vive la atribución de Skiper UI, que es obligatoria al usar su
 * versión gratuita. No se quita.
 */
export function Pie() {
  const anio = new Date().getFullYear()
  const { calle, codigoPostal, ciudad, provincia } = site.direccion

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

          <address className="flex flex-col gap-3 not-italic md:col-span-4 lg:col-span-4 lg:col-start-6">
            <span className="flex items-start gap-2.5">
              <MapPin
                aria-hidden="true"
                className="mt-1 size-4 shrink-0 text-ink-soft"
              />
              <span>
                {calle}
                <br />
                {codigoPostal} {ciudad} ({provincia})
              </span>
            </span>

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
                  href={site.redes.facebook.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center hover:text-brand"
                >
                  Facebook
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

        <nav
          aria-label="Navegación del pie"
          className="mt-14 grid grid-cols-1 gap-10 border-t border-line pt-12 sm:grid-cols-3"
        >
          {navegacionPie.map((grupo) => (
            <div key={grupo.titulo}>
              <h2 className="etiqueta">{grupo.titulo}</h2>
              <ul className="mt-4 flex flex-col gap-1">
                {grupo.enlaces.map((enlace) => (
                  <li key={enlace.href} className="flex">
                    <EnlaceNav
                      href={enlace.href}
                      className="inline-flex min-h-11 items-center"
                    >
                      {enlace.etiqueta}
                    </EnlaceNav>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

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
            <li>
              <a
                href={atribucion.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ink"
              >
                {atribucion.texto}
              </a>
            </li>
          </ul>
        </div>
      </Contenedor>
    </footer>
  )
}
