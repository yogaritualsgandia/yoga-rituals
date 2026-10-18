import {
  Fragment,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react"

/**
 * Entradas.
 *
 * Un envoltorio y un titular. Los dos escriben un atributo y no hacen nada
 * más: quien los lee y los enseña es el proveedor de movimiento, que está
 * mucho más arriba. Por eso estos dos no son componentes de cliente y no
 * mandan ni un byte de JavaScript al navegador.
 *
 * Los dos valores de `cuando` significan cosas distintas:
 *
 *  · `entrada` es para lo que ya se ve al abrir la página. Se anima con una
 *    animación de CSS que arranca sola, sin esperar a ningún archivo, así que
 *    el primer titular entra igual de bien en la conexión más lenta.
 *
 *  · `bloque` es para lo de más abajo. Eso sí se parte escondido y se enseña
 *    al llegar a la pantalla, porque nadie puede verlo antes de tiempo.
 *
 * `retardo` es la posición en la fila: cada pieza espera un poco más que la
 * anterior. Se pasa a mano y no se cuenta solo porque quien decide el orden es
 * quien escribe la página, no el componente.
 */

type Cuando = "entrada" | "bloque" | "escrito"

function posicion(i: number) {
  return { "--i": i } as CSSProperties
}

export function Revelar({
  as: Etiqueta = "div",
  cuando = "bloque",
  retardo = 0,
  className,
  children,
}: {
  as?: ElementType
  cuando?: Cuando
  retardo?: number
  className?: string
  children: ReactNode
}) {
  return (
    <Etiqueta
      data-revelar={cuando}
      /* React no sabe que este elemento va a cambiar, y hay que decírselo.
         Lo de abajo lo explica entero; aquí basta con saber que este atributo
         crece solo, y que quien lo pone es nuestro código. */
      suppressHydrationWarning
      style={posicion(retardo)}
      className={className}
    >
      {children}
    </Etiqueta>
  )
}

/**
 * Titular que entra palabra a palabra.
 *
 * Se pide el texto como cadena y no como hijos a propósito: para repartirlo en
 * palabras hay que tenerlo entero, y con hijos de por medio no se puede sin
 * recorrerlos a ciegas.
 *
 * El nombre accesible se declara completo, aparte. Partir un titular en trozos
 * cambia cómo lo lee un lector de pantalla —unos meten pausas entre trozos y
 * otros lo dicen raro—, y con `aria-label` se lee exactamente igual que si no
 * estuviera partido.
 *
 * `reemplazo` existe por una sola palabra de toda la web: la cifra que cuenta
 * (los talleres que llevamos hechos). Una cifra que cuenta no puede ser una
 * cadena, así que se dice qué palabra se sustituye y por qué. La palabra
 * sustituida ocupa el mismo sitio en la fila que ocupaba el texto —recibe su
 * retardo y su `--i`—, y el `aria-label` sigue diciendo el titular entero, que
 * es justo lo que hace falta: el lector de pantalla lee la cifra de verdad
 * mientras el número visible va subiendo, y no le llega un número a medias.
 * Y como el `aria-label` ya nombra el titular entero, la cifra que cuenta no
 * tiene que esconderse ni repetirse en un `sr-only`.
 */
export function Titular({
  texto,
  reemplazo,
  as: Etiqueta = "h2",
  cuando = "bloque",
  retardo = 0,
  className,
  id,
}: {
  texto: string
  reemplazo?: { palabra: string; por: ReactNode }
  as?: ElementType
  cuando?: Cuando
  retardo?: number
  className?: string
  id?: string
}) {
  const palabras = texto.split(/\s+/).filter(Boolean)

  return (
    <Etiqueta
      id={id}
      data-revelar={cuando}
      aria-label={texto}
      suppressHydrationWarning
      style={posicion(retardo)}
      className={className}
    >
      {palabras.map((palabra, i) => (
        <Fragment key={`${palabra}-${i}`}>
          {i > 0 ? " " : null}
          <span className="palabra" style={posicion(i + retardo)}>
            {reemplazo?.palabra === palabra ? reemplazo.por : palabra}
          </span>
        </Fragment>
      ))}
    </Etiqueta>
  )
}

/**
 * Párrafo que se escribe solo, letra a letra.
 *
 * Es el hermano de `Titular`, y se usa donde el texto aparece de golpe al
 * pulsar algo: las respuestas del acordeón. Ahí una respuesta que entra entera
 * de una vez se lee como un bloque que estaba esperando detrás de la pared;
 * escribiéndose se lee, que es lo que tiene que hacer.
 *
 * El ritmo sale del propio texto, y es la parte que hay que entender: se paga
 * un precio fijo por letra, pero con un tope de tiempo total. Así una respuesta
 * corta se escribe despacio —se ve cada letra— y una larga se escribe más
 * deprisa en vez de tener al lector esperando seis segundos. El mismo número
 * que reparte las letras es el que dice cuánto tarda el panel en desplegarse
 * (`atributoEscritura`), para que el borde de abajo baje a la vez que la
 * línea. Si se cambia uno, hay que cambiar el otro: es una sola decisión.
 *
 * La diferencia con `Titular` no es de gusto. El titular lleva `aria-label`
 * porque hay lectores de pantalla que meten pausas entre los trozos en que se
 * parte un encabezado, y hay que decírselo entero. Aquí no: `aria-label` está
 * prohibido en un párrafo —el papel de párrafo no se puede nombrar—, así que
 * las letras se quedan en línea y se lee del tirón, sin atributo y sin
 * duplicar el texto en un `sr-only`. Lo cuenta entero `styles/movimiento.css`,
 * donde está la animación.
 */

/** Milisegundos por letra, y tope de lo que puede durar la respuesta entera. */
const PASO_POR_LETRA = 20
const TOPE_ESCRITURA = 2400

function contarLetras(texto: string) {
  return Array.from(texto.replace(/\s+/g, "")).length
}

/**
 * Cuánto tarda en escribirse este texto y cada cuánto aparece una letra. Lo
 * usan a la vez el párrafo —para repartir las letras— y la página, que se lo
 * pasa al panel del acordeón en `--escritura`, atado al `style` que devuelve.
 */
export function atributoEscritura(texto: string) {
  const letras = contarLetras(texto)
  const paso = Math.max(
    9,
    Math.min(PASO_POR_LETRA, Math.round(TOPE_ESCRITURA / letras)),
  )

  return {
    paso,
    total: letras * paso,
    /** Para poner en el `style` de quien tenga que durar lo mismo. */
    estilo: { "--escritura": `${letras * paso}ms` } as CSSProperties,
  }
}

export function Parrafo({
  texto,
  cuando = "escrito",
  retardo = 0,
  className,
}: {
  texto: string
  cuando?: Cuando
  retardo?: number
  className?: string
}) {
  const palabras = texto.split(/\s+/).filter(Boolean)
  const { paso } = atributoEscritura(texto)

  /* El contador de letras es del párrafo, no de la palabra: la tercera letra de
     la segunda palabra tiene que entrar después de la última de la primera, o
     el texto se escribiría por columnas. Se reinicia solo en cada render porque
     vive aquí dentro, y el render de un servidor no se repite a medias. */
  let letrasVistas = 0

  return (
    <p
      data-revelar={cuando}
      suppressHydrationWarning
      style={{ ...posicion(retardo), "--paso": `${paso}ms` } as CSSProperties}
      className={className}
    >
      {palabras.map((palabra, i) => (
        <Fragment key={`${palabra}-${i}`}>
          {i > 0 ? " " : null}
          <span className="palabra">
            {Array.from(palabra).map((letra) => {
              const posicionLetra = letrasVistas
              letrasVistas += 1

              return (
                <span
                  className="letra"
                  key={posicionLetra}
                  style={posicion(posicionLetra)}
                >
                  {letra}
                </span>
              )
            })}
          </span>
        </Fragment>
      ))}
    </p>
  )
}
