// Limpia formatos comunes para guardar solo el valor real del token.
export function normalizarTokenSesion(valor) {
  if (typeof valor !== "string") return "";

  return valor
    .trim()
    .replace(/^"|"$/g, "")
    .replace(/^Bearer\s+/i, "")
    .trim();
}

// Ayuda a reconocer tokens dentro de respuestas no estandarizadas del backend.
function pareceTokenSesion(valor) {
  const token = normalizarTokenSesion(valor);

  return token.length > 20 && !/\s/.test(token);
}

// Busca un token visible en objetos simples o anidados.
function buscarTokenSesionEnObjeto(valor) {
  if (!valor || typeof valor !== "object") return "";

  const llavesPrioritarias = [
    "access_token",
    "accessToken",
    "token_acceso",
    "tokenAcceso",
    "token_de_acceso",
    "tokenDeAcceso",
    "token",
    "jwt",
    "access",
    "bearer",
    "authorization",
  ];

  for (const llave of llavesPrioritarias) {
    const token = normalizarTokenSesion(valor[llave]);
    if (token) return token;
  }

  for (const item of Object.values(valor)) {
    if (pareceTokenSesion(item)) return normalizarTokenSesion(item);

    const tokenAnidado = buscarTokenSesionEnObjeto(item);
    if (tokenAnidado) return tokenAnidado;
  }

  return "";
}

// Acepta texto u objeto y devuelve el access token si el backend lo expone.
export function obtenerTokenSesionDeRespuesta(datos) {
  if (typeof datos === "string" && datos.trim()) {
    const texto = normalizarTokenSesion(datos);

    try {
      return obtenerTokenSesionDeRespuesta(JSON.parse(texto));
    } catch {
      return texto;
    }
  }

  return buscarTokenSesionEnObjeto(datos);
}
