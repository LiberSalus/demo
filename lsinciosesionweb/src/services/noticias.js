import api from "./apiClient";

const RUTAS_NOTICIAS = {
  listarNoticias: "news/getListNews",
};

const CONFIG_CONSULTA_NOTICIAS = {
  omitirLimpiezaSesion: true,
};

// Limpia entidades HTML comunes que llegan en los titulos de noticias externas.
function limpiarTextoNoticia(valor) {
  return String(valor || "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Da formato corto a la fecha para mostrarla como apoyo visual en la tarjeta.
function formatearFechaNoticia(fecha) {
  if (!fecha) return "";

  const fechaNoticia = new Date(fecha);
  if (Number.isNaN(fechaNoticia.getTime())) return "";

  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(fechaNoticia);
}

// Convierte la noticia del backend al contrato que consume la tarjeta de Inicio.
function normalizarNoticia(noticia) {
  return {
    id: noticia?.id,
    titulo: limpiarTextoNoticia(noticia?.titulo),
    autor: limpiarTextoNoticia(noticia?.autor),
    fecha: noticia?.fecha || "",
    fechaTexto: formatearFechaNoticia(noticia?.fecha),
    imagen: noticia?.imagenPrincipal || "",
    link: noticia?.link || "",
  };
}

// Consulta el listado de noticias y lo devuelve listo para pintar en Inicio.
export async function obtenerNoticiasInicio() {
  const { data } = await api.get(
    RUTAS_NOTICIAS.listarNoticias,
    CONFIG_CONSULTA_NOTICIAS
  );

  if (!Array.isArray(data)) return [];

  return data.map(normalizarNoticia).filter((noticia) => noticia.titulo);
}
