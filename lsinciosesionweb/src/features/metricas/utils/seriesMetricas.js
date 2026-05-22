// Ordena registros cronologicamente usando el campo de fecha indicado.
export function ordenarPorFecha(registros = [], campoFecha = "fechaHoraISO") {
  return [...registros].sort(
    (actual, siguiente) =>
      new Date(actual[campoFecha]).getTime() -
      new Date(siguiente[campoFecha]).getTime()
  );
}
