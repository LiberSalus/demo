// utilidades/curp.js
// Validación de formato y decodificación de CURP en el cliente (diseño REG-06):
// una CURP válida permite autocompletar sexo, fecha de nacimiento y entidad.

// Expresión estándar de la CURP mexicana (18 caracteres) con validacion de
// mes (01-12) y dia (01-31). El ultimo caracter (dígito verificador) se acepta
// alfanumerico porque el propio diseno de pen.dev usa ejemplos que terminan
// en letra (p. ej. MELV900715MDFNPL7A).
const REGEX_CURP =
  /^[A-Z][AEIOUX][A-Z]{2}\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])[HM](AS|BC|BS|CC|CL|CM|CS|CH|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z][0-9A-Z]$/

// Códigos INEGI de entidad federativa (posiciones 12-13 de la CURP).
const ENTIDADES = {
  AS: 'Aguascalientes',
  BC: 'Baja California',
  BS: 'Baja California Sur',
  CC: 'Campeche',
  CL: 'Coahuila',
  CM: 'Colima',
  CS: 'Chiapas',
  CH: 'Chihuahua',
  DF: 'Ciudad de México',
  DG: 'Durango',
  GT: 'Guanajuato',
  GR: 'Guerrero',
  HG: 'Hidalgo',
  JC: 'Jalisco',
  MC: 'Michoacán',
  MN: 'Morelos',
  MS: 'México',
  NT: 'Nayarit',
  NL: 'Nuevo León',
  OC: 'Oaxaca',
  PL: 'Puebla',
  QR: 'Quintana Roo',
  SP: 'San Luis Potosí',
  SL: 'Sinaloa',
  SR: 'Sonora',
  TC: 'Tabasco',
  TS: 'Tamaulipas',
  TL: 'Tlaxcala',
  VZ: 'Veracruz',
  YN: 'Yucatán',
  ZS: 'Zacatecas',
  NE: 'Nacido en el extranjero',
}

/** Comprueba que la CURP tenga el formato válido (mayúsculas, 18 caracteres). */
function esFormatoCurpValido(curp) {
  return REGEX_CURP.test(String(curp || '').toUpperCase())
}

/**
 * Decodifica una CURP válida.
 * Devuelve { sexo, fechaNacimiento, abrEntidad, estadoNacimiento } o null si el formato no es válido.
 * - sexo: 'H' | 'M' (posicion 11, mismo formato que guarda el backend en sex_curp).
 * - fechaNacimiento: 'AAAA-MM-DD' (posiciones 5-10; el siglo se infiere).
 * - abrEntidad / estadoNacimiento: codigo INEGI y nombre de la entidad (posiciones 12-13).
 */
function decodificarCurp(curp) {
  const valor = String(curp || '').toUpperCase()

  if (!REGEX_CURP.test(valor)) return null

  const anioDosDigitos = Number(valor.slice(4, 6))
  const mes = valor.slice(6, 8)
  const dia = valor.slice(8, 10)
  const anioCompleto =
    anioDosDigitos <= new Date().getFullYear() - 2000 ? 2000 + anioDosDigitos : 1900 + anioDosDigitos
  const abrEntidad = valor.slice(11, 13)

  return {
    sexo: valor.slice(10, 11),
    fechaNacimiento: `${anioCompleto}-${mes}-${dia}`,
    abrEntidad,
    estadoNacimiento: ENTIDADES[abrEntidad] || '',
  }
}

export { esFormatoCurpValido, decodificarCurp }
