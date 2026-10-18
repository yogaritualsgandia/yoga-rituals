/**
 * Lo que dicen quienes ya vinieron.
 *
 * Los tres están copiados de la web actual, con sus nombres y sin recortar. Son
 * suyos y no se tocan: ni los párrafos largos se acortan para que cuadren mejor
 * en la rejilla, ni las faltas de acentos se corrigen.
 *
 * Van en la portada, entre los talleres y el cierre. Estuvieron en la página de
 * Susana, al lado de su biografía, y ahí no hacían su trabajo: una opinión al
 * lado del relato de quien la recibe se lee con la ceja levantada. En la portada
 * hacen lo que tienen que hacer, que es decirle a quien acaba de llegar que
 * esto ya funciona.
 */

import { mapaUrl } from "./site"

export type Testimonio = {
  texto: string
  autor: string
  /** Las estrellas que ya venían puestas con cada opinión. */
  estrellas: number
  /**
   * Dónde está publicada la opinión.
   *
   * [PENDIENTE: la dirección de cada reseña, una por una]. Las tres están en la
   * ficha de Google del estudio, y hoy las tres apuntan ahí: es donde se pueden
   * leer enteras, con su autor y su estrellas, que es de lo que se trata. Para
   * llevar a la reseña exacta hace falta el enlace de cada una, y ese no se
   * puede adivinar: se copia de Google. El día que llegue, se cambia aquí y los
   * nombres dejan de llevar todos al mismo sitio.
   */
  url: string
}

const FICHA_DE_GOOGLE = mapaUrl

export const testimonios: Testimonio[] = [
  {
    texto:
      "La profesora es muy agradable, hace las clases muy amenas. El lugar es céntrico en Gandía y el ambiente del local es relajante y tranquilo. No pensaba que el yoga fuera tanta gimnasia (pensaba más en posturas y relajación) pero estoy muy contento de los resultados y solo llevo 3 semanas. Tiene muchos horarios sobre todo por las mañanas. Yo contacte con ella por WhatsApp y me solucionó todas las dudas. Para los principiantes tiene infinidad de artículos para tener las posturas más cómodas al principio por lo que no hace falta comprarse nada para empezar. Solo ganas de probar y empezar a ver los resultados. Si te apuntas un trimestre los precios son muy económicos.",
    autor: "Roberto R.",
    estrellas: 5,
    url: FICHA_DE_GOOGLE,
  },
  {
    texto:
      "Aquí se practica un Hatha Yoga completo y equilibrado, pero a la vez exigente y que en ocasiones te hace sudar. Un Yoga sin aparatos ni artilugios que sólo a través de las posturas ejercita todo el cuerpo, mejora la flexibilidad y alivia los dolores de espalda. El beneficio se aprecia al instante. Todo ello con una profesora experimentada y en una sala acogedora. Mejor imposible!",
    autor: "Barbara K.",
    estrellas: 5,
    url: FICHA_DE_GOOGLE,
  },
  {
    texto:
      "Es verdaderamente especial; centro 100% recomendable. Un refugio de tranquilidad y bienestar que cuenta con horarios flexibles.",
    autor: "Anna J.",
    estrellas: 5,
    url: FICHA_DE_GOOGLE,
  },
]
