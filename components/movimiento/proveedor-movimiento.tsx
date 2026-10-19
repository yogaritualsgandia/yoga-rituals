"use client"

import { usePathname } from "next/navigation"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react"

import type Lenis from "lenis"

/**
 * El que mueve la web.
 *
 * Hace tres cosas, y las tres tienen que ver con no molestar:
 *
 *  1. Suaviza la rueda del ratón con Lenis. Solo la rueda: en un móvil el
 *     desplazamiento nativo es mejor que cualquier suavizado, y así tampoco
 *     se pelea con la barra del navegador, que aparece y desaparece.
 *
 *  2. Enseña lo que estaba escondido cuando llega a la pantalla, con GSAP y
 *     ScrollTrigger.
 *
 *  3. Deja pararlo todo. Y si el navegador ya ha pedido menos movimiento no
 *     carga ni una cosa ni la otra: son unos 60 KB que no se van a usar.
 *
 * Lenis y GSAP entran con `import()`, así que no están en el paquete inicial.
 * Hasta que llegan, la página se ve entera y se puede usar: lo que falta es el
 * suavizado y las entradas de más abajo, nada más.
 */

type Estado = {
  /** Alguien ha pedido que pare todo. */
  pausado: boolean
  alternar: () => void
  /** Este navegador admite movimiento: no ha pedido menos. */
  conMovimiento: boolean
  /** Sube la página al principio, con el suavizado de la casa. */
  subirArriba: () => void
}

const Contexto = createContext<Estado | null>(null)

export function useMovimiento() {
  const estado = useContext(Contexto)

  if (!estado) {
    throw new Error(
      "useMovimiento() solo funciona dentro de <ProveedorMovimiento>",
    )
  }

  return estado
}

const CONSULTA = "(prefers-reduced-motion: reduce)"

function suscribir(avisar: () => void) {
  const consulta = window.matchMedia(CONSULTA)
  consulta.addEventListener("change", avisar)
  return () => consulta.removeEventListener("change", avisar)
}

const leer = () => window.matchMedia(CONSULTA).matches

/* En el servidor no se puede saber qué ha pedido el navegador, así que se
   supone que no ha pedido nada —que es lo que vale para casi todo el mundo— y
   el cliente lo corrige al hidratar, sin avisar de ninguna diferencia. */
const enElServidor = () => false

/**
 * Lo que se usa de ScrollTrigger, escrito a mano.
 *
 * Escribirlo aquí y no importarlo evita que el paquete entero entre en el
 * primer trozo de JavaScript por culpa de un tipo. El `as` de más abajo es
 * solo el precio de eso.
 */
type MotorScroll = {
  create: (config: {
    trigger: Element
    start: string
    once: boolean
    onEnter: () => void
    onEnterBack: () => void
  }) => { kill: () => void }
  refresh: () => void
  killAll: () => void
}

/**
 * La parte de Lenis que hace falta para parar sin romper nada.
 *
 * El tipo del paquete solo declara como modificables unas pocas opciones
 * —duración, curva, prevención—, pero en tiempo de ejecución el objeto las
 * lleva todas, y `smoothWheel` se lee de ahí en cada rueda
 * (`node_modules/lenis/dist/lenis.mjs`). El `as` de más abajo es solo el
 * precio de que el tipo no lo diga.
 */
type OpcionesDeLenis = { options: { smoothWheel?: boolean } }

export function ProveedorMovimiento({ children }: { children: ReactNode }) {
  const ruta = usePathname()

  const menosMovimiento = useSyncExternalStore(suscribir, leer, enElServidor)
  const conMovimiento = !menosMovimiento

  const [pausado, setPausado] = useState(false)
  const [listo, setListo] = useState(false)

  const lenis = useRef<Lenis | null>(null)
  const motor = useRef<MotorScroll | null>(null)
  const disparadores = useRef<{ kill: () => void }[]>([])

  useEffect(() => {
    if (!conMovimiento) return

    let vivo = true
    let desmontar = () => {}

    Promise.all([import("lenis"), import("gsap"), import("gsap/ScrollTrigger")])
      .then(([moduloLenis, moduloGsap, moduloScrollTrigger]) => {
        if (!vivo) return

        const { default: Lenis } = moduloLenis
        const { gsap } = moduloGsap
        const { ScrollTrigger } = moduloScrollTrigger

        gsap.registerPlugin(ScrollTrigger)

        const suave = new Lenis({
          /* El latido lo da GSAP, para que el desplazamiento y las animaciones
             vayan en el mismo fotograma. Si cada uno llevara el suyo, se
             notaría que no van juntos. */
          autoRaf: false,
          duration: 1.1,
          smoothWheel: true,
          syncTouch: false,
        })

        lenis.current = suave
        motor.current = ScrollTrigger as unknown as MotorScroll

        suave.on("scroll", ScrollTrigger.update)

        const latido = (tiempo: number) => suave.raf(tiempo * 1000)
        gsap.ticker.add(latido)
        gsap.ticker.lagSmoothing(0)

        setListo(true)

        desmontar = () => {
          gsap.ticker.remove(latido)
          suave.destroy()
          ScrollTrigger.killAll()
          lenis.current = null
          motor.current = null
        }
      })
      .catch(() => {
        /* Si las dos librerías no llegan —la red se corta, el archivo no
           está— la web se queda sin suavizado y sin las entradas de más
           abajo, pero sigue entera y se puede usar. No hay nada que hacer
           aquí, y desde luego nada que contarle a quien está mirando. */
      })

    return () => {
      vivo = false
      desmontar()
    }
  }, [conMovimiento])

  useEffect(() => {
    const scroll = motor.current
    if (!listo || !scroll) return

    const elementos = Array.from(
      document.querySelectorAll<HTMLElement>(
        '[data-revelar="bloque"]:not([data-revelado])',
      ),
    )

    for (const elemento of elementos) {
      const revelar = () => {
        elemento.dataset.revelado = "si"
      }

      disparadores.current.push(
        scroll.create({
          trigger: elemento,
          start: "top 88%",
          once: true,
          onEnter: revelar,
          /* Y al revés también.
             Los disparadores se crean cuando Lenis y GSAP ya han llegado, o
             sea que hay un instante —medio segundo largo— en que la página se
             puede desplazar sin que nadie mire. Si alguien baja a toda
             velocidad dentro de ese instante, un bloque puede quedar por
             debajo de la línea antes de que su disparador exista; al subir,
             ese disparador no lo ve «entrar» sino «volver», y sin esto se
             quedaría escondido para siempre. */
          onEnterBack: revelar,
        }),
      )
    }

    /* Red de seguridad, y va en dos tiempos.
     *
     * Un titular invisible es mucho peor que un titular sin animación. La
     * primera pasada es inmediata: lo que ya está a la vista cuando los
     * disparadores se crean se enseña en el acto, sin esperar a que nadie
     * baje ni suba. Sin ella, un bloque que ya estuviera en pantalla al abrir
     * la página —en la portada los hay, en cuanto la ventana es baja— se
     * quedaría escondido un segundo largo, y eso no se lee como una animación
     * sino como un fallo.
     *
     * La segunda pasada, a los 1,2 segundos, es para lo otro: para cuando la
     * página cambia de alto después de haberse medido. Una imagen que termina
     * de cargar, la tipografía que entra, un aviso que se despliega. Con las
     * medidas viejas, los disparadores saltan donde ya no toca. */
    const rescatar = () => {
      for (const elemento of elementos) {
        if (elemento.dataset.revelado) continue
        if (elemento.getBoundingClientRect().top < window.innerHeight * 0.88) {
          elemento.dataset.revelado = "si"
        }
      }
    }

    rescatar()

    const rescate = window.setTimeout(rescatar, 1200)

    /* ScrollTrigger mide la página al crear los disparadores. Si después
       cambia de alto, las cuentas se quedan viejas y los disparadores saltan
       donde ya no toca. */
    let activo = true

    const remedir = () => {
      if (activo) scroll.refresh()
    }

    const alTerminarDeCargar = () => remedir()
    window.addEventListener("load", alTerminarDeCargar)
    document.fonts?.ready.then(remedir)

    return () => {
      activo = false
      window.clearTimeout(rescate)
      window.removeEventListener("load", alTerminarDeCargar)
      disparadores.current.forEach((disparador) => disparador.kill())
      disparadores.current = []
    }
  }, [ruta, listo])

  const alternar = useCallback(() => setPausado((valor) => !valor), [])

  /* Volver arriba se pide desde la barra de arriba, pulsando la sección en la
     que ya estás: ahí el enlace no lleva a ningún sitio y lo que se espera es
     subir. Se sube con Lenis, que es quien tiene el desplazamiento suavizado;
     hacerlo con `window.scrollTo` a secas daría un salto seco justo donde se ha
     pedido suavidad, y con el fondo de la página a la vista.

     Y si no hay Lenis —todavía no ha llegado, o quien mira ha pedido menos
     movimiento— el salto instantáneo es lo correcto: no se ha pedido suavidad,
     se ha pedido llegar. */
  const subirArriba = useCallback(() => {
    const suave = lenis.current

    if (suave && !pausado) {
      suave.scrollTo(0)
      return
    }

    window.scrollTo(0, 0)
  }, [pausado])

  /* Al cambiar de página se empieza por arriba.
   *
   * Next ya lo intenta, pero con Lenis por medio el desplazamiento suavizado se
   * queda con la posición anterior y una página nueva puede aparecer a media
   * altura, como si se hubiera heredado el scroll de la anterior. Se pide a
   * Lenis un salto inmediato —no una animación: nadie ha pedido recorrer esa
   * distancia— y, si todavía no ha llegado, se usa el del navegador. */
  const primeraRuta = useRef(true)

  useEffect(() => {
    if (primeraRuta.current) {
      primeraRuta.current = false
      return
    }

    const suave = lenis.current

    if (suave) suave.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)
  }, [ruta])

  useEffect(() => {
    const raiz = document.documentElement

    if (pausado) {
      raiz.dataset.pausado = "si"
    } else {
      delete raiz.dataset.pausado
    }

    /* Se apaga el suavizado en vez de parar la instancia. `stop()` parece lo
       lógico, y es lo que se puso primero, pero Lenis se queda la rueda y no
       hace nada con ella: la página se clavaba y no había forma de bajar salvo
       por la barra. Se comprobó en el navegador. Con el suavizado apagado,
       Lenis deja pasar la rueda al navegador tal cual: se deja de suavizar
       —que es lo que se ha pedido, porque suavizar es moverse— sin dejar de
       poder leer. */
    const suave = lenis.current as unknown as OpcionesDeLenis | null
    if (suave) suave.options.smoothWheel = !pausado
  }, [pausado, listo])

  const valor = useMemo(
    () => ({ pausado, alternar, conMovimiento, subirArriba }),
    [pausado, alternar, conMovimiento, subirArriba],
  )

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>
}
