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
  experimental: {
    agentUpgrade: "security",
    /* El CSS es una sola hoja de Tailwind, pequeña. Incrustarla en el HTML
       quita la única petición que bloquea el primer pintado: el navegador ya
       no tiene que descubrir el archivo, pedirlo y esperar. */
    inlineCss: true,
  },
}

export default nextConfig
