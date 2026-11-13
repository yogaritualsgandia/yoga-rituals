import type { Metadata } from "next"
import Link from "next/link"
import { AtSign, Mail, MapPin, MessageCircle, Phone } from "lucide-react"

import { BotonEnlace } from "@/components/layout/boton-enlace"
import { Contenedor } from "@/components/layout/contenedor"
import { Pagina } from "@/components/layout/pagina"
import { horario } from "@/content/horario"
import { mapaUrl, site, whatsappUrl } from "@/content/site"
import { metadatosDePagina } from "@/lib/metadatos"

export const metadata: Metadata = metadatosDePagina({
  titulo: "Contacto y cómo llegar",
  descripcion:
    "Contacto de YOGA Rituals: C/ Sant Francesc de Borja, 36, 1º, Gandia. Teléfono, WhatsApp, correo, horario y mapa para llegar al estudio.",
  ruta: "/contacto",
})

/**
 * Contacto.
 *
 * El pie ya lleva la dirección y el teléfono, y por eso esta página no repite
 * un formulario que no existe: lo que añade es lo que allí no cabe. El horario
 * completo, un mapa para llegar y las tres vías reales de contacto, en el
 * mismo orden en el que se preguntan.
 *
 * El mapa es de OpenStreetMap y no de Google a propósito: se carga sin cookies
 * de terceros y sin pedir permiso, que es lo mismo que hace el resto de la web
 * con la analítica. Quien quiera la ficha de Google tiene el enlace justo
 * debajo.
 *
 * No hay horario de atención telefónica, y se dice: se puede llamar a
 * cualquier hora. El horario que se publica es el de clases, que es el único
 * que existe.
 */
export default function PaginaContacto() {
  const { calle, piso, codigoPostal, ciudad, provincia, latitud, longitud } =
    site.direccion

  const margen = 0.006
  const mapaIncrustado = `https://www.openstreetmap.org/export/embed.html?bbox=${longitud - margen}%2C${latitud - margen / 1.5}%2C${longitud + margen}%2C${latitud + margen / 1.5}&layer=mapnik&marker=${latitud}%2C${longitud}`
  const mapaAbierto = `https://www.openstreetmap.org/?mlat=${latitud}&mlon=${longitud}#map=18/${latitud}/${longitud}`

  return (
    <Pagina
      etiqueta="Contacto"
      titulo="Contacto y cómo llegar"
      entradilla="Estamos en el centro de Gandia. Aquí tienes la dirección, el horario y las formas de escribirnos."
      ruta="/contacto"
      tipo="ContactPage"
    >
      {/* ── Los datos, en el orden en el que se buscan ────────────────────── */}
      <section className="seccion pt-0">
        <Contenedor className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <h2 className="font-heading text-2xl">El estudio</h2>

            <address className="mt-6 flex flex-col gap-4 not-italic">
              <p className="flex items-start gap-3">
                <MapPin
                  aria-hidden="true"
                  className="mt-1 size-4 shrink-0 text-ink-soft"
                />
                <span>
                  <span className="block font-semibold">{site.nombre}</span>
                  {calle}, {piso}
                  <br />
                  {codigoPostal} {ciudad} ({provincia})
                </span>
              </p>

              <a
                href={`tel:${site.contacto.telefono}`}
                className="flex min-h-11 items-center gap-3 hover:text-brand"
              >
                <Phone
                  aria-hidden="true"
                  className="size-4 shrink-0 text-ink-soft"
                />
                {site.contacto.telefonoVisible}
              </a>

              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 items-center gap-3 hover:text-brand"
              >
                <MessageCircle
                  aria-hidden="true"
                  className="size-4 shrink-0 text-ink-soft"
                />
                WhatsApp
              </a>

              <a
                href={`mailto:${site.contacto.email}`}
                className="flex min-h-11 min-w-0 items-center gap-3 hover:text-brand"
              >
                <Mail
                  aria-hidden="true"
                  className="size-4 shrink-0 text-ink-soft"
                />
                <span className="break-all">{site.contacto.email}</span>
              </a>

              <a
                href={site.redes.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 items-center gap-3 hover:text-brand"
              >
                <AtSign
                  aria-hidden="true"
                  className="size-4 shrink-0 text-ink-soft"
                />
                @{site.redes.instagram.usuario}
              </a>
            </address>

            <p className="paso-pequeno medida mt-6 text-ink-soft">
              Puedes llamar cuando quieras: no hay un horario de atención
              telefónica. Si no contesta, escribe por WhatsApp.
            </p>

            <p className="paso-pequeno medida mt-6 text-ink-soft">
              El portal está a pie de calle y el estudio, en el primer piso. La
              primera clase de prueba se reserva por WhatsApp; para las demás
              no hace falta avisar.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <BotonEnlace href={whatsappUrl()} externo>
                Escribir por WhatsApp
              </BotonEnlace>
              <BotonEnlace href={mapaUrl} externo variante="outline">
                Abrir en Google Maps
              </BotonEnlace>
            </div>
          </div>

          {/* ── El horario ────────────────────────────────────────────────── */}
          <div className="lg:col-span-6 lg:col-start-7">
            <h2 className="font-heading text-2xl">Horario de clases</h2>

            <table className="mt-6 w-full border-collapse text-left">
              <caption className="sr-only">
                Horario semanal de YOGA Rituals en Gandia
              </caption>

              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="etiqueta py-3 pr-4 font-normal">
                    Día
                  </th>
                  <th scope="col" className="etiqueta py-3 font-normal">
                    Horas
                  </th>
                </tr>
              </thead>

              <tbody>
                {horario.map((dia) => (
                  <tr key={dia.dia} className="border-b border-line align-top">
                    <th
                      scope="row"
                      className="py-4 pr-4 font-heading text-lg font-normal"
                    >
                      {dia.dia}
                    </th>
                    <td className="py-4">
                      {dia.franjas.length === 0 ? (
                        <span className="text-ink-soft">Cerrado</span>
                      ) : (
                        <ul className="flex flex-col gap-1.5">
                          {dia.franjas.map((franja) => (
                            <li
                              key={franja.inicio}
                              className="tabular-nums"
                            >
                              {franja.inicio}–{franja.fin}
                              {franja.expres ? (
                                <span className="paso-pequeno text-ink-soft">
                                  {" "}
                                  · exprés
                                </span>
                              ) : null}
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="paso-pequeno mt-5 text-ink-soft">
              El horario completo, con la duración de cada franja, está en{" "}
              <Link
                href="/horarios"
                className="font-semibold text-brand underline underline-offset-4 hover:text-brand-hover"
              >
                la página de horarios
              </Link>
              .
            </p>
          </div>
        </Contenedor>
      </section>

      {/* ── El mapa ───────────────────────────────────────────────────────── */}
      <section className="seccion pt-0">
        <Contenedor>
          <h2 className="font-heading text-2xl">Cómo llegar</h2>
          <p className="paso-base medida mt-4 text-ink-soft">
            En el centro de Gandia, en la calle Sant Francesc de Borja. El mapa
            te deja en la puerta; si vienes desde fuera, puedes abrirlo en
            Google Maps y trazar la ruta.
          </p>

          <div className="mt-8 overflow-hidden rounded-lg border border-line">
            <iframe
              title="Mapa de YOGA Rituals en Gandia"
              src={mapaIncrustado}
              className="h-[420px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <p className="paso-base medida mt-6 text-ink-soft">
            Si vienes en coche, el parking público más cercano es{" "}
            <strong>Parking Colón</strong> (C/ Alzira, 26), a unos 230 m.
            También está <strong>Parking Plaza del Prado</strong>, a unos 350 m.
            Los dos son de pago y subterráneos.
          </p>

          <p className="paso-pequeno mt-4 text-ink-soft">
            Mapa de{" "}
            <a
              href={mapaAbierto}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand underline underline-offset-4 hover:text-brand-hover"
            >
              OpenStreetMap
            </a>
            . No carga cookies de terceros.
          </p>
        </Contenedor>
      </section>
    </Pagina>
  )
}
