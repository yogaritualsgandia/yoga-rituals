/**
 * Los tres textos legales.
 *
 * Están escritos describiendo lo que hace esta web de verdad, comprobado en el
 * código, y no copiando una plantilla. Hoy hace esto:
 *
 *   · No hay formularios, ni cuentas, ni base de datos, ni pagos. Los datos
 *     personales llegan solo porque alguien decide escribir por WhatsApp, por
 *     correo o por teléfono.
 *
 *   · Hay dos herramientas de medición: Google Analytics 4 y Microsoft
 *     Clarity. Ninguna se carga hasta que se acepta el cartel de cookies. Sin
 *     aceptar, no sale ni una petición hacia Google ni hacia Microsoft.
 *
 *   · El modo claro u oscuro y la propia decisión sobre las cookies se guardan
 *     en el almacenamiento local del navegador. No son cookies, no viajan al
 *     servidor y no sirven para seguir a nadie.
 *
 *   · El alojamiento es Netlify (Netlify, Inc., Estados Unidos), que guarda
 *     los registros técnicos de las visitas para dar el servicio. El correo es
 *     una cuenta de Gmail y la medición es de Google y Microsoft; las tres
 *     están adheridas al marco de privacidad de datos entre la Unión Europea y
 *     Estados Unidos.
 *
 * Los textos siguen la guía de cookies de la Agencia Española de Protección de
 * Datos: se informa antes de pedir, rechazar cuesta lo mismo que aceptar, no
 * hay casillas premarcadas y la decisión se puede retirar tantas veces como se
 * quiera.
 */

/** Los datos del titular, que pide el artículo 10 de la LSSI. */
export const titular = {
  nombre: "Susana Estruch Espinós",
  /* Falta el número. Se deja escrito entre corchetes —y no vacío— para que se
     vea que es un hueco y no una omisión: el día que llegue, se sustituye esta
     línea y no hay que tocar nada más. */
  nif: "[NIF de Susana Estruch Espinós]",
  domicilio: "Calle Sant Francesc de Borja, 36, 1.º · 46701 Gandia (Valencia)",
  correo: "yogaritualsgandia@gmail.com",
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
  /** Una tabla de verdad, para las cookies: nombre, para qué, quién, cuánto. */
  tabla?: { columnas: string[]; filas: string[][] }
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

const ACTUALIZADO = "19 de octubre de 2026"

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
    "Quién está detrás de yogarituals.es, qué se puede hacer con sus contenidos y cómo contactar con el estudio.",
  ruta: "/aviso-legal",
  entradilla:
    "Quién está detrás de esta web, qué se puede hacer con lo que hay en ella y qué no.",
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
      titulo: "Para qué es esta web",
      parrafos: [
        "Para contar qué se practica, cuándo se puede venir, cuánto cuesta y cómo se llega. La reserva de la clase de prueba se hace por WhatsApp, no aquí.",
        "La información es divulgativa. No sustituye a lo que te diga el profesor el día que vengas ni, mucho menos, a lo que te diga un profesional sanitario.",
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
        "Los textos y el logotipo son del estudio. Las fotos que se ven hoy son provisionales y lo dicen en su propio pie; las definitivas serán del estudio o se usarán con permiso.",
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
        "Hay enlaces a WhatsApp, a Instagram, a Google Maps, a las reseñas de Google y a la delegación de yoga oncológico. Al pulsarlos sales de esta web y entras en la suya, con sus propias condiciones y su propia política de privacidad.",
        "De lo que pase a partir de ahí no respondemos, porque no depende de nosotros. Tampoco de lo que publiquen esos sitios.",
      ],
    },
    {
      titulo: "Responsabilidad",
      parrafos: [
        "Se pone cuidado en que la web esté disponible y en que lo que cuenta sea cierto, pero no se puede garantizar que no haya interrupciones ni errores. Si algo no funciona, se avisa al correo de contacto y se intenta arreglar.",
        "No respondemos de los daños que vengan de un uso de la web distinto del que se describe aquí ni de la imposibilidad de acceder a ella por causas ajenas al estudio.",
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
    "Qué datos trata YOGA Rituals, para qué, con qué permiso, cuánto tiempo y cómo ejercer tus derechos. Sin formularios.",
  ruta: "/privacidad",
  entradilla:
    "Qué hacemos con tus datos. Corto: los que tú nos das, para contestarte y para darte clase.",
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
        "Esta web no tiene formularios, ni cuentas de usuario, ni área privada. No recogemos nada por el simple hecho de que entres. Los datos llegan solo por donde tú decides escribir: WhatsApp, correo o teléfono.",
        "Cuando escribes nos llega tu nombre (o el que uses en WhatsApp), tu número y lo que nos cuentes. Si vienes a clase, además necesitamos saber si tienes alguna lesión o algo que haya que tener en cuenta.",
        "El servidor donde vive la web guarda un registro técnico de cada visita (dirección IP, fecha y navegador). Lo guarda el alojamiento para que el sitio funcione y esté protegido, y nosotros no lo usamos para nada más.",
        "Si aceptas el cartel de cookies, Google Analytics y Microsoft Clarity recogen datos de navegación. Se explica abajo, y puedes rechazarlo sin que la web deje de funcionar.",
      ],
    },
    {
      titulo: "Para qué los usamos y con qué permiso",
      lista: [
        "Para contestarte y organizar la clase: es lo que hace falta para atenderte antes de que haya un contrato (artículo 6.1.b del RGPD).",
        "Para llevar las cuentas y cumplir con Hacienda: obligación legal (artículo 6.1.c).",
        "Para que la web funcione y esté protegida, con los registros del servidor: interés legítimo en que el sitio esté en pie (artículo 6.1.f).",
        "Para medir las visitas con Google Analytics y Microsoft Clarity: tu consentimiento (artículo 6.1.a), que das al aceptar el cartel y puedes retirar cuando quieras.",
        "Si nos cuentas algo de tu salud, para adaptar la práctica: tu consentimiento explícito (artículo 9.2.a).",
      ],
    },
    {
      titulo: "La medición de las visitas",
      parrafos: [
        "Google Analytics 4 cuenta cuántas personas entran, qué páginas se leen y de dónde se llega. Microsoft Clarity añade mapas de calor y grabaciones de sesión anónimas para ver dónde se atasca la navegación. Sirven para mejorar la web, nada más.",
        "No hay publicidad, ni perfilado comercial, ni se venden datos a nadie. Tampoco se usan para tomar decisiones automáticas sobre ti.",
        "Las dos herramientas se cargan solo después de que aceptes. Si rechazas, no se ejecuta su código y no sale ninguna petición hacia Google ni hacia Microsoft. Puedes cambiar la decisión en cualquier momento desde la página de cookies.",
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
      lista: [
        "Lo que hablamos y lo necesario para atenderte: el tiempo de la conversación y el de la relación con el estudio.",
        "Las facturas y justificantes: cuatro años, lo que marca la ley fiscal.",
        "Los datos de salud: mientras practiques con nosotros. Cuando dejes de venir, o antes si lo pides, se borran.",
        "Tu decisión sobre las cookies: dos años en el almacenamiento de tu navegador. Después se vuelve a preguntar.",
        "La medición: el tiempo que cada herramienta tiene configurado y, como máximo, el de sus cookies (13 meses Google Analytics y 13 meses Clarity).",
      ],
    },
    {
      titulo: "Quién más los ve",
      parrafos: [
        "El alojamiento de la web, Netlify, que guarda los registros técnicos de las visitas por el tiempo que necesita para dar el servicio.",
        "El correo del estudio es una cuenta de Gmail, así que los mensajes que mandes al correo los aloja Google. Los de WhatsApp viajan por WhatsApp, que trata esos datos por su cuenta como responsable: nosotros solo vemos lo que nos escribes.",
        "Si aceptas la medición, Google recibe los datos de navegación para Analytics y Microsoft para Clarity. Son encargados del tratamiento y solo los usan para prestar el servicio.",
        "Y nadie más. Tus datos no se venden, no se ceden y no se usan para publicidad.",
      ],
    },
    {
      titulo: "Fuera de España",
      parrafos: [
        "Netlify, Google y Microsoft están en Estados Unidos. Las tres están adheridas al marco de privacidad de datos entre la Unión Europea y Estados Unidos, y con las tres hay contrato de encargado del tratamiento. Es lo que cubre que tus datos puedan pasar por ahí con garantías.",
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
    "Qué cookies usa yogarituals.es, para qué sirven, cuánto duran y cómo aceptarlas, rechazarlas o cambiar tu decisión.",
  ruta: "/cookies",
  entradilla:
    "Qué se guarda en tu navegador cuando entras, para qué y cómo se cambia.",
  actualizado: ACTUALIZADO,
  bloques: [
    {
      titulo: "Qué es una cookie",
      parrafos: [
        "Un archivo pequeño que una web deja en tu navegador y que puede volver a leer cuando vuelves. Sirven para recordar que ya has entrado, para contar cuánta gente visita cada página o para seguirte por otras webs con publicidad.",
      ],
    },
    {
      titulo: "Qué se usa aquí",
      parrafos: [
        "Esta web no pone cookies de publicidad, ni de redes sociales, ni de mapas o vídeos incrustados. El mapa y las reseñas de Google son enlaces: al pulsarlos vas a Google, pero no se carga nada suyo aquí dentro.",
        "Solo hay dos cosas: un par de preferencias que se guardan en el almacenamiento local del navegador y no necesitan permiso, y dos herramientas de medición que sí lo necesitan y que no se encienden hasta que aceptas.",
      ],
    },
    {
      titulo: "Las cookies de medición",
      tabla: {
        columnas: ["Nombre", "Para qué sirve", "Quién la pone", "Duración"],
        filas: [
          [
            "_ga y _ga_<ID>",
            "Distinguir a quien visita la web y contar las visitas sin repetirlas.",
            "Google Analytics 4 (Google LLC)",
            "13 meses",
          ],
          [
            "_clck",
            "Identificador anónimo de quien visita, para no contar dos veces la misma visita.",
            "Microsoft Clarity (Microsoft Corporation)",
            "1 año",
          ],
          [
            "_clsk",
            "Unir las páginas que se ven en una misma sesión.",
            "Microsoft Clarity (Microsoft Corporation)",
            "1 día",
          ],
          [
            "MUID",
            "Identificador de usuario de Microsoft.",
            "Microsoft Corporation",
            "13 meses",
          ],
          [
            "ANONCHK",
            "Comprobar si el navegador acepta cookies.",
            "Microsoft Corporation",
            "10 minutos",
          ],
          [
            "SM",
            "Identificador de la sesión.",
            "Microsoft Corporation",
            "Sesión",
          ],
        ],
      },
      parrafos: [
        "La duración de las cookies de Google se ha recortado a trece meses; por defecto Google las deja dos años.",
        "Estas cookies no se ponen si rechazas. Tampoco se ponen si no tocas el cartel: mientras no haya un «sí», las herramientas no se cargan.",
      ],
    },
    {
      titulo: "Lo que se guarda sin pedir permiso",
      parrafos: [
        "Cuando pulsas el botón del modo oscuro, tu navegador apunta esa elección para recordarla la próxima vez. Y cuando contestas al cartel, guarda tu respuesta para no preguntarte en cada página. Las dos cosas viven en el almacenamiento local del navegador, no son cookies, no viajan al servidor y no las lee nadie más.",
        "La Agencia Española de Protección de Datos considera esta clase de preferencias técnicas exentas de consentimiento: sirven solo para recordar lo que tú has elegido.",
        "Se borran vaciando los datos del navegador, y no pasa nada: la web vuelve a salir clara y vuelve a preguntar por las cookies.",
      ],
    },
    {
      titulo: "Cómo se pide el permiso",
      parrafos: [
        "La primera vez que entras sale un cartel abajo, con dos botones del mismo tamaño: aceptar todas y rechazar todas. No hay casillas premarcadas, ni opciones escondidas, ni nada que se encienda antes de que contestes.",
        "Rechazar no limita la web: se puede leer entera y usar igual. Aceptar solo enciende la medición. La decisión se guarda dos años; pasado ese tiempo se vuelve a preguntar.",
        "Puedes cambiar de idea tantas veces como quieras desde el botón que hay al final de esta página. Al pulsarlo se borra lo elegido, se borran las cookies de Google y de Microsoft si estaban puestas y se vuelve a preguntar.",
      ],
    },
    {
      titulo: "Cómo borrarlas desde el navegador",
      parrafos: [
        "También puedes borrarlas desde los ajustes del navegador: en Chrome, «Privacidad y seguridad» → «Borrar datos de navegación»; en Safari, «Preferencias» → «Privacidad» → «Gestionar datos de sitios»; en Firefox, «Privacidad y seguridad» → «Cookies y datos del sitio»; en Edge, «Privacidad, búsqueda y servicios» → «Borrar datos de exploración».",
        "Si borras las cookies, la próxima vez que entres volverá a salir el cartel y la medición estará apagada hasta que aceptes.",
      ],
    },
    {
      titulo: "Las políticas de Google y Microsoft",
      parrafos: [
        "La medición la prestan Google y Microsoft, con sus propias políticas. Se pueden leer en policies.google.com/privacy y privacy.microsoft.com. Ahí se explica cómo tratan los datos que reciben.",
      ],
    },
    {
      titulo: "Si algo de esto cambia",
      parrafos: [
        "Si se añade una cookie o una herramienta nueva, se dice primero aquí y se vuelve a pedir permiso. Mientras esta página diga que solo hay estas, es que solo hay estas.",
        "La autoridad de control en España es la Agencia Española de Protección de Datos (aepd.es), y su guía de cookies es la que se ha seguido para escribir esta página.",
      ],
    },
  ],
}

export const documentosLegales = { avisoLegal, privacidad, cookies }
