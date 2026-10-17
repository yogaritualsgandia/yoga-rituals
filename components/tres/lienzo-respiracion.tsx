"use client"

import { MeshDistortMaterial } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { useRef, useSyncExternalStore } from "react"
import type { Mesh } from "three"

import { AMPLITUD_RESPIRACION, escalaDeRespiracion } from "@/lib/respiracion"

/**
 * El objeto que respira, de verdad.
 *
 * Es una esfera irregular —un icosaedro con la superficie movida— a la que se
 * le cambia el tamaño con la misma curva con la que respira el círculo de CSS.
 * Nada más: ni partículas, ni ondas, ni nada que llame más la atención que la
 * propia respiración.
 *
 * Cuatro cosas que están así por un motivo:
 *
 *  · EL COLOR NO ESTÁ ESCRITO AQUÍ. Se lee de `--brand-vivid-hex`, que vive en
 *    styles/tokens.css con el resto de la paleta. Si se cambiara la paleta, el
 *    objeto se enteraría solo. Se lee una vez al montar y otra cuando cambia el
 *    tema, que es exactamente cuando cambia.
 *
 *  · SOLO SE MUEVEN DOS COSAS: la escala y la rotación. Las dos las resuelve la
 *    tarjeta gráfica sin volver a calcular la página, y las dos caben en un
 *    fotograma.
 *
 *  · UN GIRO MUY CORTO HACIA EL PUNTERO. Doce grados como mucho, y siguiéndolo
 *    con retraso. Un objeto que persigue al ratón da nervios; uno que se gira
 *    un poco hacia él, no. No hay giroscopio a propósito: en iPhone obliga a
 *    pedir permiso con un aviso, y pedir permiso para esto no compensa.
 *
 *  · CUANDO SE PIDE UNA PAUSA, EL LIENZO DEJA DE PINTAR. Con
 *    `frameloop="never"` no es que vaya más despacio: es que se para del todo,
 *    y el ventilador se calla.
 */

/**
 * El turquesa de la marca, leído del CSS.
 *
 * Es un «almacén de fuera» como manda la ley: `useSyncExternalStore` sirve
 * justo para leer algo que cambia por su cuenta, y aquí lo que cambia es la
 * clase del `<html>` cuando se cambia el tema. Así no hay ningún `useState`
 * encendido desde un efecto, ni un renderizado de más al hidratar.
 */
function suscribirAlTema(avisar: () => void) {
  const vigilante = new MutationObserver(avisar)

  vigilante.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  })

  return () => vigilante.disconnect()
}

function leerTurquesa() {
  const declarado = getComputedStyle(document.documentElement)
    .getPropertyValue("--brand-vivid-hex")
    .trim()

  /* El valor de reserva es el turquesa vivo del modo claro. Si la variable no
     estuviera —una hoja de estilos que no llega— es mejor un objeto del color
     de la marca que un objeto negro. */
  return declarado || "#1e91ba"
}

const turquesaEnElServidor = () => "#1e91ba"

function useTurquesa() {
  return useSyncExternalStore(
    suscribirAlTema,
    leerTurquesa,
    turquesaEnElServidor,
  )
}

function Cuerpo({
  inspirar,
  espirar,
  color,
}: {
  inspirar: number
  espirar: number
  color: string
}) {
  const esfera = useRef<Mesh>(null)
  const giro = useRef({ x: 0, y: 0 })

  useFrame(({ clock, pointer }, delta) => {
    const objeto = esfera.current
    if (!objeto) return

    const aire = escalaDeRespiracion(
      clock.getElapsedTime() * 1000,
      inspirar,
      espirar,
    )

    objeto.scale.setScalar(1 + AMPLITUD_RESPIRACION * aire)

    /* El `delta` es lo que evita que el giro pegue un salto si un fotograma
       llega tarde: se acerca al objetivo en proporción al tiempo que ha
       pasado, no una cantidad fija por fotograma. */
    const paso = Math.min(1, delta * 3)

    giro.current.x += (pointer.y * 0.12 - giro.current.x) * paso
    giro.current.y += (pointer.x * 0.18 - giro.current.y) * paso

    objeto.rotation.set(giro.current.x, giro.current.y, 0)
  })

  return (
    <mesh ref={esfera}>
      <icosahedronGeometry args={[1, 32]} />
      <MeshDistortMaterial
        color={color}
        distort={0.3}
        speed={0.8}
        roughness={0.45}
        metalness={0.05}
      />
    </mesh>
  )
}

export function LienzoRespiracion({
  inspirar,
  espirar,
  pausado,
  activo,
}: {
  inspirar: number
  espirar: number
  pausado: boolean
  /** El escenario está a la vista. Ver la nota de `EscenaRespiracion`. */
  activo: boolean
}) {
  const color = useTurquesa()

  /* Tres motivos para no pintar, y los tres son buenos: que se haya pedido una
     pausa, que el escenario no esté a la vista, o —antes de que el observador
     diga nada— que aún no se sepa. */
  const pintar = activo && !pausado

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 4.4], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={pintar ? "always" : "never"}
    >
      {/* Tres luces y ninguna textura: una ambiental para que no haya negros
          duros, una principal arriba a la derecha y otra de relleno por
          detrás. Los focos con sombra y los entornos de imagen se dejan
          fuera: pesan y aquí no hacen falta. */}
      <ambientLight intensity={0.75} />
      <directionalLight position={[3, 4, 5]} intensity={1.5} />
      <directionalLight position={[-4, -3, 2]} intensity={0.45} />

      <Cuerpo inspirar={inspirar} espirar={espirar} color={color} />
    </Canvas>
  )
}
