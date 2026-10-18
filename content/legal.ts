/**
 * Los tres textos legales.
 *
 * Están escritos describiendo lo que hace esta web, no copiando una plantilla.
 * Lo que hace, comprobado en el código, es poco y conviene tenerlo claro antes
 * de leerlos:
 *
 *   · No hay cookies. Ni propias ni de terceros. No hay analítica, ni
 *     publicidad, ni botones que avisen a las redes sociales, ni mapas
 *     incrustados: el mapa y las reseñas de Google son enlaces, te llevan a
 *     Google y no se cargan aquí dentro.
 *
 *   · Lo único que se guarda en el navegador de quien entra es el modo oscuro,
 *     porque lo elige él al pulsar el botón. No es una cookie (es el
 *     almacenamiento local del navegador), no viaja al servidor y no se usa
 *     para nada más. La Agencia Española de Protección de Datos considera esta
 *     clase de preferencia una cookie técnica exenta de consentimiento, así que
 *     no hay cartel de aceptar: no hay nada que aceptar.
 *
 *   · No hay formularios, ni cuentas, ni base de datos. Los datos llegan porque
 *     alguien decide escribir: por WhatsApp, por correo o por teléfono.
 *
 *   · El alojamiento es Netlify (Netlify, Inc., Estados Unidos), que guarda los
 *     registros técnicos de las visitas para dar el servicio, y está adherida
 *     al marco de privacidad de datos entre la Unión Europea y Estados Unidos.
 *     El correo del estudio es una cuenta de Gmail, así que los mensajes que
 *     llegan ahí los aloja Google, que también está adherida.
 *
 * Lo que no se puede escribir sin preguntar está marcado con `falta` en cada
 * documento, y se ve en la propia página, como en el resto de la web: aquí no
 * se rellena un hueco con algo que suene bien.
 */

/** Los datos del titular, que pide el artículo 10 de la LSSI. */
export const titular = {
  /* El nombre y el NIF los tiene que dar el estudio. La página avisa mientras
     no estén, y las filas vacías no se pintan. */
  nombre: "",
  nif: "",
  domicilio: "Calle Sant Francesc de Borja, 36, 1.º · 46701 Gandia (Valencia)",
  correo: "yogarituals.gandia@gmail.com",
  telefono: "656 187 761",
}

export type BloqueLegal = {
  titulo: string
  /** El texto, párrafo a párrafo. */
  parrafos?: string[]
  /** Cuando enumerar se lee mejor que escribir. */
  lista?: string[]
  /** La ficha, para la identificación del titular. */
  datos?: { etiqueta: string; valor: string }[]
}

export type DocumentoLegal = {
  /** El `h1` y el título de la pestaña. */
  titulo: string
  /** La descripción de la pestaña. */
  descripcion: string
  /** La dirección, que es también la del archivo. */
  ruta: string
  entradilla: string
  /** Lo que todavía no está escrito, si falta algo. Se ve en la página. */
  falta?: string
  /** La fecha que se lee al pie del documento. */
  actualizado: string
  bloques: BloqueLegal[]
}

const ACTUALIZADO = "18 de octubre de 2026"

/** La ficha del titular, sin las filas que aún no tienen dato. */
const identificacion = (
  [
    { etiqueta: "Titular", valor: titular.nombre },
    { etiqueta: "NIF", valor: titular.nif },
    { etiqueta: "Domicilio", valor: titular.domicilio },
    { etiqueta: "Correo", valor: titular.correo },
    { etiqueta: "Teléfono", valor: titular.telefono },
  ] as { etiqueta: string; valor: string }[]
).filter((dato) => dato.valor !== "")

/* ── Aviso legal ─────────────────────────────────────────────────────────── */

const avisoLegal: DocumentoLegal = {
  titulo: "Aviso legal",
  descripcion:
    "Quién está detrás de yogarituals.es, qué se puede hacer con lo que hay en la web y qué no, y con quién se habla si algo no va bien.",
  ruta: "/aviso-legal",
  entradilla:
    "Quién está detrás de esta web, qué se puede hacer con lo que hay en ella y qué no.",
  falta:
    "Faltan el nombre y el NIF del titular. Los pide la ley (artículo 10 de la LSSI) y no se pueden inventar.",
  actualizado: ACTUALIZADO,
  bloques: [
    {
      titulo: "Quién está detrás de esta web",
      datos: identificacion,
      parrafos: [
        "Esta web es la del estudio de yoga YOGA Rituals, en Gandia. Todo lo que se cuenta aquí se contrata en el estudio: en esta web no se paga nada ni se compra nada.",
      ],
    },
    {
      titulo: "Qué se puede hacer con lo que hay aquí",
      parrafos: [
        "Leerla, copiar lo que necesites para ti y compartir sus enlaces donde quieras. Lo que no se puede es publicar su contenido como si fuera de otro ni hacer pasar esta web por otra distinta.",
        "El horario y los precios son informativos y pueden cambiar. Los que valen son los que estén publicados aquí el día que vengas. Si ves algo que no cuadra, escríbenos y lo miramos.",
      ],
    },
    {
      titulo: "Lo que hay aquí es del estudio",
      parrafos: [
        "Los textos y el logotipo son del estudio. Las fotos que se ven hoy son provisionales y lo dicen en su propio pie; las definitivas serán del estudio.",
        "Si quieres usar algo de esta web en otro sitio, pide permiso antes y se habla.",
      ],
    },
    {
      titulo: "Lo que se cuenta no es consejo médico",
      parrafos: [
        "Aquí se explica cómo se practica y qué se hace en cada clase, con las palabras del estudio. Eso no es un consejo médico ni sustituye a lo que te diga quien te trata.",
        "Si tienes una lesión, una enfermedad o estás embarazada, cuéntanoslo antes de empezar y te decimos cómo adaptarlo. En el yoga oncológico, además, se trabaja siempre en coordinación con el equipo médico que te atiende.",
      ],
    },
    {
      titulo: "Enlaces a otros sitios",
      parrafos: [
        "Hay enlaces a WhatsApp, a Instagram, a Google Maps, a las reseñas de Google y a la delegación de yoga oncológico. Al pulsarlos sales de esta web y entras en la suya, con sus propias condiciones.",
        "De lo que pase a partir de ahí no respondemos, porque no depende de nosotros. Tampoco de lo que publiquen esos sitios.",
      ],
    },
    {
      titulo: "Si algo no va bien",
      parrafos: [
        "Se escribe al correo o se llama al teléfono que están ahí arriba y se habla. Casi todo se arregla así.",
        "Este aviso se rige por la ley española. Si alguna vez hubiera que llevar un desacuerdo a los tribunales, quien sea consumidor puede hacerlo en los juzgados de su domicilio.",
      ],
    },
    {
      titulo: "Si esto cambia",
      parrafos: [
        "Si cambia algo de lo que dice esta página, se cambia aquí y se actualiza la fecha del pie. Esta página es la que manda.",
      ],
    },
  ],
}

/* ── Privacidad ──────────────────────────────────────────────────────────── */

const privacidad: DocumentoLegal = {
  titulo: "Privacidad",
  descripcion:
    "Qué datos personales trata el estudio, para qué, con qué permiso, cuánto tiempo y cómo pedir que se borren. Esta web no tiene formularios ni analítica: los datos llegan porque tú escribes.",
  ruta: "/privacidad",
  entradilla:
    "Qué hacemos con tus datos. Corto: los que tú nos das, para contestarte y para darte clase.",
  falta:
    "Faltan el nombre y el NIF de la responsable y tres respuestas: si las notas de salud se apuntan en algún sitio, si se van a mandar avisos de talleres y si el estudio tiene alumnado menor de edad.",
  actualizado: ACTUALIZADO,
  bloques: [
    {
      titulo: "Quién trata tus datos",
      datos: identificacion,
      parrafos: [
        "El responsable del tratamiento es el titular del estudio, que figura arriba. Para cualquier cosa relacionada con tus datos se escribe a ese correo o se llama a ese teléfono: contestamos nosotros, no hay nadie en medio.",
      ],
    },
    {
      titulo: "Qué datos tenemos y de dónde salen",
      parrafos: [
        "Esta web no tiene formularios, ni cuentas de usuario, ni medición de visitas. No recogemos nada por el simple hecho de que entres. Los datos llegan solo por donde tú decides escribir: WhatsApp, correo o teléfono.",
        "Cuando escribes nos llega tu nombre (o el que uses en WhatsApp), tu número y lo que nos cuentes. Si vienes a clase, además necesitamos saber si tienes alguna lesión o algo que haya que tener en cuenta.",
        "El servidor donde vive la web guarda un registro técnico de cada visita (dirección IP, fecha y navegador). Lo guarda el alojamiento para que el sitio funcione y esté protegido, y nosotros no lo usamos para nada más.",
      ],
    },
    {
      titulo: "Para qué los usamos y con qué permiso",
      lista: [
        "Para contestarte y organizar la clase: es lo que hace falta para atenderte antes de que haya un contrato (artículo 6.1.b del RGPD).",
        "Para llevar las cuentas y cumplir con Hacienda: obligación legal (artículo 6.1.c).",
        "Para que la web funcione y esté protegida, con los registros del servidor: interés legítimo en que el sitio esté en pie (artículo 6.1.f).",
        "Si nos das tu permiso para avisarte de un taller o de un cambio de horario, para eso. Puedes decir que no, y retirarlo cuando quieras sin que pase nada.",
      ],
    },
    {
      titulo: "Si nos cuentas algo de tu salud",
      parrafos: [
        "Si nos cuentas una lesión, una operación, un embarazo o un proceso oncológico, es para adaptar la práctica y para nada más. Son datos especialmente protegidos, así que solo los tratamos con tu consentimiento explícito: nos lo das al contárnoslo y puedes retirarlo cuando quieras.",
        "Se quedan en la conversación donde nos lo contaste. No se apuntan en ningún fichero aparte, no se comparten con nadie y no se usan para otra cosa. Si prefieres no contarlo, puedes practicar igual.",
      ],
    },
    {
      titulo: "Cuánto tiempo los guardamos",
      parrafos: [
        "Lo que hablamos, el tiempo de atenderte y el que después pida la ley para las facturas y los justificantes (cuatro años, lo que marca Hacienda).",
        "Los datos de salud, mientras practiques con nosotros. Cuando dejes de venir, o antes si lo pides, se borran.",
      ],
    },
    {
      titulo: "Quién más los ve",
      parrafos: [
        "El alojamiento de la web, Netlify, que guarda los registros técnicos de las visitas por el tiempo que necesita para dar el servicio.",
        "El correo del estudio es una cuenta de Gmail, así que los mensajes que mandes al correo los aloja Google. Los de WhatsApp viajan por WhatsApp, que trata esos datos por su cuenta como responsable: nosotros solo vemos lo que nos escribes.",
        "Y nadie más. Tus datos no se venden, no se ceden y no se usan para publicidad.",
      ],
    },
    {
      titulo: "Fuera de España",
      parrafos: [
        "Netlify y Google están en Estados Unidos. Las dos están adheridas al marco de privacidad de datos entre la Unión Europea y Estados Unidos, y con las dos hay contrato de encargado del tratamiento. Es lo que cubre que tus datos puedan pasar por ahí con garantías.",
      ],
    },
    {
      titulo: "Tus derechos",
      lista: [
        "Saber qué datos tuyos tenemos y pedir una copia (acceso).",
        "Corregir lo que esté mal (rectificación).",
        "Pedir que los borremos (supresión).",
        "Pedir que dejemos de usarlos para algo concreto o que los guardemos sin tocarlos (oposición y limitación).",
        "Llevarte tus datos a otro sitio (portabilidad).",
        "Retirar el permiso que nos hayas dado, cuando quieras.",
      ],
      parrafos: [
        "Se pide por correo o por WhatsApp, sin más trámite, y se contesta en un mes como mucho.",
        "Si crees que no lo hemos hecho bien, puedes reclamar a la Agencia Española de Protección de Datos (aepd.es). Antes de eso, escríbenos: casi todo se arregla hablando.",
      ],
    },
    {
      titulo: "Cómo los protegemos",
      parrafos: [
        "La web va por HTTPS. No hay ninguna base de datos con tus cosas, porque no hay formularios donde meterlas: lo que llega, llega a un teléfono y a un correo, y los dos están protegidos con contraseña.",
      ],
    },
    {
      titulo: "Menores",
      parrafos: [
        "Si quien viene a clase o quien escribe es menor de 14 años, el permiso lo tiene que dar su padre, su madre o quien lo tenga a su cargo.",
      ],
    },
    {
      titulo: "Si esto cambia",
      parrafos: [
        "Si cambia algo de lo que dice esta página, se cambia aquí y se actualiza la fecha del pie. No se avisa por correo: esta página es la que manda.",
      ],
    },
  ],
}

/* ── Cookies ─────────────────────────────────────────────────────────────── */

const cookies: DocumentoLegal = {
  titulo: "Cookies",
  descripcion:
    "Esta web no usa cookies: ni propias ni de terceros. Lo único que guarda el navegador es el modo oscuro que elige quien entra, y se explica por qué eso no necesita permiso.",
  ruta: "/cookies",
  entradilla:
    "Esta web no usa cookies. Lo contamos largo porque es corto, y porque conviene saber por qué no hay cartel de aceptar.",
  actualizado: ACTUALIZADO,
  bloques: [
    {
      titulo: "Qué es una cookie",
      parrafos: [
        "Un archivo pequeño que una web deja en tu navegador y que puede volver a leer cuando vuelves. Sirven para recordar que ya has entrado, para contar cuánta gente visita cada página o para seguirte por otras webs con publicidad.",
      ],
    },
    {
      titulo: "Aquí no hay ninguna",
      parrafos: [
        "Esta web no pone cookies. Ni propias ni de terceros. No hay medición de visitas, no hay publicidad, no hay botones que avisen a las redes sociales cuando los miras y no hay mapas ni vídeos incrustados. El mapa y las reseñas de Google son enlaces: al pulsarlos vas a Google, pero no se carga nada suyo aquí dentro.",
      ],
    },
    {
      titulo: "Lo único que se guarda en tu navegador",
      parrafos: [
        "Cuando pulsas el botón del modo oscuro, tu navegador apunta esa elección para recordarla la próxima vez. No es una cookie: es el almacenamiento local del navegador. Se queda en tu aparato, no viaja a ningún servidor, no lo lee nadie más y sirve solo para pintar la web como la dejaste.",
        "Se borra vaciando los datos del navegador, y no pasa nada: la web vuelve a salir clara, que es como sale de fábrica.",
      ],
    },
    {
      titulo: "Por eso no hay cartel de aceptar",
      parrafos: [
        "La Agencia Española de Protección de Datos dice que cuando la elección la toma quien visita la web (el idioma, el modo oscuro, el tamaño de la letra) y se usa solo para eso, es una cookie técnica y no hace falta permiso.",
        "Pedir un permiso para algo que no existe sería un trámite que no protege a nadie, así que no lo hay.",
      ],
    },
    {
      titulo: "Si algún día se pone algo",
      parrafos: [
        "Si mañana se añade algo que mida las visitas o que enseñe vídeos de fuera, se dice primero aquí y se pregunta antes de encenderlo. Mientras esta página diga que no hay cookies, es que no hay.",
      ],
    },
    {
      titulo: "Al salir de aquí, otras normas",
      parrafos: [
        "Los enlaces a WhatsApp, Instagram y Google te llevan a sus webs, y ahí valen sus propias políticas de cookies. No son nuestras y no podemos cambiarlas; si quieres evitarlas, no hace falta pulsar ningún enlace para leer esta web.",
      ],
    },
  ],
}

export const documentosLegales = { avisoLegal, privacidad, cookies }
