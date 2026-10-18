import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"
import * as React from "react"

/**
 * Botón.
 *
 * Se hereda de shadcn solo la base accesible (Slot para `asChild`, y el
 * contrato de variantes). El aspecto es nuestro entero: nada del gris por
 * defecto, el radio único de la web y los colores de marca.
 *
 * DETALLE IMPORTANTE · Todas las tallas miden 44 px de alto como mínimo.
 * Es el mínimo táctil de WCAG 2.1 AA y aquí no se hace excepción, ni siquiera
 * en los botones de icono. La diferencia entre tallas se hace con el aire y
 * el tamaño del texto, no con la altura.
 *
 * La forma es la cápsula, no el rectángulo de esquinas redondeadas. No es un
 * capricho de estilo: es la forma que menos se pelea con el resto de la página,
 * donde no hay una sola esquina recta —la foto, la banda cálida y las tarjetas
 * son todas blandas— y la que hace que un botón de icono sea un círculo y no un
 * cuadrado redondeado. Un radio a medias se nota justo al lado de otra cosa
 * redonda, y ahí es donde se ve que algo está sin terminar.
 *
 * Y el botón no lleva ningún efecto por encima: es su color y ya. Hubo una
 * temporada una chapa de metal líquido animándose dentro del botón principal
 * —un lienzo de WebGL con su borde brillante— y se quitó. Un botón que se mueve
 * por su cuenta le roba la atención a lo que dice, y aquí lo que importa es la
 * frase, no el brillo.
 */
const buttonVariants = cva(
  cn(
    "inline-flex shrink-0 items-center justify-center rounded-full border border-transparent",
    "font-medium whitespace-nowrap select-none",
    /* La transición es de `translate`, no de `transform`, y no es un detalle:
       el realce del botón —el píxel que sube al pasar el ratón y el que baja al
       pulsarlo— se escribe con `translate`, así que era eso lo que había que
       animar. Estaba puesto `transform`, que el botón no toca por su cuenta,
       así que el realce salía de golpe y la transición estaba animando algo que
       no cambiaba. Y ahora sí importa: el imán de `BotonReserva` escribe
       `transform`, y si la transición fuera de `transform`, cada fotograma del
       imán iría con trescientos milisegundos de retraso detrás del ratón. */
    "transition-[translate,background-color,border-color,color] duration-300 ease-out-soft",
    "outline-none focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus",
    "active:translate-y-px motion-reduce:transition-none",
    "disabled:pointer-events-none disabled:opacity-50",
    "aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0",
    "[&_svg:not([class*='size-'])]:size-4",
  ),
  {
    variants: {
      variant: {
        default: "bg-brand text-brand-ink hover:bg-brand-hover hover:-translate-y-px",
        outline: "border-line text-ink hover:bg-surface-2",
        secondary: "bg-surface-2 text-ink hover:border-line",
        ghost: "text-ink hover:bg-surface-2",
        destructive: "bg-destructive text-white hover:opacity-90",
        link: "text-brand underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 gap-2 px-5",
        xs: "h-11 gap-1.5 px-3 text-sm",
        sm: "h-11 gap-2 px-4 text-sm",
        lg: "h-12 gap-2 px-7 text-base",
        icon: "size-11",
        "icon-xs": "size-11",
        "icon-sm": "size-11",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
