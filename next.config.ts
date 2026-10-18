import type { NextConfig } from "next";

export const REDIRECCIONES_ANTIGUAS = [
  { desde: "/actividades", hacia: "/clases" },
  { desde: "/tarifas", hacia: "/precios" },
  { desde: "/minfulness", hacia: "/mindfulness" },
  { desde: "/contacto-imagenes", hacia: "/" },
  { desde: "/contacto", hacia: "/" },
  {
    desde: "/talleres-en-centros-educativos",
    hacia: "/talleres-centros-educativos",
  },
  { desde: "/proximamente", hacia: "/" },
];

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;