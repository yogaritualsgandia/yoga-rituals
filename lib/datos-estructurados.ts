/**
 * Datos estructurados (JSON-LD).
 *
 * Hay dos capas y conviene no mezclarlas:
 *
 *  1. `datosEstructurados()` describe el negocio y el sitio una sola vez. Se
 *     inyecta en el layout y vale para todas las páginas: quién es el estudio,
 *     dónde está, cuándo abre, cuánto cuesta y quién lo dirige.
 *  2. `datosDePagina()` describe la página concreta y se inyecta desde cada
 *     página: qué URL es, qué tipo tiene, de qué habla y dónde encaja dentro
 *     del sitio.
 *
 * Todo sale de los archivos de contenido reales. Nada de direcciones,
 * horarios, precios ni formaciones escritas a mano aquí: si cambia el dato,
 * cambia el marcado.
 *
 * OJO · Los días con dos tramos (martes y jueves abren a mediodía y por la
 * tarde) necesitan DOS especificaciones. Poner una sola de 12:00 a 19:00 diría
 * que el estudio está abierto a las cinco de la tarde, y no lo está.
 */

import type { Pregunta } from "@/content/faqs"
import { horario } from "@/content/horario"
import {
  bonos,
  formasDePago,
  planes,
  practicas,
  site,
} from "@/content/negocio"

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

const URL = site.url

export const ID_ESTUDIO = `${URL}/#estudio`
export const ID_WEB = `${URL}/#web`
export const ID_PERSONA = `${URL}/#susana`

const DESCRIPCION_ESTUDIO =
  "Estudio de yoga en el centro de Gandia. Hatha, Vinyasa, Yoga Nidra, mindfulness, breathwork y yoga oncológico, con horario libre y sin reserva previa."

/**
 * El grafo global: negocio, sitio y persona.
 *
 * Se usa `@graph` en vez de tres etiquetas sueltas para que las entidades se
 * puedan referenciar por `@id` entre ellas. Así el buscador entiende que la
 * persona que fundó el negocio es la misma que firma la página de «Sobre mí»,
 * sin repetir sus datos en cada sitio.
 */
export function datosEstructurados() {
  const { calle, piso, codigoPostal, ciudad, provincia, latitud, longitud } =
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
    "@graph": [
      {
        "@type": "HealthAndBeautyBusiness",
        "@id": ID_ESTUDIO,
        name: site.nombre,
        description: DESCRIPCION_ESTUDIO,
        url: `${URL}/`,
        telephone: site.contacto.telefono,
        email: site.contacto.email,
        image: {
          "@type": "ImageObject",
          url: `${URL}/fotos/clases-grupo-1600.jpg`,
          width: 1600,
          height: 1067,
        },
        logo: {
          "@type": "ImageObject",
          url: `${URL}/icon.png`,
          width: 512,
          height: 512,
        },
        foundingDate: site.apertura.toISOString().slice(0, 10),
        founder: { "@id": ID_PERSONA },
        slogan: site.lema,
        /* Del precio suelto más barato al trimestre más caro. Los planes
           mensuales y los bonos están visibles en /precios. */
        priceRange: "15 € - 195 €",
        currenciesAccepted: "EUR",
        paymentAccepted: formasDePago.formas.replace(/\.$/, ""),
        knowsLanguage: ["es", "ca"],
        address: {
          "@type": "PostalAddress",
          streetAddress: `${calle}, ${piso}`,
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
        hasMap: site.fichaGoogle,
        areaServed: [
          { "@type": "City", name: "Gandia" },
          { "@type": "AdministrativeArea", name: "La Safor" },
        ],
        /* Solo dos perfiles: Instagram y la ficha de Google. Facebook se quitó
           de los datos de marca y de aquí, para que el buscador no siga una
           ficha que ya no se atiende. */
        sameAs: [site.redes.instagram.url, site.fichaGoogle],
        openingHoursSpecification: horario.flatMap((dia) =>
          dia.franjas.map((franja) => ({
            "@type": "OpeningHoursSpecification" as const,
            dayOfWeek: `https://schema.org/${DIA_SCHEMA[dia.iso]}`,
            opens: franja.inicio,
            closes: franja.fin,
          }))
        ),
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: site.contacto.telefono,
            email: site.contacto.email,
            contactType: "customer service",
            availableLanguage: ["es", "ca"],
          },
        ],
        makesOffer: precios,
        /* Las prácticas no tienen un precio distinto cada una: se paga por
           número de clases. Por eso el catálogo describe servicios reales, sin
           inventar una tarifa por estilo. */
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Clases y sesiones de yoga",
          itemListElement: practicas.map((practica) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: practica.nombre,
              description: practica.entradilla,
              provider: { "@id": ID_ESTUDIO },
              areaServed: { "@type": "City", name: "Gandia" },
            },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": ID_WEB,
        url: `${URL}/`,
        name: site.nombre,
        description: DESCRIPCION_ESTUDIO,
        inLanguage: "es-ES",
        publisher: { "@id": ID_ESTUDIO },
      },
      {
        "@type": "Person",
        "@id": ID_PERSONA,
        name: site.fundadora,
        jobTitle: site.rol,
        url: `${URL}/sobre-mi`,
        worksFor: { "@id": ID_ESTUDIO },
        /* Lo que dice su formación real, ni una especialidad más. */
        knowsAbout: [
          "Hatha yoga",
          "Vinyasa yoga",
          "Yoga restaurativo",
          "Yoga Nidra",
          "Mindfulness",
          "Yoga oncológico",
          "Breathwork",
        ],
        alumniOf: {
          "@type": "EducationalOrganization",
          name: "AIPYS Madrid",
        },
      },
    ],
  }
}

export type TipoPagina =
  "WebPage" | "CollectionPage" | "AboutPage" | "ContactPage" | "FAQPage"

/**
 * Las migas de cada página.
 *
 * Solo hay un nivel de profundidad real: las prácticas cuelgan de /clases.
 * No se pinta una miga visible porque el sitio es plano y ya tiene su
 * antetítulo editorial; lo que sí se publica es el `BreadcrumbList`, que es
 * donde el buscador lo lee.
 */
const MIGAS: Record<string, { nombre: string; ruta: string }[]> = {
  "/clases": [{ nombre: "Clases", ruta: "/clases" }],
  "/hatha": [
    { nombre: "Clases", ruta: "/clases" },
    { nombre: "Hatha", ruta: "/hatha" },
  ],
  "/vinyasa": [
    { nombre: "Clases", ruta: "/clases" },
    { nombre: "Vinyasa", ruta: "/vinyasa" },
  ],
  "/mindfulness": [
    { nombre: "Clases", ruta: "/clases" },
    { nombre: "Mindfulness", ruta: "/mindfulness" },
  ],
  "/yoga-nidra": [
    { nombre: "Clases", ruta: "/clases" },
    { nombre: "Yoga Nidra", ruta: "/yoga-nidra" },
  ],
  "/breathwork": [
    { nombre: "Clases", ruta: "/clases" },
    { nombre: "Breathwork", ruta: "/breathwork" },
  ],
  "/yoga-oncologico": [
    { nombre: "Clases", ruta: "/clases" },
    { nombre: "Yoga oncológico", ruta: "/yoga-oncologico" },
  ],
  "/retiros": [
    { nombre: "Clases", ruta: "/clases" },
    { nombre: "Retiros", ruta: "/retiros" },
  ],
  "/talleres-centros-educativos": [
    { nombre: "Clases", ruta: "/clases" },
    { nombre: "Talleres", ruta: "/talleres-centros-educativos" },
  ],
  "/horarios": [{ nombre: "Horarios", ruta: "/horarios" }],
  "/precios": [{ nombre: "Precios", ruta: "/precios" }],
  "/primera-vez": [{ nombre: "Primera vez", ruta: "/primera-vez" }],
  "/sobre-mi": [{ nombre: "Sobre mí", ruta: "/sobre-mi" }],
  "/contacto": [{ nombre: "Contacto", ruta: "/contacto" }],
}

/**
 * El marcado de una página concreta.
 *
 * `descripcion` puede ser la entradilla visible: no tiene que coincidir letra
 * por letra con la meta description, pero sí decir lo mismo.
 */
export function datosDePagina({
  ruta,
  titulo,
  descripcion,
  tipo = "WebPage",
  preguntas,
}: {
  ruta: string
  titulo: string
  descripcion: string
  tipo?: TipoPagina
  /** Solo en /primera-vez: las mismas preguntas que se ven en el acordeón. */
  preguntas?: readonly Pregunta[]
}) {
  const url = ruta === "/" ? `${URL}/` : `${URL}${ruta}`
  const migas = [{ nombre: "Inicio", ruta: "/" }, ...(MIGAS[ruta] ?? [])]

  const pagina: Record<string, unknown> = {
    "@type": tipo,
    "@id": `${url}#pagina`,
    url,
    name: titulo,
    description: descripcion,
    isPartOf: { "@id": ID_WEB },
    about: { "@id": ID_ESTUDIO },
    inLanguage: "es-ES",
  }

  if (tipo === "AboutPage") {
    pagina.mainEntity = { "@id": ID_PERSONA }
  }

  if (tipo === "ContactPage") {
    pagina.mainEntity = { "@id": ID_ESTUDIO }
  }

  const entidadesFaq = preguntas?.length
    ? preguntas.map((pregunta) => ({
        "@type": "Question",
        name: pregunta.pregunta,
        acceptedAnswer: {
          "@type": "Answer",
          text: pregunta.respuesta,
        },
      }))
    : null

  if (tipo === "FAQPage" && entidadesFaq) {
    pagina.mainEntity = entidadesFaq
  }

  const grafo: Record<string, unknown>[] = [pagina]

  /* Una página puede ser WebPage o CollectionPage y, además, tener un bloque
     visible de preguntas. En ese caso el FAQPage va como entidad aparte, con su
     propio @id, en vez de falsear el tipo de la página. */
  if (tipo !== "FAQPage" && entidadesFaq) {
    grafo.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      url,
      name: `Preguntas frecuentes · ${titulo}`,
      isPartOf: { "@id": ID_WEB },
      about: { "@id": ID_ESTUDIO },
      inLanguage: "es-ES",
      mainEntity: entidadesFaq,
    })
  }

  if (migas.length > 1) {
    grafo.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#migas`,
      itemListElement: migas.map((miga, indice) => ({
        "@type": "ListItem",
        position: indice + 1,
        name: miga.nombre,
        item: miga.ruta === "/" ? `${URL}/` : `${URL}${miga.ruta}`,
      })),
    })
  }

  return {
    "@context": "https://schema.org",
    "@graph": grafo,
  }
}

/**
 * Se serializa así y no con JSON.stringify a secas porque un `<` dentro del
 * JSON cerraría la etiqueta <script> antes de tiempo.
 */
export function datosEstructuradosComoTexto(): string {
  return JSON.stringify(datosEstructurados()).replace(/</g, "\\u003c")
}
