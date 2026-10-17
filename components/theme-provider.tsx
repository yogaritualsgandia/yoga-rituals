"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import * as React from "react"

/**
 * Tema.
 *
 * Claro por defecto y sin seguir al sistema: el suelo crema es la web, y
 * heredar el modo oscuro del sistema de un visitante que entra de día desde
 * el móvil da una primera impresión que no es la que se ha diseñado. El modo
 * oscuro existe y se enciende a mano, desde el botón del pie.
 *
 * Al componente original de shadcn se le ha quitado el atajo de teclado que
 * cambiaba el tema al pulsar «D». Un control invisible que cambia la web sin
 * querer no es un atajo, es una trampa.
 */
function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}

export { ThemeProvider }
