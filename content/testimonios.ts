/**
 * Lo que dicen quienes ya vinieron.
 *
 * Los tres están copiados de la web actual, con sus nombres y sin recortar. Son
 * suyos y no se tocan: ni los párrafos largos se acortan para que cuadren mejor
 * en la rejilla, ni las faltas de acentos se corrigen.
 *
 * Van en la página de Susana, no en la portada. La portada ya tiene su prueba
 * —los talleres en los colegios— y meter dos pruebas seguidas la convertiría en
 * una web que se vende en vez de una web que explica. Si se quiere aquí, se
 * mueve: es una decisión de dónde, no de si.
 */

export type Testimonio = {
  texto: string
  autor: string
  /** Las estrellas que ya venían puestas con cada opinión. */
  estrellas: number
}

export const testimonios: Testimonio[] = [
  {
    texto:
      "La profesora es muy agradable, hace las clases muy amenas. El lugar es céntrico en Gandía y el ambiente del local es relajante y tranquilo. No pensaba que el yoga fuera tanta gimnasia (pensaba más en posturas y relajación) pero estoy muy contento de los resultados y solo llevo 3 semanas. Tiene muchos horarios sobre todo por las mañanas. Yo contacte con ella por WhatsApp y me solucionó todas las dudas. Para los principiantes tiene infinidad de artículos para tener las posturas más cómodas al principio por lo que no hace falta comprarse nada para empezar. Solo ganas de probar y empezar a ver los resultados. Si te apuntas un trimestre los precios son muy económicos.",
    autor: "Roberto R.",
    estrellas: 5,
  },
  {
    texto:
      "Aquí se practica un Hatha Yoga completo y equilibrado, pero a la vez exigente y que en ocasiones te hace sudar. Un Yoga sin aparatos ni artilugios que sólo a través de las posturas ejercita todo el cuerpo, mejora la flexibilidad y alivia los dolores de espalda. El beneficio se aprecia al instante. Todo ello con una profesora experimentada y en una sala acogedora. Mejor imposible!",
    autor: "Barbara K.",
    estrellas: 5,
  },
  {
    texto:
      "Es verdaderamente especial; centro 100% recomendable. Un refugio de tranquilidad y bienestar que cuenta con horarios flexibles.",
    autor: "Anna J.",
    estrellas: 5,
  },
]
