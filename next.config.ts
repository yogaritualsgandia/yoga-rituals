import type { NextConfig } from "next"

export const REDIRECCIONES_ANTIGUAS = [
  { desde: "/actividades", hacia: "/clases" },
  { desde: "/tarifas", hacia: "/precios" },
  { desde: "/minfulness", hacia: "/mindfulness" },
  { desde: "/contacto-imagenes", hacia: "/" },
  {
    desde: "/talleres-en-centros-educativos",
    hacia: "/talleres-centros-educativos",
  },
  { desde: "/proximamente", hacia: "/" },
]

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  turbopack: {
    /* Next mete en el paquete del cliente un archivo de polyfills que rellena
       `Array.prototype.at`, `flat`, `flatMap`, `Object.fromEntries`,
       `Object.hasOwn`, `String.prototype.trimStart/trimEnd` y `URL.canParse`.
       El suelo de navegadores de `package.json` (Chrome, Edge y Firefox 111,
       Safari 16.4) ya trae todos menos `URL.canParse`, que la web no usa. Se
       sustituye por un módulo vacío para no enviar código que nadie ejecuta.

       Queda otro archivo, `polyfill-nomodule`, que Next copia tal cual al
       export para el bloque `noModule` del HTML. Ese no pasa por Turbopack, así
       que se vacía en el postbuild con
       `scripts/vaciar-polyfills-export.mjs`. El alias no sirve porque Next lo
       importa con una ruta relativa; el loader sí, porque actúa sobre el
       archivo ya resuelto. */
    rules: {
      "**/polyfill-module.js": {
        loaders: ["./scripts/vaciar-polyfills.cjs"],
        as: "*.js",
      },
    },
  },
  experimental: {
    agentUpgrade: "security",
    /* El CSS es una sola hoja de Tailwind, pequeña. Incrustarla en el HTML
       quita la única petición que bloquea el primer pintado: el navegador ya
       no tiene que descubrir el archivo, pedirlo y esperar. */
    inlineCss: true,
  },
}

export default nextConfig
