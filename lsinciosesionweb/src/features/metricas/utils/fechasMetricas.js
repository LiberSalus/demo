// Genera una clave local YYYY-MM-DD para agrupar registros por dia calendario.
export function obtenerClaveDiaLocal(fechaEntrada = new Date()) {
  const fecha =
    fechaEntrada instanceof Date ? fechaEntrada : new Date(fechaEntrada);
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");

  return `${anio}-${mes}-${dia}`;
}
