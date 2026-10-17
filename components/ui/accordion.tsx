"use client"

import * as React from "react"
import { cn } from "cn"
import { Accordion as AccordionPrimitive } from "radix-ui"
import { PlusIcon } from "lucide-react"

/**
 * Acordeón.
 *
 * Por dentro es el de shadcn, o sea Radix: el botón lleva `aria-expanded`, el
 * panel se une al botón por `aria-controls`, y todo se recorre con el teclado.
 * Eso no se toca. Por fuera no queda nada del gris por defecto.
 *
 * Un acordeón para las preguntas frecuentes es una petición expresa de Susana,
 * aunque la dirección de arte prefería el texto corrido: manda ella. Dicho
 * esto, hay dos decisiones que no son obvias:
 *
 *  · El icono es un signo más que gira 45 grados y se convierte en un aspa, en
 *    lugar de una flecha. En una lista de preguntas, un signo dice «se abre» y
 *    «se cierra» sin que nadie tenga que interpretar hacia dónde apunta una
 *    flecha. Y solo se anima `transform`, que no obliga al navegador a
 *    recolocar nada.
 *
 *  · No se pone `outline-none` en el botón. El original de shadcn lo trae, y
 *    habría dejado sin foco visible a quien navega con el teclado: las clases
 *    de utilidad ganan a la regla global de `:focus-visible`. Es una línea que
 *    parece de estilo y es de accesibilidad.
 */

function Accordion({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  )
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b border-line", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger flex flex-1 items-start justify-between gap-6 py-5 text-left font-heading text-lg text-ink transition-colors hover:text-brand",
          className,
        )}
        {...props}
      >
        {children}
        <PlusIcon
          data-slot="accordion-trigger-icon"
          aria-hidden="true"
          className="mt-1.5 size-4 shrink-0 text-ink-soft transition-transform duration-[var(--dur-base)] ease-out-soft group-aria-expanded/accordion-trigger:rotate-45 motion-reduce:transition-none"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden data-open:animate-accordion-down data-closed:animate-accordion-up"
      {...props}
    >
      <div
        className={cn(
          "h-(--radix-accordion-content-height) paso-base medida pb-7 text-ink-soft",
          className,
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
