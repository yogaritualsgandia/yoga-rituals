/**
 * Datos de marca, contacto y navegación.
 *
 * Todo lo de aquí es real, extraído de la web actual (yogarituals.es) y de
 * lo que me ha dicho Susana. Lo que no tenemos va marcado, no inventado.
 */

export const site = {
  nombre: "YOGA Rituals",
  fundadora: "Susana Estruch Espinós",
  rol: "Directora de YOGA Rituals",

  /**
   * El dominio canónico.
   *
   * Es el ápice, sin www, y es una decisión, no una casualidad: la web antigua
   * (Webnode) servía las dos versiones a la vez, las dos con un 200 y sin
   * redirigir una a la otra, así que de cara a Google eso era contenido
   * duplicado en cada página. Aquí se elige una y la otra redirige. El detalle
   * de cómo se configura en Netlify está en DESPLIEGUE.md.
   *
   * Si algún día se cambia, se cambia AQUÍ. De este valor salen el canonical,
   * la imagen para compartir, el mapa del sitio y robots.txt.
   */
  url: "https://yogarituals.es",

  /** Real: «Se abrió el 1/marzo/2017». */
  apertura: new Date("2017-03-01"),
  aperturaTexto: "1 de marzo de 2017",
  /** En septiembre de 2026 cumple 9 años y medio; el décimo es en marzo de 2027. */
  aniversarioTexto: "Desde 2017",

  direccion: {
    calle: "C/ Sant Francesc de Borja, 36, 1º",
    codigoPostal: "46701",
    ciudad: "Gandia",
    provincia: "Valencia",
    pais: "España",
    region: "ES-VC",
    /** Del mapa de la web actual. */
    latitud: 38.9675,
    longitud: -0.1815,
  },

  contacto: {
    telefono: "+34656187761",
    telefonoVisible: "656 18 77 61",
    whatsapp: "34656187761",
    email: "yogaritualsgandia@gmail.com",
  },

  redes: {
    instagram: { usuario: "_yogarituals", url: "https://www.instagram.com/_yogarituals/" },
    facebook: {
      usuario: "YOGA Rituals",
      url: "https://www.facebook.com/p/YOGA-Rituals-100067302412924/",
    },
  },

  /** Cuestionario de bienestar real que ya usan, para recomendar práctica. */
  cuestionario: "https://tally.so/r/XxW5AL",

  /** Frase real de la casa, en valenciano. */
  lema: "Tota pedra fa paret",
} as const

export const whatsappUrl = (mensaje = "Hola Susana, quiero información sobre las clases de yoga.") =>
  `https://wa.me/${site.contacto.whatsapp}?text=${encodeURIComponent(mensaje)}`

/**
 * Barra de navegación: cinco enlaces y una acción.
 * «Primera vez» entra porque quien nunca ha hecho yoga es justo la persona
 * a la que va dirigida la web.
 */
export const navegacionPrincipal = [
  { etiqueta: "Clases", href: "/clases" },
  { etiqueta: "Horarios", href: "/horarios" },
  { etiqueta: "Tarifas", href: "/tarifas" },
  { etiqueta: "Primera vez", href: "/primera-vez" },
  { etiqueta: "Sobre mí", href: "/sobre-mi" },
] as const

export const accionPrincipal = {
  etiqueta: "Reserva tu clase de prueba",
  href: "/contacto",
} as const

export const navegacionCompleta = [
  { etiqueta: "Inicio", href: "/" },
  { etiqueta: "Clases", href: "/clases" },
  { etiqueta: "Horarios", href: "/horarios" },
  { etiqueta: "Tarifas", href: "/tarifas" },
  { etiqueta: "Primera vez", href: "/primera-vez" },
  { etiqueta: "Sobre mí", href: "/sobre-mi" },
  { etiqueta: "Mindfulness", href: "/mindfulness" },
  { etiqueta: "Yoga Nidra", href: "/yoga-nidra" },
  { etiqueta: "Breathwork", href: "/breathwork" },
  { etiqueta: "Yoga Oncológico", href: "/yoga-oncologico" },
  { etiqueta: "Retiros", href: "/retiros" },
  {
    etiqueta: "Talleres en centros educativos",
    href: "/talleres-centros-educativos",
  },
  { etiqueta: "Contacto y reserva", href: "/contacto" },
] as const

/**
 * La navegación del pie, agrupada.
 *
 * Antes era una lista única de trece enlaces en dos columnas, y al rellenarse
 * por filas quedaba un orden sin sentido («Inicio» al lado de «Clases»,
 * «Retiros» al lado de «Talleres»). Agrupada, cada bloque responde a una
 * pregunta: qué es esto, cómo practico y qué más se puede hacer.
 */
export const navegacionPie = [
  {
    titulo: "El estudio",
    enlaces: [
      { etiqueta: "Inicio", href: "/" },
      { etiqueta: "Primera vez", href: "/primera-vez" },
      { etiqueta: "Sobre mí", href: "/sobre-mi" },
      { etiqueta: "Contacto y reserva", href: "/contacto" },
    ],
  },
  {
    titulo: "Practicar",
    enlaces: [
      { etiqueta: "Clases", href: "/clases" },
      { etiqueta: "Horarios", href: "/horarios" },
      { etiqueta: "Tarifas", href: "/tarifas" },
    ],
  },
  {
    titulo: "Actividades",
    enlaces: [
      { etiqueta: "Mindfulness", href: "/mindfulness" },
      { etiqueta: "Yoga Nidra", href: "/yoga-nidra" },
      { etiqueta: "Breathwork", href: "/breathwork" },
      { etiqueta: "Yoga Oncológico", href: "/yoga-oncologico" },
      { etiqueta: "Retiros", href: "/retiros" },
      {
        etiqueta: "Talleres en centros educativos",
        href: "/talleres-centros-educativos",
      },
    ],
  },
] as const

export const navegacionLegal = [
  { etiqueta: "Aviso legal", href: "/aviso-legal" },
  { etiqueta: "Privacidad", href: "/privacidad" },
  { etiqueta: "Cookies", href: "/cookies" },
] as const

/**
 * Atribución obligatoria de la versión gratuita de Skiper UI.
 * El componente skiper40 (CssLink) se usa en el menú, el pie y los enlaces
 * de texto, así que esta línea tiene que quedarse en el pie.
 */
export const atribucion = {
  texto: "Enlaces animados con Skiper UI",
  href: "https://skiper-ui.com",
} as const
