/**
 * Imágenes.
 *
 * ESTADO: todas provisionales. Susana ha pedido fotos de ejemplo mientras
 * no manda las suyas, así que aquí se usan las que ya había en su web
 * actual (y una de Pexels que ella misma tenía puesta), descargadas a
 * /public/fotos-ejemplo.
 *
 * Cada ficha lleva `origen` para saber de dónde sale y `definitiva` para
 * saber qué hay que sustituir. NINGUNA se hace pasar por el estudio: los
 * textos alternativos describen lo que se ve de verdad en la foto, no lo
 * que nos gustaría que se viera.
 *
 * Las que hay que pedirle a Susana, por orden de importancia:
 *   1. La sala de Gandia, vacía y con gente (es lo que nadie más puede enseñar).
 *   2. Ella dando clase.
 *   3. La entrada y la fachada, para el SEO local.
 *   4. Material y detalles: incienso, mantas, bloques.
 */

export type Fotografia = {
  /** Ruta dentro de /public. */
  src: string
  /** Descripción real de lo que se ve. Nunca «imagen de yoga». */
  alt: string
  ancho: number
  alto: number
  /** De dónde sale, para poder sustituirla sin dudar. */
  origen: string
  /** false = hay que cambiarla antes de publicar. */
  definitiva: boolean
  /** Pie de foto, si la sección lo pinta. */
  pie?: string
}

export const fotos = {
  sirsasana: {
    src: "/fotos-ejemplo/hero-sala.jpg",
    alt: "Persona haciendo el pino sobre una esterilla oscura, con un valle de montaña entre la niebla al fondo.",
    ancho: 1401,
    alto: 350,
    origen: "Foto de la web actual (yogarituals.es), recortada en panorámico.",
    definitiva: false,
    pie: "Sustituir por la sala de Gandia o por Susana dando clase.",
  },
  esterilla: {
    src: "/fotos-ejemplo/practica-1.jpg",
    alt: "Pies descalzos y manos enrollando una esterilla de yoga verde oscura sobre un suelo de madera clara.",
    ancho: 1584,
    alto: 1064,
    origen: "Pexels, ya publicada en la web actual. Es la única que no es suya.",
    definitiva: false,
  },
  incienso: {
    src: "/fotos-ejemplo/practica-2.jpg",
    alt: "Una barrita de incienso encendida en un soporte de madera; el humo sube recto sobre una mesa clara con hierbas secas alrededor.",
    ancho: 1080,
    alto: 1620,
    origen: "Foto de la web actual. Retrato vertical.",
    definitiva: false,
  },
  flexionSentado: {
    src: "/fotos-ejemplo/practica-3.jpg",
    alt: "Mujer doblada hacia delante sentada sobre una esterilla, con la cabeza apoyada en las rodillas, en una sala de suelo de madera clara.",
    ancho: 1239,
    alto: 798,
    origen: "Foto de la web actual.",
    definitiva: false,
  },
  material: {
    src: "/fotos-ejemplo/material.jpg",
    alt: "Dos bloques de corcho apoyados uno sobre otro encima de una esterilla verde gris, sobre un suelo de madera.",
    ancho: 1584,
    alto: 1064,
    origen: "Foto de la web actual.",
    definitiva: false,
    pie: "El material lo pone el estudio: bloques, mantas, banquitos y bolsters.",
  },
  esterillaNaranja: {
    src: "/fotos-ejemplo/esterilla.jpg",
    alt: "Manos con pulseras sosteniendo una esterilla naranja enrollada.",
    ancho: 613,
    alto: 649,
    origen: "Foto de la web actual.",
    definitiva: false,
  },
} satisfies Record<string, Fotografia>

/** Aviso que se pinta junto a las imágenes mientras sean de ejemplo. */
export const avisoFotosProvisionales =
  "Fotos de ejemplo. Se sustituirán por las del estudio de Gandia."
