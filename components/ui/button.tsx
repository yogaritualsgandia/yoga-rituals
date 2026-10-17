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
 */
const buttonVariants = cva(
  cn(
    "inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent",
    "font-medium whitespace-nowrap select-none",
    "transition-[transform,background-color,border-color,color] duration-300 ease-out-soft",
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
