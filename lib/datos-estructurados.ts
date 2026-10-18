/**
 * Datos estructurados (JSON-LD) del negocio.
 *
 * Es lo que hace que Google entienda que esto es un estudio de yoga en
 * Gandia con una dirección, un horario y un teléfono concretos. Todo sale de
 * los archivos de contenido reales, no se escribe a mano aquí: si cambia el
 * horario, cambia el marcado.
 *
 * OJO · Un detalle que se suele hacer mal: los días con dos tramos (martes y
 * jueves abren a mediodía y por la tarde) necesitan DOS especificaciones.
 * Poner una sola de 12:00 a 19:00 diría que el estudio está abierto a las
 * cinco de la tarde, y no lo está.
 */

import { horario } from "@/content/horario"
import { site } from "@/content/site"
import { bonos, planes } from "@/content/precios"

/** ISO → nombre de día que espera schema.org. */
const DIA_SCHEMA: Record<number, string> = {
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
  7: "Sunday",
}

const URL = "https://yogarituals.es"

export function datosEstructurados() {
  const { calle, codigoPostal, ciudad, provincia, latitud, longitud } =
    site.direccion

  const precios = [
    ...planes.map((plan) => ({
      "@type": "Offer" as const,
      name: `${plan.nombre} al mes`,
      price: plan.mensual,
      priceCurrency: "EUR",
      description: `${plan.para} También en trimestral: ${plan.trimestral} €.`,
    })),
    ...bonos.map((bono) => ({
      "@type": "Offer" as const,
      name: bono.nombre,
      price: bono.precio,
      priceCurrency: "EUR",
      description: bono.nota,
    })),
  ]

  return {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    "@id": `${URL}/#estudio`,
    name: site.nombre,
    description:
      "Estudio de yoga en Gandia. Hatha, Vinyasa, Yoga Nidra, mindfulness, respiración y yoga oncológico, con horarios libres y sin reserva previa.",
    url: `${URL}/`,
    telephone: site.contacto.telefono,
    email: site.contacto.email,
    image: `${URL}/fotos-ejemplo/practica-3.jpg`,
    foundingDate: site.apertura.toISOString().slice(0, 10),
    founder: { "@type": "Person", name: site.fundadora },
    priceRange: "15 € - 70 €",
    currenciesAccepted: "EUR",
    address: {
      "@type": "PostalAddress",
      streetAddress: calle,
      postalCode: codigoPostal,
      addressLocality: ciudad,
      addressRegion: provincia,
      addressCountry: "ES",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: latitud,
      longitude: longitud,
    },
    areaServed: [
      { "@type": "City", name: "Gandia" },
      { "@type": "AdministrativeArea", name: "La Safor" },
    ],
    /* Solo Instagram: Facebook se quitó de los datos de marca y de aquí, para
       que el buscador no siga una ficha que ya no se atiende. */
    sameAs: [site.redes.instagram.url],
    openingHoursSpecification: horario.flatMap((dia) =>
      dia.franjas.map((franja) => ({
        "@type": "OpeningHoursSpecification" as const,
        dayOfWeek: `https://schema.org/${DIA_SCHEMA[dia.iso]}`,
        opens: franja.inicio,
        closes: franja.fin,
      })),
    ),
    makesOffer: precios,
  }
}

/**
 * Se serializa así y no con JSON.stringify a secas porque un `<` dentro del
 * JSON cerraría la etiqueta <script> antes de tiempo.
 */
export function datosEstructuradosComoTexto(): string {
  return JSON.stringify(datosEstructurados()).replace(/</g, "\\u003c")
}
