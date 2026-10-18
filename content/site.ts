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
    /**
     * La calle y el número, sin el piso.
     *
     * El piso se guarda aparte por un motivo práctico: el enlace a Google Maps
     * se arma con estos campos, y un «1º» en medio de una dirección no ayuda a
     * nadie a encontrar la puerta —el portal es lo que se busca—, pero sí puede
     * confundir al buscador del mapa. En pantalla, en cambio, el piso se dice,
     * porque quien va a venir quiere saber que hay que subir.
     */
    calle: "C/ Sant Francesc de Borja, 36",
    piso: "1º",
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

  /**
   * Solo Instagram. Había también Facebook y se ha quitado: es una página que
   * Susana no atiende y un enlace a un perfil parado es peor que no tenerlo.
   */
  redes: {
    instagram: {
      usuario: "_yogarituals",
      url: "https://www.instagram.com/_yogarituals/",
    },
  },

  /** Frase real de la casa, en valenciano. */
  lema: "Tota pedra fa paret",
} as const

export const whatsappUrl = (mensaje = "Hola Susana, quiero información sobre las clases de yoga.") =>
  `https://wa.me/${site.contacto.whatsapp}?text=${encodeURIComponent(mensaje)}`

/**
 * Dónde está el estudio, en Google Maps.
 *
 * Se arma con la dirección de arriba en vez de escribirse a mano, y eso es lo
 * importante: no hay dos versiones de la dirección que puedan dejar de
 * coincidir. El día que el estudio cambie de calle, se cambia en un sitio y el
 * enlace cambia solo, sin que nadie tenga que acordarse de que este enlace
 * existe.
 *
 * Se busca por texto —el nombre del estudio y la dirección— y no por las
 * coordenadas, que también están puestas. Con las coordenadas el enlace deja un
 * punto clavado en el mapa y no hay forma de comprobarlo sin ir; buscando por
 * texto, Google enseña el local por su nombre, con su ficha, sus fotos y su
 * horario, que es lo que de verdad quiere ver quien va a venir. Y si la ficha
 * de Google no existiera, la búsqueda cae igualmente en la dirección correcta.
 */
export const mapaUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${site.nombre}, ${site.direccion.calle}, ${site.direccion.codigoPostal} ${site.direccion.ciudad}, ${site.direccion.provincia}`,
)}`

/**
 * Barra de navegación: seis enlaces y una acción.
 *
 * «Inicio» está porque la portada explica qué es esto —quién da las clases,
 * cómo funciona el horario, por dónde se empieza— y volver a ella tiene que
 * costar un clic, no dos.
 *
 * «Primera vez» entra porque quien nunca ha hecho yoga es justo la persona
 * a la que va dirigida la web.
 */
export const navegacionPrincipal = [
  { etiqueta: "Inicio", href: "/" },
  { etiqueta: "Clases", href: "/clases" },
  { etiqueta: "Horarios", href: "/horarios" },
  { etiqueta: "Precios", href: "/precios" },
  { etiqueta: "Primera vez", href: "/primera-vez" },
  { etiqueta: "Sobre mí", href: "/sobre-mi" },
] as const

/**
 * El mensaje que se escribe solo al abrir WhatsApp.
 *
 * No es un adorno: quien recibe el mensaje sabe de antemano qué se le está
 * pidiendo, y quien lo manda no tiene que pensar cómo empezar. Es lo que
 * convierte un botón en una conversación.
 */
export const mensajeDeReserva =
  "Hola Susana, quiero reservar la clase de prueba gratuita."

/**
 * La acción principal: reservar la clase de prueba.
 *
 * Y va directa a WhatsApp, no a un formulario. La clase de prueba es gratis y
 * hay que encajarla en un horario que lleva Susana, así que esto se resuelve
 * hablando: qué día, a qué hora, si es la primera vez. Un formulario mete una
 * espera de un día en medio de una conversación de dos minutos.
 *
 * Es la única cosa de la web que se reserva. Las clases normales son con
 * horario libre: se viene y ya está.
 */
export const accionPrincipal = {
  etiqueta: "Reserva tu clase de prueba",
  href: whatsappUrl(mensajeDeReserva),
  /** true = sale de la web. Los enlaces internos no llevan esto. */
  externo: true,
} as const

export const navegacionLegal = [
  { etiqueta: "Aviso legal", href: "/aviso-legal" },
  { etiqueta: "Privacidad", href: "/privacidad" },
  { etiqueta: "Cookies", href: "/cookies" },
] as const
