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

type Cuando = "entrada" | "bloque"

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
 */
export function Titular({
  texto,
  as: Etiqueta = "h2",
  cuando = "bloque",
  retardo = 0,
  className,
  id,
}: {
  texto: string
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
      style={posicion(retardo)}
      className={className}
    >
      {palabras.map((palabra, i) => (
        <Fragment key={`${palabra}-${i}`}>
          {i > 0 ? " " : null}
          <span className="palabra" style={posicion(i + retardo)}>
            {palabra}
          </span>
        </Fragment>
      ))}
    </Etiqueta>
  )
}
