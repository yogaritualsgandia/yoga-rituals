/**
 * Imágenes.
 *
 * Las fotos están ya recortadas y preparadas en tres formatos (AVIF, WebP y
 * JPEG) y dos anchos (800 y 1600 px). La web se exporta como sitio estático, así
 * que no hay optimizador en el servidor: lo que se sirve es exactamente lo que
 * hay en /public/fotos.
 *
 * Cada ficha guarda el ancho y el alto de la versión de 1600 px. El componente
 * `FotoEditorial` los usa para reservar el hueco y evitar saltos de maquetación.
 *
 * Ninguna foto se hace pasar por otra cosa: el texto alternativo describe lo que
 * se ve. Las que vienen de Pexels llevan su origen; las del archivo de Susana,
 * también. El detalle de licencias está en CREDITOS-FOTOS.md.
 */

export type Fotografia = {
  /** Ruta base dentro de /public, sin el sufijo -800/-1600 ni la extensión. */
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
  heroPractica: {
    src: "/fotos/hero-practica",
    alt: "Mujer en la postura del niño sobre una esterilla, con los brazos estirados hacia delante y la cabeza apoyada en el suelo.",
    ancho: 1600,
    alto: 2000,
    origen: "Pexels · Miriam Alonso.",
    definitiva: true,
  },
  talleresAula: {
    src: "/fotos/talleres-aula",
    alt: "Grupo de estudiantes sentados en esterillas durante un taller de yoga en un aula, con la profesora al frente.",
    ancho: 1600,
    alto: 1067,
    origen: "Archivo de YOGA Rituals.",
    definitiva: true,
  },
  hathaSentada: {
    src: "/fotos/hatha-sentada",
    alt: "Mujer sentada sobre los talones, con las manos unidas frente al pecho y los ojos cerrados.",
    ancho: 1600,
    alto: 2000,
    origen: "Pexels · Polina Tankilevitch.",
    definitiva: true,
  },
  vinyasaRueda: {
    src: "/fotos/vinyasa-rueda",
    alt: "Mujer en una postura de extensión de espalda, apoyada sobre una mano y un pie, con el otro brazo extendido hacia atrás.",
    ancho: 1600,
    alto: 1600,
    origen: "Archivo de YOGA Rituals.",
    definitiva: true,
  },
  breathworkIncienso: {
    src: "/fotos/breathwork-incienso",
    alt: "Barrita de incienso encendida en un soporte de madera, con el humo subiendo recto.",
    ancho: 1600,
    alto: 2000,
    origen: "Archivo de YOGA Rituals.",
    definitiva: true,
  },
  sobreMiCuenco: {
    src: "/fotos/sobre-mi-cuenco",
    alt: "Dos cuencos tibetanos y un ramo de lavanda seca sobre una tela bordada.",
    ancho: 1600,
    alto: 2000,
    origen: "Archivo de YOGA Rituals.",
    definitiva: true,
  },
  mindfulnessBuda: {
    src: "/fotos/mindfulness-buda",
    alt: "Detalle de una escultura de Buda con pátina verde y dorada.",
    ancho: 1600,
    alto: 2000,
    origen: "Archivo de YOGA Rituals.",
    definitiva: true,
  },
  nidraPiernas: {
    src: "/fotos/nidra-piernas",
    alt: "Dos personas tumbadas boca arriba con las piernas apoyadas sobre bolsters.",
    ancho: 1600,
    alto: 2000,
    origen: "Archivo de YOGA Rituals.",
    definitiva: true,
  },
  oncoRestaurativo: {
    src: "/fotos/onco-restaurativo",
    alt: "Mujer tumbada boca arriba sobre una esterilla, con la espalda apoyada en un bolster y los brazos abiertos.",
    ancho: 1600,
    alto: 1067,
    origen: "Archivo de YOGA Rituals.",
    definitiva: true,
  },
  retiroZarra: {
    src: "/fotos/retiro-zarra",
    alt: "Vista de un pueblo de montaña, con una calle y casas de piedra.",
    ancho: 1600,
    alto: 2000,
    origen: "Archivo de YOGA Rituals.",
    definitiva: true,
  },
  clasesGrupo: {
    src: "/fotos/clases-grupo",
    alt: "Grupo de personas practicando yoga en una sala con suelo de madera.",
    ancho: 1600,
    alto: 1067,
    origen: "Archivo de YOGA Rituals.",
    definitiva: true,
  },
  horariosMaterial: {
    src: "/fotos/horarios-material",
    alt: "Dos bloques de corcho y una esterilla verde gris sobre un suelo de madera.",
    ancho: 1600,
    alto: 700,
    origen: "Archivo de YOGA Rituals.",
    definitiva: true,
  },
  preciosEsterilla: {
    src: "/fotos/precios-esterilla",
    alt: "Manos apoyadas en una esterilla negra, junto a una esterilla verde enrollada.",
    ancho: 1600,
    alto: 700,
    origen: "Pexels · Mikhail Nilov.",
    definitiva: true,
  },
  primeraVezMaterial: {
    src: "/fotos/primera-vez-material",
    alt: "Mujer con las manos unidas por encima de la cabeza en una sala con bloques y mantas de yoga.",
    ancho: 1600,
    alto: 1067,
    origen: "Pexels · Yankrukov.",
    definitiva: true,
  },
} satisfies Record<string, Fotografia>
