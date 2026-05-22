//src\services\perfil.js
import api from "./apiClient";

const RUTAS_PERFIL = {
  fotoPerfil: "sesion/perfil/foto/perfil",
};

const CONFIG_CONSULTA_PERFIL = {
  omitirLimpiezaSesion: true,
};

// Convierte un data URL generado por el cropper a File para enviarlo como multipart.
function dataUrlAFile(dataUrl, nombre = "foto-perfil.jpg") {
  const [metadata, contenidoBase64] = String(dataUrl).split(",");
  const mime = metadata.match(/data:(.*?);base64/)?.[1] || "image/jpeg";
  const binario = atob(contenidoBase64 || "");
  const bytes = new Uint8Array(binario.length);

  for (let i = 0; i < binario.length; i += 1) {
    bytes[i] = binario.charCodeAt(i);
  }

  return new File([bytes], nombre, { type: mime });
}

// Normaliza la respuesta cuando el backend envia JSON aunque se solicite como blob.
async function normalizarRespuestaFoto(data) {
  if (!(data instanceof Blob) || !data.type.includes("application/json")) return data;

  const texto = await data.text();
  if (!texto) return null;

  try {
    return JSON.parse(texto);
  } catch {
    return texto;
  }
}

// Obtiene la foto del perfil; normalmente llega como Blob de imagen.
export async function obtenerFotoPerfil(size = "original") {
  const { data } = await api.get(RUTAS_PERFIL.fotoPerfil, {
    ...CONFIG_CONSULTA_PERFIL,
    params: { size },
    responseType: "blob",
  });

  return normalizarRespuestaFoto(data);
}

// Sube la foto de perfil usando el campo multipart "file" esperado por el backend.
export async function subirFotoPerfil(file) {
  const archivo = typeof file === "string" && file.startsWith("data:")
    ? dataUrlAFile(file)
    : file;
  const formulario = new FormData();

  formulario.append("file", archivo);

  const { data } = await api.post(RUTAS_PERFIL.fotoPerfil, formulario);
  return data;
}

export const getProfilePhoto = obtenerFotoPerfil;
export const uploadProfilePhoto = subirFotoPerfil;

