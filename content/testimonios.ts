/**
 * Lo que dicen quienes ya vinieron.
 *
 * Son reseñas reales de la ficha de Google del estudio, copiadas tal cual: ni
 * se acortan por el medio ni se les corrigen los acentos. Cada una enlaza a su
 * propia reseña —no a la lista—, que es el enlace que se copia desde el diálogo
 * «Compartir reseña» de Google Maps. Si alguien quiere comprobar que dice eso,
 * pulsa su nombre y llega exactamente ahí.
 *
 * La primera es larga de verdad, así que se enseñan los dos primeros párrafos y
 * el resto se lee en Google con «Leer más». Es la única que necesita el corte;
 * las otras tres caben enteras.
 *
 * Van en la portada, entre los talleres y el cierre. Estuvieron en la página de
 * Susana, al lado de su biografía, y ahí no hacían su trabajo: una opinión al
 * lado del relato de quien la recibe se lee con la ceja levantada. En la portada
 * hacen lo que tienen que hacer, que es decirle a quien acaba de llegar que
 * esto ya funciona.
 */

export type Testimonio = {
  /** Un párrafo por elemento, como los escribió quien los firmó. */
  parrafos: string[]
  autor: string
  estrellas: number
  /** La reseña exacta, no la ficha del estudio. */
  url: string
  /** Cuántos párrafos se ven antes del «Leer más». Si falta, se ven todos. */
  visibles?: number
}

export const testimonios: Testimonio[] = [
  {
    parrafos: [
      "Decidí empezar a hacer Yoga con Susana y fue un acierto. Las sensaciones de bienestar, el equilibrio cuerpo/mente son increíbles. Una vez empiezas las clases ves que tu cuerpo está más “ligero”, menos pesado y a partir de ahí notas los resultados en el día a día.",
      "Las clases se adaptan según las necesidades de cada persona y según su “elasticidad”, además nos sigue paso a paso corrigiendo las posturas en las clases.",
      "Al final de la clase, la relajación nos lleva a un nivel profundo y agradable.",
    ],
    autor: "Sergio Gemelli",
    estrellas: 5,
    url: "https://maps.app.goo.gl/WSxTxZgNGVvRpRae9",
    visibles: 2,
  },
  {
    parrafos: [
      "Sin duda las mejores clases de Yoga de Gandia, descubrir las clases de Yoga de Susana ha sido un verdadero regalo. Profesionalidad, dedicación y amor por el yoga, así es Susana. Os invito a probar, os encantará 🙏",
    ],
    autor: "Karly Mas",
    estrellas: 5,
    url: "https://maps.app.goo.gl/Bnwp32sLatU5CC5W7",
  },
  {
    parrafos: [
      "Es una excelente profesora, si no entiendes algo te lo explica detalladamente. No hace falta reservar las clases, lo que me ha salvado de días de estrés. Esto no se encuentra en ningún otro sitio, es perfecto lo recomiendo muchísimo!!!",
    ],
    autor: "Cento",
    estrellas: 5,
    url: "https://maps.app.goo.gl/UAKXKAYLsaaywDnTA",
  },
  {
    parrafos: [
      "Susana es una gran profesional. Me encantan sus clases y siento sus beneficios a nivel mental, físico y emocional. Además, los horarios son flexibles. Recomiendo su Hatha Yoga 100%.",
    ],
    autor: "Ana Carla",
    estrellas: 5,
    url: "https://maps.app.goo.gl/yUiUK9RUaodPFMZ5A",
  },
]
