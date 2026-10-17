/**
 * «Marca tu ritmo».
 *
 * La sección donde la web deja de contar cosas y deja hacer una. Todo lo que
 * dice se entiende sin JavaScript y sin el objeto: los deslizadores son un
 * extra, no la única forma de leerla.
 *
 * El ritmo de arranque —cuatro segundos al inspirar, seis al espirar— es una
 * elección de diseño, no una recomendación del estudio: es un ritmo lento y
 * cómodo, y sirve para que el objeto tenga algo con lo que empezar. Si Susana
 * quiere poner el suyo, se cambia aquí y ya está.
 */

export const respiracion = {
  titular: "Marca tu ritmo",

  entradilla:
    "En esta web la respiración es la unidad con la que se mide todo. El objeto de al lado respira al ritmo que le marques tú.",

  parrafos: [
    "En clase pasa lo mismo: se te propone un ritmo y tú decides si te sirve. No hay una forma correcta de respirar, hay la tuya, y cambia de un día a otro.",
    "Si nunca lo has hecho, empieza por cuatro segundos al inspirar y seis al espirar. Diez segundos por respiración es lento y cómodo, y suele ser un buen punto de partida.",
  ],

  controles: {
    inspirar: "Inspirar",
    espirar: "Espirar",
    segundos: (n: number) => `${n} ${n === 1 ? "segundo" : "segundos"}`,
    ciclo: (total: number) => `Una respiración cada ${total} segundos`,
  },

  /**
   * Lo que se anuncia del lienzo.
   *
   * El objeto no es decoración: dice el ritmo que hay marcado, así que quien
   * no lo ve tiene que poder leerlo. Cambia cada vez que se mueve un
   * deslizador, y por eso es una función y no un texto fijo.
   */
  descripcionObjeto: (inspirar: number, espirar: number) =>
    `Un círculo del color del estudio que se abre al inspirar y se recoge al espirar. ` +
    `Ahora mismo: ${inspirar} segundos al inspirar y ${espirar} al espirar.`,
}
